import { supabase } from './supabaseClient';
import type { User } from '../components/types/user';

/**
 * メールアドレスとパスワードでログイン
 */
export const login = async (email: string, password: string) => {
  console.log('ログイン試行:', email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase Auth エラー:', error);
      throw error;
    }
    
    console.log('ログイン成功:', data);
    return data;
  } catch (err) {
    console.error('ログイン処理でエラー:', err);
    throw err;
  }
};

/**
 * 新規ユーザー登録
 */
export const signUp = async (email: string, password: string, userName: string) => {
  try {
    console.log('Supabase Authでユーザー作成開始...');
    
    // Supabase Authでユーザー作成
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Supabase Auth エラー:', authError);
      throw new Error(`認証エラー: ${authError.message}`);
    }
    
    if (!authData.user) {
      console.error('ユーザー作成失敗: authData.user が null');
      throw new Error('ユーザー作成に失敗しました');
    }

  // usersテーブルにユーザー情報を追加
  const { error: userError } = await supabase.from('users').insert({
    id: authData.user.id,
    user_name: userName,
    email: email,
    role: 'member',
    is_active: true,
  });

    // userテーブルにユーザー情報を追加
    console.log('userテーブルにユーザー情報を挿入中...');
    
    const { error: userError } = await supabase.from('user').insert({
      id: authData.user.id,
      user_name: userName,
      email: email,
      role: 'admin', // 新規登録時は管理者として設定
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (userError) {
      console.error('userテーブル挿入エラー:', userError);
      throw new Error(`ユーザー情報の保存に失敗しました: ${userError.message}`);
    }

    console.log('userテーブル挿入成功');
    
    return authData;
    
  } catch (error) {
    console.error('signUp 全体エラー:', error);
    throw error;
  }
};

/**
 * ログアウト
 */
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * 現在ログイン中のユーザー情報を取得（Supabase Auth）
 */
export const getCurrentAuthUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

/**
 * 現在ログイン中のユーザー情報を取得（usersテーブル）
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const authUser = await getCurrentAuthUser();
  if (!authUser) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (error) {
    // userテーブルにデータがない場合のフォールバック
    console.warn('userテーブルにデータが見つかりません、フォールバック処理を実行:', error);
    return {
      id: authUser.id,
      user_name: authUser.email?.split('@')[0] || 'ユーザー',
      email: authUser.email || '',
      role: 'member',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as User;
  }
  
  return data as User;
};

/**
 * ユーザーIDからユーザー情報を取得
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as User;
};

/**
 * 複数のユーザーIDからユーザー情報を一括取得
 */
export const getUsersByIds = async (userIds: string[]): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .in('id', userIds);

  if (error) throw error;
  return data as User[];
};

/**
 * プロジェクトに所属する全ユーザーを取得
 */
export const getUsersByProjectId = async (projectId: string): Promise<User[]> => {
  const { data, error } = await supabase
    .from('project_members')
    .select('user_id, users:user_id(*)')
    .eq('project_id', projectId)
    .eq('is_active', true);

  if (error) throw error;
  return data.map((item: any) => item.users) as User[];
};

/**
 * 認証状態の変化を監視
 */
export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
};
