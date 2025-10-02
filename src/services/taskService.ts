import { supabase } from './supabaseClient';
import type { TaskDB, NewTaskDB, UpdateTaskDB, TaskUI } from '../components/types/task';
import { getUsersByIds } from './authService';

/*
 * 共通: TaskDB[] を TaskUI[] に変換
 */

const toTaskUI = (
  task: TaskDB,
  createdByName: string,
  assignedToName: string
): TaskUI => ({
  title: task.title,
  taskStatus: task.task_status,
  priority: task.priority,
  taskCategory: task.task_category,
  icon: task.icon,
  createdBy: createdByName,
  assignedTo: assignedToName,
  createdAt: new Date(task.created_at),
  deadline: new Date(task.deadline),
  oneLine: task.one_line,
  relatedUrl: task.related_url,
  memo: task.memo,
});


const fetchTasksWithUsers = async (tasks: TaskDB[]): Promise<TaskUI[]> => {
  if (tasks.length === 0) return [];

  // ユーザーIDを収集
  const userIds = Array.from(
    new Set(tasks.flatMap(task => [task.created_by, task.assigned_to]))
  );

  // ユーザー情報を一括取得
  const users = await getUsersByIds(userIds);
  const userMap = new Map(users.map(user => [user.id, user.user_name]));

  // TaskUI に変換
  return tasks.map(task =>
    toTaskUI(
      task,
      userMap.get(task.created_by) || 'Unknown',
      userMap.get(task.assigned_to) || 'Unknown'
    )
  );
};

/**
 * プロジェクトIDに基づいてタスクを取得
 */
export const getTasksByProjectId = async (projectId: string): Promise<TaskDB[]> => {
  const { data, error } = await supabase
    .from('task')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as TaskDB[];
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

  const tasks = await fetchTasksWithUsers([data as TaskDB]);
  return tasks[0] || null;
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
  return fetchTasksWithUsers(data as TaskDB[]);
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
  return fetchTasksWithUsers(data as TaskDB[]);
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
  return fetchTasksWithUsers(data as TaskDB[]);
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
  return fetchTasksWithUsers(data as TaskDB[]);
};
