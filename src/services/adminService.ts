import { supabase } from './supabaseClient';
import type { ProjectMember, ProjectMemberWithUser, UpdateProjectMember } from '../components/types/projectMember';
import type { Project, NewProject } from '../components/types/project';

/**
 * プロジェクトを作成
 */
export const createProject = async (project: NewProject, creatorUserId: string): Promise<Project> => {
  try {
    console.log('🏗️ プロジェクト作成開始...', project);
    
    // 認証状態を確認
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('セッション取得エラー:', sessionError);
      throw new Error('認証セッションの取得に失敗しました');
    }
    
    if (!session) {
      console.error('認証セッションが存在しません');
      throw new Error('ログインが必要です');
    }
    
    console.log('認証セッション確認完了:', session.user.id);
    
    // プロジェクトを作成
    const { data: projectData, error: projectError } = await supabase
      .from('project')
      .insert({
        ...project,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (projectError) {
      console.error('プロジェクト作成エラー:', projectError);
      throw new Error(`プロジェクト作成に失敗しました: ${projectError.message}`);
    }
    
    if (!projectData) {
      console.error('プロジェクト作成失敗: projectData が null');
      throw new Error('プロジェクト作成に失敗しました');
    }

    console.log('プロジェクト作成成功, project ID:', projectData.id);

    // 作成者を管理者として追加
    console.log('プロジェクトメンバーに作成者を追加中...');
    const { error: memberError } = await supabase
      .from('project_members')
      .insert({
        project_id: projectData.id,
        user_id: creatorUserId,
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (memberError) {
      console.error('プロジェクトメンバー追加エラー:', memberError);
      throw new Error(`プロジェクトメンバーの追加に失敗しました: ${memberError.message}`);
    }

    console.log('プロジェクトメンバー追加成功');
    return projectData as Project;
    
  } catch (error) {
    console.error('createProject 全体エラー:', error);
    throw error;
  }
};

/**
 * プロジェクトの全メンバーを取得
 */
export const getProjectMembers = async (projectId: string): Promise<ProjectMemberWithUser[]> => {
  // まずproject_membersを取得
  const { data: membersData, error: membersError } = await supabase
    .from('project_members')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  if (membersError) {
    console.error('project_members取得エラー:', membersError);
    throw membersError;
  }

  if (!membersData || membersData.length === 0) {
    return [];
  }

  // 各メンバーのユーザー情報を取得
  const userIds = membersData.map(member => member.user_id);
  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select('id, user_name, email')
    .in('id', userIds);

  if (usersError) {
    console.error('users取得エラー:', usersError);
    throw usersError;
  }

  // データを結合
  const result = membersData.map(member => {
    const user = usersData?.find(u => u.id === member.user_id);
    return {
      id: member.id,
      role: member.role,
      is_active: member.is_active,
      user_name: user?.user_name || '不明',
      email: user?.email || '不明',
    } as ProjectMemberWithUser;
  });

  return result;
};

/**
 * プロジェクトにメンバーを追加
 */
export const addProjectMember = async (
  projectId: string,
  userId: string,
  role: 'admin' | 'member' = 'member'
): Promise<ProjectMember> => {
  const { data, error } = await supabase
    .from('project_members')
    .insert({
      project_id: projectId,
      user_id: userId,
      role,
      is_active: true,
    })
    .select()
    .single();

  if (error || !data) throw error || new Error('メンバー追加に失敗しました');
  return data as ProjectMember;
};

/**
 * プロジェクトメンバーの役割を変更
 */
export const updateProjectMemberRole = async (
  memberId: string,
  updates: UpdateProjectMember
): Promise<ProjectMember> => {
  const { data, error } = await supabase
    .from('project_members')
    .update(updates)
    .eq('id', memberId)
    .select()
    .single();

  if (error || !data) throw error || new Error('役割更新に失敗しました');
  return data as ProjectMember;
};

/**
 * プロジェクトメンバーを無効化
 */
export const deactivateProjectMember = async (memberId: string): Promise<void> => {
  const { error } = await supabase
    .from('project_members')
    .update({ is_active: false })
    .eq('id', memberId);

  if (error) throw error;
};

/**
 * プロジェクトメンバーを削除
 */
export const removeProjectMember = async (memberId: string): Promise<void> => {
  const { error } = await supabase
    .from('project_members')
    .delete()
    .eq('id', memberId);

  if (error) throw error;
};

/**
 * ユーザーを無効化（全プロジェクトで）
 */
export const deactivateUser = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .update({ is_active: false })
    .eq('id', userId);

  if (error) throw error;
};

/**
 * ユーザーを有効化
 */
export const activateUser = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .update({ is_active: true })
    .eq('id', userId);

  if (error) throw error;
};

/**
 * プロジェクトの管理者を確認
 */
export const isProjectAdmin = async (projectId: string, userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('project_members')
    .select('role')
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (error) return false;
  return data?.role === 'admin';
};

/**
 * 全プロジェクトを取得
 */
export const getAllProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('project')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Project[];
};

/**
 * ユーザーが所属するプロジェクトを取得
 */
export const getUserProjects = async (userId: string): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('project_members')
    .select('project:project_id(*)')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (error) {
    console.error('getUserProjects エラー:', error);
    throw error;
  }
  
  return data.map((item: any) => item.project) as Project[];
};

/**
 * プロジェクトコードでプロジェクトを検索
 */
export const getProjectByCode = async (projectCode: string): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('project')
    .select('*')
    .eq('code', projectCode)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // プロジェクトが見つからない
    }
    throw error;
  }
  return data as Project;
};

