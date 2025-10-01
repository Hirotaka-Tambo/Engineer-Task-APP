import { supabase } from './supabaseClient';
import type { TaskDB, NewTaskDB, UpdateTaskDB, TaskUI } from '../components/types/task';
import { toTaskUI } from '../components/types/task';
import { getUsersByIds } from './authService';

/**
 * プロジェクトIDに基づいてタスクを取得
 */
export const getTasksByProjectId = async (projectId: string): Promise<TaskUI[]> => {
  const { data, error } = await supabase
    .from('task')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const tasks = data as TaskDB[];
  
  // ユーザーIDを収集
  const userIds = new Set<string>();
  tasks.forEach(task => {
    userIds.add(task.created_by);
    userIds.add(task.assigned_to);
  });

  // ユーザー情報を一括取得
  const users = await getUsersByIds(Array.from(userIds));
  const userMap = new Map(users.map(user => [user.id, user.user_name]));

  // TaskUIに変換
  return tasks.map(task => 
    toTaskUI(
      task, 
      userMap.get(task.created_by) || 'Unknown',
      userMap.get(task.assigned_to) || 'Unknown'
    )
  );
};

/**
 * タスクIDに基づいて単一のタスクを取得
 */
export const getTaskById = async (taskId: string): Promise<TaskUI | null> => {
  const { data, error } = await supabase
    .from('task')
    .select('*')
    .eq('id', taskId)
    .single();

  if (error) throw error;
  if (!data) return null;

  const task = data as TaskDB;
  
  // ユーザー情報を取得
  const users = await getUsersByIds([task.created_by, task.assigned_to]);
  const userMap = new Map(users.map(user => [user.id, user.user_name]));

  return toTaskUI(
    task,
    userMap.get(task.created_by) || 'Unknown',
    userMap.get(task.assigned_to) || 'Unknown'
  );
};

/**
 * カテゴリ別にタスクを取得
 */
export const getTasksByCategory = async (projectId: string, category: string): Promise<TaskUI[]> => {
  const { data, error } = await supabase
    .from('task')
    .select('*')
    .eq('project_id', projectId)
    .contains('task_category', [category])
    .order('created_at', { ascending: false });

  if (error) throw error;

  const tasks = data as TaskDB[];
  
  // ユーザーIDを収集
  const userIds = new Set<string>();
  tasks.forEach(task => {
    userIds.add(task.created_by);
    userIds.add(task.assigned_to);
  });

  // ユーザー情報を一括取得
  const users = await getUsersByIds(Array.from(userIds));
  const userMap = new Map(users.map(user => [user.id, user.user_name]));

  // TaskUIに変換
  return tasks.map(task => 
    toTaskUI(
      task,
      userMap.get(task.created_by) || 'Unknown',
      userMap.get(task.assigned_to) || 'Unknown'
    )
  );
};

/**
 * 新規タスクを作成
 */
export const createTask = async (task: NewTaskDB): Promise<TaskDB> => {
  const { data, error } = await supabase
    .from('task')
    .insert(task)
    .select()
    .single();

  if (error) throw error;
  return data as TaskDB;
};

/**
 * タスクを更新
 */
export const updateTask = async (taskId: string, updates: UpdateTaskDB): Promise<TaskDB> => {
  const { data, error } = await supabase
    .from('task')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw error;
  return data as TaskDB;
};

/**
 * タスクを削除
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  const { error } = await supabase
    .from('task')
    .delete()
    .eq('id', taskId);

  if (error) throw error;
};

/**
 * 担当者別にタスクを取得
 */
export const getTasksByAssignedUser = async (userId: string, projectId: string): Promise<TaskUI[]> => {
  const { data, error } = await supabase
    .from('task')
    .select('*')
    .eq('project_id', projectId)
    .eq('assigned_to', userId)
    .order('deadline', { ascending: true });

  if (error) throw error;

  const tasks = data as TaskDB[];
  
  // ユーザーIDを収集
  const userIds = new Set<string>();
  tasks.forEach(task => {
    userIds.add(task.created_by);
    userIds.add(task.assigned_to);
  });

  // ユーザー情報を一括取得
  const users = await getUsersByIds(Array.from(userIds));
  const userMap = new Map(users.map(user => [user.id, user.user_name]));

  // TaskUIに変換
  return tasks.map(task => 
    toTaskUI(
      task,
      userMap.get(task.created_by) || 'Unknown',
      userMap.get(task.assigned_to) || 'Unknown'
    )
  );
};

/**
 * ステータス別にタスクを取得
 */
export const getTasksByStatus = async (projectId: string, status: string): Promise<TaskUI[]> => {
  const { data, error } = await supabase
    .from('task')
    .select('*')
    .eq('project_id', projectId)
    .eq('task_status', status)
    .order('priority', { ascending: true });

  if (error) throw error;

  const tasks = data as TaskDB[];
  
  // ユーザーIDを収集
  const userIds = new Set<string>();
  tasks.forEach(task => {
    userIds.add(task.created_by);
    userIds.add(task.assigned_to);
  });

  // ユーザー情報を一括取得
  const users = await getUsersByIds(Array.from(userIds));
  const userMap = new Map(users.map(user => [user.id, user.user_name]));

  // TaskUIに変換
  return tasks.map(task => 
    toTaskUI(
      task,
      userMap.get(task.created_by) || 'Unknown',
      userMap.get(task.assigned_to) || 'Unknown'
    )
  );
};

/**
 * 締め切りが近いタスクを取得（管理者用）
 */
export const getUpcomingTasks = async (projectId: string, daysAhead: number = 7): Promise<TaskUI[]> => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + daysAhead);

  const { data, error } = await supabase
    .from('task')
    .select('*')
    .eq('project_id', projectId)
    .gte('deadline', today.toISOString())
    .lte('deadline', futureDate.toISOString())
    .neq('task_status', 'done')
    .order('deadline', { ascending: true });

  if (error) throw error;

  const tasks = data as TaskDB[];
  
  // ユーザーIDを収集
  const userIds = new Set<string>();
  tasks.forEach(task => {
    userIds.add(task.created_by);
    userIds.add(task.assigned_to);
  });

  // ユーザー情報を一括取得
  const users = await getUsersByIds(Array.from(userIds));
  const userMap = new Map(users.map(user => [user.id, user.user_name]));

  // TaskUIに変換
  return tasks.map(task => 
    toTaskUI(
      task,
      userMap.get(task.created_by) || 'Unknown',
      userMap.get(task.assigned_to) || 'Unknown'
    )
  );
};
