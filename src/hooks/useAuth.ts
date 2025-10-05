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
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // ユーザー情報取得処理（タイムアウト付き）
    const fetchUserData = async (userId: string, _email?: string) => {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('タイムアウト: 30秒経過')), 30000)
        );

        const fetchPromise = supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        const result = await Promise.race([fetchPromise, timeoutPromise]);
        const { data, error } = result as { data: User | null; error: any };

        if (!isMounted) return null;

        if (error || !data) {
          console.error('usersテーブル取得失敗:', error);
          throw new Error('ユーザー情報の取得に失敗しました。再度ログインしてください。');
        }

        // デバッグ情報を表示
        console.log('🔍 ユーザー情報取得成功:');
        console.log('  - ユーザーID:', data.id);
        console.log('  - メールアドレス:', data.email);
        console.log('  - ユーザー名:', data.user_name);
        console.log('  - 役割:', data.role);
        console.log('  - プロジェクトID:', data.project_id || '未設定');
        console.log('  - アクティブ状態:', data.is_active);
        
        return data as User;
      } catch (err) {
        console.error('fetchUserData エラー:', err);
        throw err;
      }
    };

    // 認証状態変更の監視（初回チェックも含む）
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      console.log('🔄 認証状態変更:', event);
      console.log('  - Supabase Auth ユーザーID:', session?.user?.id);
      console.log('  - メールアドレス:', session?.user?.email);

      // TOKEN_REFRESHEDイベントは無視（重複実行を防ぐ）
      if (event === 'TOKEN_REFRESHED') {
        return;
      }

      if (session?.user) {
        const userData = await fetchUserData(session.user.id, session.user.email);
        if (!isMounted) return;
        setUser(userData);
      } else {
        setUser(null);
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
