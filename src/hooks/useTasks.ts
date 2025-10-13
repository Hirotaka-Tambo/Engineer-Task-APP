import { useState, useCallback, useMemo, useEffect } from "react";
import { type ExtendedTask, type NewTaskUI, type TaskStatus, type NewTaskDB, toExtendedTask } from "../components/types/task";
import { getTasksByProjectId, createTask, updateTask as updateTaskDB, deleteTask as deleteTaskDB } from "../services/taskService";
import { getCurrentUser } from "../services/authService";
import {getUserIdByUserName, getUsersByProjectId} from "../services/userService"
import { useProject } from "../contexts/ProjectContext";

export type TaskFilter = {
  type: 'solo' | 'front' | 'back' | 'setting' | 'team' | 'all';
  category?: 'front' | 'back' | 'setting' | 'all';
};

export const useTasks = () => {
  const { selectedProjectId } = useProject();
  const [tasks, setTasks] = useState<ExtendedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 現在のフィルタリング状態
  const [currentFilter, setCurrentFilter] = useState<TaskFilter>({ 
      type: 'all'
  }); 

  // タスク一覧を取得する関数
  const fetchTasks = useCallback(async () => {
    if (!selectedProjectId) {
      console.log('プロジェクトIDが設定されていません');
      setTasks([]);
      return;
    }
    
    try {
      console.log('タスク取得中... プロジェクトID:', selectedProjectId);
      const tasksData = await getTasksByProjectId(selectedProjectId);
      console.log('タスク取得成功:', tasksData.length, '件');
      console.log('取得したタスクデータ:', tasksData);
      
      const users = await getUsersByProjectId(selectedProjectId);
      const extendedTasks = tasksData.map((task) =>{
        const createdByUser = users.find(u => u.id === task.created_by);
        const assignedToUser = users.find(u => u.id === task.assigned_to);

        return toExtendedTask(
          task,
          createdByUser?.user_name ?? "不明",
          assignedToUser?.user_name ?? "未担当"
        );
      });
      setTasks(extendedTasks);
      
      setTasks(extendedTasks);
    } catch (error) {
      console.error('タスク取得エラー:', error);
      setTasks([]);
    }
  }, [selectedProjectId]);

  // 初回マウント時：ユーザー情報を取得
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('useTasks初期化開始');
        // 現在のユーザー情報を取得
        const user = await getCurrentUser();
        if (user) {
          setCurrentUserId(user.id);
          console.log('ユーザーID取得:', user.id);
        } else {
          console.warn('ユーザー情報が取得できませんでした');
        }
        console.log('useTasks初期化完了');
      } catch (error) {
        console.error('初期化エラー:', error);
      } finally {
        console.log('loading を false に設定');
        setLoading(false);
      }
    };

    initialize();
  }, []);

  // 選択されたプロジェクトIDが変更されたらタスクを取得
  useEffect(() => {
    if (selectedProjectId) {
      fetchTasks();
    }
  }, [selectedProjectId, fetchTasks]);

  // フィルタを更新する関数
  const setFilter = useCallback((filter: TaskFilter) => {
      setCurrentFilter(filter);
  },[]);


  // タスクのフィルタリング処理
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      switch (currentFilter.type) {
        case "team":
          return true;
        case "solo":
          return task.taskCategory.includes("solo");
        case "front":
          return task.taskCategory.includes("front");
        case "back":
          return task.taskCategory.includes("back");
        case "setting":
          return task.taskCategory.includes("setting");
        case "all":
        default:
          return true;
      }
  });
  },[tasks,currentFilter]);

    // タスクの追加
    const addTask = useCallback(async (newTask: NewTaskUI | ExtendedTask) => {
      if (!currentUserId) {
        console.error('ユーザーIDが取得できていません');
        return;
      }

      try {
        console.log('タスク作成処理開始:');
        console.log('  - 現在のユーザーID:', currentUserId);
        console.log('  - 選択されたプロジェクトID:', selectedProjectId);
        console.log('  - タスクタイトル:', newTask.title);
        
        if (!selectedProjectId) {
          console.error('プロジェクトIDが設定されていません');
          return;
        }
        
        // 担当者のユーザーIDを取得
        let assignedToUserId = currentUserId; // デフォルトは現在のユーザー
        if (newTask.assignedTo && newTask.assignedTo !== '') {
          const userId = await getUserIdByUserName(newTask.assignedTo, selectedProjectId);
          if (userId) {
            assignedToUserId = userId;
          }
        }

        // NewTaskDBに変換
        const taskToCreate: NewTaskDB = {
          title: newTask.title,
          task_status: newTask.taskStatus,
          priority: newTask.priority,
          task_category: newTask.taskCategory,
          icon: newTask.icon,
          created_by: currentUserId,
          assigned_to: assignedToUserId,
          deadline: newTask.deadline.toISOString(),
          one_line: newTask.oneLine,
          memo: newTask.memo,
          related_url: newTask.relatedUrl,
          project_id: selectedProjectId,
        };

        console.log('作成するタスクデータ:');
        console.log('  - created_by:', taskToCreate.created_by);
        console.log('  - assigned_to:', taskToCreate.assigned_to);
        console.log('  - assigned_to_username:', newTask.assignedTo);
        console.log('  - project_id:', taskToCreate.project_id);
        await createTask(taskToCreate);
        console.log('タスク作成成功');
        
        // タスク一覧を再取得
        await fetchTasks();
      } catch (error) {
        console.error('タスク作成エラー:', error);
      }
    }, [currentUserId, selectedProjectId, fetchTasks]);

  // タスクの削除
  const deleteTask = useCallback(async (id: string) => {
    try {
      console.log('タスク削除中...', id);

      await deleteTaskDB(String(id));
      console.log('タスク削除成功');
      
      // タスク一覧を再取得
      await fetchTasks();
    } catch (error) {
      console.error('タスク削除エラー:', error);
    }
  }, [fetchTasks]);

  // タスクの完了状態を切り替える
  const toggleTaskStatus = useCallback(async (id: string) => {
    try {
      // 現在のタスクを見つける
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      let newStatus: TaskStatus;
      switch (task.taskStatus) {
        case "todo":
          newStatus = "in-progress";
          break;
        case "in-progress":
          newStatus = "done";
          break;
        case "done":
        default:
          newStatus = "todo";
          break;
      }

      console.log('タスクステータス更新中...', id, newStatus);
      
      // TODO: taskのidをuuidに変更する必要がある
      await updateTaskDB(String(id), { task_status: newStatus });
      console.log('タスクステータス更新成功');
      
      // タスク一覧を再取得
      await fetchTasks();
    } catch (error) {
      console.error('タスクステータス更新エラー:', error);
    }
  }, [tasks, fetchTasks]);
    

  // タスクの更新
  const updateTask = useCallback(async (updatedTask: ExtendedTask) => {
    if (!updatedTask.id) return;

    try {
      console.log('タスク更新中...', updatedTask.id);
      
      // ExtendedTaskからUpdateTaskDBに変換
      const updates = {
        title: updatedTask.title,
        task_status: updatedTask.taskStatus,
        priority: updatedTask.priority,
        task_category: updatedTask.taskCategory,
        icon: updatedTask.icon,
        deadline: updatedTask.deadline.toISOString(),
        one_line: updatedTask.oneLine,
        memo: updatedTask.memo,
        related_url: updatedTask.relatedUrl,
      };

      await updateTaskDB(String(updatedTask.id), updates);
      console.log('タスク更新成功');
      
      // タスク一覧を再取得
      await fetchTasks();
    } catch (error) {
      console.error('タスク更新エラー:', error);
    }
  }, [fetchTasks]);

  return {
    tasks: filteredTasks,
    loading,
    addTask,
    deleteTask,
    toggleTaskStatus,
    updateTask,
    currentFilter,
    setFilter,
    refreshTasks: fetchTasks,
  };
};
