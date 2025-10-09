import { useState, useCallback, useMemo, useEffect } from "react";
import { type ExtendedTask, type NewTaskUI, type TaskStatus, type NewTaskDB, toExtendedTask } from "../components/types/task";
import { getTasksByProjectId, createTask, updateTask as updateTaskDB, deleteTask as deleteTaskDB } from "../services/taskService";
import { getCurrentUser, getUserIdByUserName } from "../services/authService";
import { getUserProjects } from "../services/adminService";

export type TaskFilter = {
  type: 'solo' | 'front' | 'back' | 'setting' | 'team' | 'all';
  category?: 'front' | 'back' | 'setting' | 'all';
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<ExtendedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  // 現在のフィルタリング状態
  const [currentFilter, setCurrentFilter] = useState<TaskFilter>({ 
      type: 'all'
  }); 

  // タスク一覧を取得する関数
  const fetchTasks = useCallback(async () => {
    if (!currentProjectId) {
      console.log('プロジェクトIDが設定されていません');
      return;
    }
    
    try {
      console.log('タスク取得中... プロジェクトID:', currentProjectId);
      const tasksData = await getTasksByProjectId(currentProjectId);
      console.log('タスク取得成功:', tasksData.length, '件');
      console.log('取得したタスクデータ:', tasksData);
      
      const extendedTasks = tasksData.map((task) =>
        toExtendedTask(task,"仮ユーザー","仮担当")
    );
      
      setTasks(extendedTasks);
    } catch (error) {
      console.error('タスク取得エラー:', error);
    }
  }, [currentProjectId]);

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
          
          // ユーザーが所属するプロジェクトを取得
          try {
            const userProjects = await getUserProjects(user.id);
            console.log('ユーザーのプロジェクト:', userProjects);
            
            if (userProjects.length > 0) {
              // 最初のプロジェクトを使用
              const firstProject = userProjects[0];
              setCurrentProjectId(firstProject.id);
              console.log('使用するプロジェクト:', firstProject.name, 'ID:', firstProject.id);
            } else {
              console.warn('ユーザーはどのプロジェクトにも所属していません');
              // デフォルトプロジェクトに追加を試行
              try {
                const { addUserToDefaultProject } = await import('../services/authService');
                await addUserToDefaultProject(user.id);
                console.log('デフォルトプロジェクトへの追加を試行しました');
                // 再取得を試行
                const retryProjects = await getUserProjects(user.id);
                if (retryProjects.length > 0) {
                  setCurrentProjectId(retryProjects[0].id);
                  console.log('デフォルトプロジェクトを設定しました:', retryProjects[0].name);
                }
              } catch (defaultProjectError) {
                console.error('デフォルトプロジェクトへの追加に失敗:', defaultProjectError);
              }
            }
          } catch (projectError) {
            console.error('プロジェクト取得エラー:', projectError);
            // プロジェクト取得に失敗した場合でもアプリを継続
          }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 依存配列を空にして初回のみ実行

  // プロジェクトIDが設定されたらタスクを取得
  useEffect(() => {
    if (currentProjectId) {
      fetchTasks();
    }
  }, [currentProjectId, fetchTasks]);

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
        console.log('  - 現在のプロジェクトID:', currentProjectId);
        console.log('  - タスクタイトル:', newTask.title);
        
        if (!currentProjectId) {
          console.error('プロジェクトIDが設定されていません');
          return;
        }
        
        // 担当者のユーザーIDを取得
        let assignedToUserId = currentUserId; // デフォルトは現在のユーザー
        if (newTask.assignedTo && newTask.assignedTo !== '') {
          const userId = await getUserIdByUserName(newTask.assignedTo, currentProjectId);
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
          project_id: currentProjectId,
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
    }, [currentUserId, currentProjectId, fetchTasks]);

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
