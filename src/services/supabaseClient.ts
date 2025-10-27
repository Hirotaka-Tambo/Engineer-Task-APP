import { createClient } from '@supabase/supabase-js';


// 環境変数からSupabaseの接続情報を取得
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


// 環境変数の検証（本番環境では厳格にチェック）
const isProduction = import.meta.env.PROD;

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = isProduction 
    ? 'Supabase URL and Anon Key must be provided in environment variables' 
    : 'Supabase設定が見つかりません。環境変数を確認してください。';
  
  if (isProduction) {
    throw new Error(errorMessage);
  } else {
    console.error(errorMessage);
    // 開発環境では警告のみ
  }
}

// Supabaseクライアントの作成（タイムアウト設定付き）
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'nexst-task',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },
  db: {
    schema: 'public'
  }
});

