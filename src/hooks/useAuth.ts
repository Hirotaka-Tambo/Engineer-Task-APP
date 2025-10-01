import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import type { User } from '../components/types/user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    console.log('useAuth useEffect 実行');

    // 初回の認証状態を確認
    const checkAuth = async () => {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (!isMounted) return;

        if (authError) {
          // 認証エラーは無視（ログアウト状態として扱う）
          console.warn('認証エラー（ログアウト状態）:', authError.message);
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (authUser) {
          console.log('認証ユーザー:', authUser.email);
          
          // userテーブルから詳細情報を取得（失敗してもOK）
          const { data: userData, error } = await supabase
            .from('user')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (!isMounted) return;

          if (error) {
            console.warn('userテーブル取得エラー（認証は成功）:', error);
            // userテーブルにデータがなくても、基本的な認証情報でUserオブジェクトを作成
            setUser({
              id: authUser.id,
              user_name: authUser.email?.split('@')[0] || 'ユーザー',
              email: authUser.email || '',
              is_active: true,
              role: 'member',
              created_at: authUser.created_at || new Date().toISOString(),
              updated_at: authUser.created_at || new Date().toISOString(),
            } as User);
          } else if (userData) {
            console.log('userテーブルデータ取得成功');
            setUser(userData as User);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('認証チェックエラー:', error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('認証状態変更イベント:', _event, session?.user?.email);
      
      if (!isMounted) {
        console.warn('コンポーネントがアンマウント済み。処理をスキップ');
        return;
      }
      
      try {
        console.log('🔸 認証状態変更処理開始');
        if (session?.user) {
          console.log('🔸 ユーザーセッションあり。userテーブル取得開始');
          
          // タイムアウト付きでuserテーブルから詳細情報を取得
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('タイムアウト: 5秒経過')), 5000)
          );
          
          const fetchPromise = supabase
            .from('user')
            .select('*')
            .eq('id', session.user.id)
            .single();

          let userData, error;
          try {
            const result = await Promise.race([fetchPromise, timeoutPromise]);
            userData = (result as any).data;
            error = (result as any).error;
            console.log('🔸 userテーブル取得完了。error:', error, 'userData:', !!userData);
          } catch (timeoutError) {
            console.error('🔸 userテーブル取得タイムアウト:', timeoutError);
            error = timeoutError;
          }

          if (!isMounted) {
            console.warn('ユーザーデータ取得中にアンマウント');
            return;
          }

          if (error) {
            console.warn('userテーブル取得エラー（認証は成功）:', error);
            // userテーブルにデータがなくても、基本的な認証情報でUserオブジェクトを作成
            const fallbackUser = {
              id: session.user.id,
              user_name: session.user.email?.split('@')[0] || 'ユーザー',
              email: session.user.email || '',
              is_active: true,
              role: 'member',
              created_at: session.user.created_at || new Date().toISOString(),
              updated_at: session.user.created_at || new Date().toISOString(),
            } as User;
            console.log('🔸 フォールバックユーザーを設定:', fallbackUser.email);
            setUser(fallbackUser);
          } else if (userData) {
            console.log('userテーブルデータ取得成功（認証変更時）');
            setUser(userData as User);
          } else {
            console.warn('🔸 userDataもerrorもない状態');
          }
        } else {
          // ログアウト時
          console.log('ログアウト');
          setUser(null);
        }
        console.log('🔸 認証状態変更処理完了');
      } catch (error) {
        console.error('認証状態変更処理エラー:', error);
        // エラーが発生してもログアウト状態として扱う
        setUser(null);
      } finally {
        // 必ずloadingをfalseにする
        if (isMounted) {
          console.log('loadingをfalseに設定（認証変更イベント）');
          setLoading(false);
        }
      }
    });

    // クリーンアップ
    return () => {
      console.log('useAuth クリーンアップ実行');
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, isAuthenticated: !!user };
};

