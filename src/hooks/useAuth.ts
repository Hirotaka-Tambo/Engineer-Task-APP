import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import type { User } from "../components/types/user";

let userCache: { [key: string]: { data: User; timestamp: number } } = {};
const CACHE_DURATION = 10000; // 30秒

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async (userId: string, _email?: string, retryCount = 1):
    Promise<{data: User | null; status: "ok" | "timeout" | "error" }> => {
      
      // キャッシュチェック
      const cached = userCache[userId];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log("✅ キャッシュ命中 (useAuth):", cached.data);
        return { data: cached.data, status: "ok" };
      }

      // タイムアウト上限を8秒、タイムアウト時は null を返す
      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => {
          console.warn("⚠️ fetchUserData タイムアウト（8秒）→ null返却");
          resolve(null);
        }, 8000)
      );

      try {
        const fetchPromise = supabase
          .from("users")
          .select("id, user_name, email, role, project_id, is_active")
          .eq("id", userId)
          .single();

        const result = (await Promise.race([
          fetchPromise,
          timeoutPromise,
        ])) as { data: User | null; error: any } | null;

        // --- タイムアウト時のキャッシュ fallback ---
        if (result === null) {
          console.warn("⚠️ fetchUserData タイムアウト — キャッシュを使用します");
          return cached
              ? { data: cached.data, status: "ok" }
              : { data: null, status: "timeout" };
        }

        if (!result) return { data: null, status: "timeout" };
        if (result.error) throw result.error;

        if (result.data) {
          userCache[userId] = { data: result.data, timestamp: Date.now() };
          return { data: result.data, status: "ok" };
        }
        return { data: null, status: "error" };
      } catch (err) {
        console.error("fetchUserData エラー:", err);
        if (retryCount > 0) {
          console.warn(`再試行中... 残り ${retryCount} 回`);
          await new Promise((r) => setTimeout(r, 500));
          return fetchUserData(userId, _email, retryCount - 1);
      }
      return { data: null, status: "error" };
    }
  };

    // Supabase 認証状態監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        console.log("Auth Event:", event);

        // TOKEN_REFRESHED イベントは無視（無限ループ防止）
        if (event === "TOKEN_REFRESHED") return;

        if (session?.user) {
          const { data: userData, status } = await fetchUserData(session.user.id, session.user.email);

          if (!isMounted) return;
          
          if (status === "ok" && userData) {
            setUser(userData);
            console.log("✅ ユーザーデータ設定完了:", userData);
          } else if (status === "timeout") {
            console.warn("⚠️ fetchUserData タイムアウト。再試行待機またはスキップ");
            // userをnullにしないことでUIが壊れない
          } else {
            console.warn("❌ ユーザーデータ取得失敗");
          }
        } else {
          setUser(null);
          console.log("セッションなし → user=null");
        }

        if (isMounted) setLoading(false);
      }
    );

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
