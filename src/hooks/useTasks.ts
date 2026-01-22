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
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  // 現在のフィルタリング状態
  const [currentFilter, setCurrentFilter] = useState<TaskFilter>({ 
      type: 'all'
  }); 

  // タスク一覧を取得する関数
  const fetchTasks = useCallback(async () => {
    if (!selectedProjectId) {
      setTasks([]);
      return;
    }
    
    try {
      const tasksData = await getTasksByProjectId(selectedProjectId);
      
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
        // 現在のユーザー情報を取得
        const user = await getCurrentUser();
        if (user) {
          setCurrentUserId(user.id);
          setCurrentUserName(user.user_name);
        } else {
          console.warn('ユーザー情報が取得できませんでした');
        }
      } catch (error) {
        console.error('初期化エラー:', error);
      } finally {
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
          return task.taskCategory.includes("team");
        case "solo":
          // soloが含まれていて、かつ現在のユーザーが担当者
          return task.taskCategory.includes("solo") && 
                 task.assignedTo === currentUserName;
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
  },[tasks, currentFilter, currentUserName]);

    // タスクの追加
    const addTask = useCallback(async (newTask: NewTaskUI | ExtendedTask) => {
      if (!currentUserId) {
        console.error('ユーザーIDが取得できていません');
        return;
      }

      try {
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

        await createTask(taskToCreate);
        
        // タスク一覧を再取得
        await fetchTasks();
      } catch (error) {
        console.error('タスク作成エラー:', error);
      }
    }, [currentUserId, selectedProjectId, fetchTasks]);

  // タスクの削除
  const deleteTask = useCallback(async (id: string) => {
    try {
      await deleteTaskDB(String(id));
      
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

      // TODO: taskのidをuuidに変更する必要がある
      await updateTaskDB(String(id), { task_status: newStatus });
      
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
      // assignedToName → assignedToId に変換
      let assignedToId: string | undefined;
      if (updatedTask.assignedTo) {
        const userId = await getUserIdByUserName(updatedTask.assignedTo, selectedProjectId!);
        if (userId) assignedToId = userId;
    }

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
        ...(assignedToId && { assigned_to: assignedToId })
      };

      await updateTaskDB(String(updatedTask.id), updates);
      
      // タスク一覧を再取得
      await fetchTasks();
    } catch (error) {
      console.error('タスク更新エラー:', error);
    }
  }, [selectedProjectId,fetchTasks]);

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
