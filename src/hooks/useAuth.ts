import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import type { User } from '../components/types/user';

/**
 * useAuth フック
 * - Supabase 認証状態を監視
 * - usersテーブル情報を取得
 * - 管理者 role の判定を含む
 * - タイムアウト付きで安全に loading を終了
 */
// ユーザーデータのキャッシュ
let userCache: { [key: string]: { data: User; timestamp: number } } = {};
const CACHE_DURATION = 30000; // 30秒

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // ユーザー情報取得処理（タイムアウト付き）
    const fetchUserData = async (userId: string, _email?: string, retryCount = 0) => {
      const maxRetries = 2;
      
      // キャッシュをチェック
      const cached = userCache[userId];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('✅ キャッシュからユーザーデータを取得 (タイムスタンプ:', new Date(cached.timestamp).toLocaleTimeString(), ')');
        return cached.data;
      }
      
      try {
        // タイムアウト（5秒）- 適切なタイムアウト時間に短縮
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('タイムアウト: 10秒経過')), 10000)
        );

        const fetchPromise = supabase
          .from('users')
          .select('id, user_name, email, role, project_id, is_active')
          .eq('id', userId)
          .single();

        const result = await Promise.race([fetchPromise, timeoutPromise]);
        const { data, error } = result as { data: User | null; error: any };

        if (!isMounted) return null;

        if (error) {
          // PGRST116エラー（データが見つからない）の場合は特別処理
          if (error.code === 'PGRST116') {
            console.warn('ユーザーデータが見つかりません。新規登録の可能性があります。');
            return null; // nullを返してエラーを投げない
          }
          console.error('usersテーブル取得失敗:', error);
          throw new Error('ユーザー情報の取得に失敗しました。再度ログインしてください。');
        }
        
        if (!data) {
          console.warn('ユーザーデータが空です。');
          return null;
        }

        // キャッシュに保存
        userCache[userId] = { data: data as User, timestamp: Date.now() };
        
        return data as User;
      } catch (err: any) {
        // PGRST116エラー（データが見つからない）の場合はリトライしない
        if (err.message?.includes('ユーザーデータが見つかりません')) {
          console.log('ユーザーデータが見つからないため、リトライをスキップします');
          return null;
        }
        
        console.error(`fetchUserData エラー (試行 ${retryCount + 1}/${maxRetries + 1}):`, err);
        
        // リトライ機能
        if (retryCount < maxRetries && isMounted) {
          console.log(`リトライ中... (${retryCount + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 500)); // 500ms待機に短縮
          return fetchUserData(userId, _email, retryCount + 1);
        }
        
        throw err;
      }
    };

    // 認証状態変更の監視（初回チェックも含む）
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      console.log('認証状態変更イベント:', event);

      // TOKEN_REFRESHEDイベントは無視（重複実行を防ぐ）
      if (event === 'TOKEN_REFRESHED') {
        console.log('TOKEN_REFRESHEDイベントを無視');
        return;
      }


      if (session?.user) {
        try {
          const userData = await fetchUserData(session.user.id, session.user.email);
          if (!isMounted) return;
          
          if (userData) {
            setUser(userData);
            console.log('ユーザーデータ設定完了');
          } else {
            // ユーザーデータが見つからない場合（新規登録直後など）
            console.log('ユーザーデータが見つかりません。セッションは維持します。');
            setUser(null);
          }
        } catch (error) {
          console.error('認証状態変更時のfetchUserDataエラー:', error);
          // エラーが発生してもローディング状態は解除
          if (isMounted) {
            setLoading(false);
          }
          return;
        }
      } else {
        setUser(null);
        console.log('ユーザーセッションなし');
      }

      if (isMounted) {
        setLoading(false);
      }
    });

    // クリーンアップ
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    role: user?.role ?? null,
    loading,
    isAuthenticated: !!user,
  };
};
