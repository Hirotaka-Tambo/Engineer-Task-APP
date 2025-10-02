import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import type { User } from '../components/types/user';

/**
 * useAuth フック
 * - Supabase 認証状態を監視
 * - userテーブル情報を取得
 * - 管理者 role の判定を含む
 * - タイムアウト付きで安全に loading を終了
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // ユーザー情報取得処理（タイムアウト付き）
    const fetchUserData = async (userId: string, email?: string) => {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('タイムアウト: 5秒経過')), 5000)
        );

        const fetchPromise = supabase
          .from('user')
          .select('*')
          .eq('id', userId)
          .single();

        const result = await Promise.race([fetchPromise, timeoutPromise]);
        const { data, error } = result as { data: User | null; error: any };

        if (!isMounted) return null;

        if (error || !data) {
          console.warn('userテーブル取得失敗、フォールバックで作成', error);
          return {
            id: userId,
            user_name: email?.split('@')[0] || 'ユーザー',
            email: email || '',
            role: 'member',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as User;
        }

        return data as User;
      } catch (err) {
        console.error('fetchUserData エラー:', err);
        return {
          id: userId,
          user_name: email?.split('@')[0] || 'ユーザー',
          email: email || '',
          role: 'member',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as User;
      }
    };

    // 初回チェック
    const checkAuth = async () => {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (authError || !authUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        const userData = await fetchUserData(authUser.id, authUser.email);
        if (!isMounted) return;

        setUser(userData);
      } catch (error) {
        console.error('checkAuth エラー:', error);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();

    // 認証状態変更の監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        const userData = await fetchUserData(session.user.id, session.user.email);
        if (!isMounted) return;
        setUser(userData);
      } else {
        setUser(null);
      }

      if (isMounted) setLoading(false);
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
