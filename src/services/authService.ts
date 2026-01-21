import { supabase } from './supabaseClient';
import type { User } from '../components/types/user';

/**
 * メールアドレスとパスワードでログイン
 */
export const login = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase Auth エラー:', error);
      throw error;
    }
    
    // ログイン成功後、プロジェクトメンバーシップをチェック
    if (data.user) {
      try {
        await ensureUserHasProject(data.user.id);
      } catch (projectError) {
        console.warn('プロジェクトメンバーシップの確認に失敗:', projectError);
        // プロジェクト確認の失敗は致命的ではないので、ログインは継続
      }
    }
    
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
    
    // Supabase Authでユーザー作成
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

  // usersテーブルにユーザー情報を追加
  const { data: userData, error: userError } = await supabase.from('users').insert({
    id: authData.user.id,
    user_name: userName,
    email: email,
    role: 'member',
    is_active: true,
  }).select().single();

  if (userError) {
    console.error('usersテーブル挿入エラー:', userError);
    throw userError;
  }

  // データが正しく挿入されたことを確認
  if (!userData) {
    throw new Error('ユーザーデータの挿入に失敗しました');
  }
  
  // 登録成功後は自動ログイン状態を維持
  // プロジェクト選択ページで初回プロジェクトを選択してもらう
  
  return { success: true, userData, userId: authData.user.id };
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
 * ユーザーがプロジェクトに所属していることを確認し、必要に応じてデフォルトプロジェクトに追加
 */
export const ensureUserHasProject = async (userId: string) => {
  // ユーザーが所属するプロジェクトをチェック
  const { data: userProjects, error } = await supabase
    .from('project_members')
    .select('project_id')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (error) {
    console.error('プロジェクトメンバーシップ確認エラー:', error);
    throw error;
  }

  if (!userProjects || userProjects.length === 0) {
    try {
      await addUserToDefaultProject(userId);
    } catch (projectError) {
      console.error('デフォルトプロジェクトへの追加に失敗:', projectError);
      // RLSポリシーの問題でプロジェクトに追加できない場合は、警告のみ
      console.warn('プロジェクトへの追加ができません。管理者に連絡してください。');
    }
  }
};

/**
 * デフォルトプロジェクトにユーザーを追加
 */
export const addUserToDefaultProject = async (userId: string) => {
  // 既存のデフォルトプロジェクトを検索
  const { data: existingProject, error: searchError } = await supabase
    .from('project')
    .select('*')
    .eq('name', 'デフォルトプロジェクト')
    .single();

  if (searchError && searchError.code !== 'PGRST116') {
    console.error('デフォルトプロジェクト検索エラー:', searchError);
    throw searchError;
  }

  let defaultProject;

  if (existingProject) {
    defaultProject = existingProject;
  } else {
    // RLSポリシーの問題を回避するため、まず既存のプロジェクトを確認
    const { data: allProjects, error: allProjectsError } = await supabase
      .from('project')
      .select('*')
      .limit(1);

    if (allProjectsError) {
      console.error('プロジェクト一覧取得エラー:', allProjectsError);
      throw new Error('プロジェクトテーブルへのアクセス権限がありません');
    }

    if (allProjects && allProjects.length > 0) {
      // 既存のプロジェクトがある場合は、最初のプロジェクトを使用
      defaultProject = allProjects[0];
    } else {
      // プロジェクトが全く存在しない場合は、RLSポリシーの問題の可能性が高い
      console.warn('プロジェクトテーブルにアクセスできません。RLSポリシーを確認してください。');
      throw new Error('プロジェクトテーブルへのアクセス権限がありません。管理者に連絡してください。');
    }
  }

  // ユーザーをプロジェクトメンバーとして追加
  const { error: memberError } = await supabase
    .from('project_members')
    .insert({
      project_id: defaultProject.id,
      user_id: userId,
      role: 'member',
      is_active: true,
    });

  if (memberError) {
    // 既にメンバーとして存在する場合はエラーを無視
    if (memberError.code === '23505') { // 重複キーエラー
      return;
    }
    console.error('プロジェクトメンバー追加エラー:', memberError);
    throw memberError;
  }
};

/**
 * 認証状態の変化を監視
 */
export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
};
