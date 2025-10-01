import { useState, useCallback, useMemo, useEffect } from "react";
import type { ExtendedTask, NewTaskUI, TaskStatus, NewTaskDB } from "../components/types/task";
import { getTasksByProjectId, createTask, updateTask as updateTaskDB, deleteTask as deleteTaskDB } from "../services/taskService";
import { getCurrentUser } from "../services/authService";

// テストプロジェクトID（開発用）
const TEST_PROJECT_ID = "2dcafdb0-9a52-4294-85a0-792407b4a2ef";

export type TaskFilter = {
  type: 'solo' | 'front' | 'back' | 'setting' | 'team' | 'all';
  category?: 'front' | 'back' | 'setting' | 'all';
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<ExtendedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 現在のフィルタリング状態
  const [currentFilter, setCurrentFilter] = useState<TaskFilter>({ 
      type: 'all'
  }); 

  // タスク一覧を取得する関数
  const fetchTasks = useCallback(async () => {
    try {
      console.log('タスク取得中...');
      const tasksData = await getTasksByProjectId(TEST_PROJECT_ID);
      console.log('タスク取得成功:', tasksData.length, '件');
      console.log('取得したタスクデータ:', tasksData);
      
      // TaskUIをExtendedTaskに変換
      // 注意：DBのidはuuid（string）だが、ExtendedTaskのidはnumber（optional）
      // ユニークなキーとして、タイトルとcreatedAtの組み合わせを使用
      const extendedTasks: ExtendedTask[] = tasksData.map((task, index) => ({
        ...task,
        // 一時的にindexをidとして使用（Reactのkey用）
        id: index + 1,
      }));
      
      setTasks(extendedTasks);
    } catch (error) {
      console.error('タスク取得エラー:', error);
    }
  }, []);

  // 初回マウント時：ユーザー情報とタスクを取得
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

        // タスク一覧を取得
        await fetchTasks();
        console.log('useTasks初期化完了');
      } catch (error) {
        console.error('初期化エラー:', error);
      } finally {
        console.log('loading を false に設定');
        setLoading(false);
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 依存配列を空にして初回のみ実行

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
        console.log('タスク作成中...', newTask);
        
        // NewTaskDBに変換
        const taskToCreate: NewTaskDB = {
          title: newTask.title,
          task_status: newTask.taskStatus,
          priority: newTask.priority,
          task_category: newTask.taskCategory,
          icon: newTask.icon,
          created_by: currentUserId,
          assigned_to: currentUserId, // とりあえず自分をアサイン
          deadline: newTask.deadline.toISOString(),
          one_line: newTask.oneLine,
          memo: newTask.memo,
          related_url: newTask.relatedUrl,
          project_id: TEST_PROJECT_ID,
        };

        await createTask(taskToCreate);
        console.log('タスク作成成功');
        
        // タスク一覧を再取得
        await fetchTasks();
      } catch (error) {
        console.error('タスク作成エラー:', error);
      }
    }, [currentUserId, fetchTasks]);

  // タスクの削除
  const deleteTask = useCallback(async (id: number) => {
    try {
      console.log('タスク削除中...', id);
      // idは現状numberだが、実際はstring(uuid)なので後で型を調整
      await deleteTaskDB(String(id));
      console.log('タスク削除成功');
      
      // タスク一覧を再取得
      await fetchTasks();
    } catch (error) {
      console.error('タスク削除エラー:', error);
    }
  }, [fetchTasks]);

  // タスクの完了状態を切り替える
  const toggleTaskStatus = useCallback(async (id: number) => {
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
