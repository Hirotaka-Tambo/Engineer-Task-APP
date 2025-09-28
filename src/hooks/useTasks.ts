import { useState, useCallback } from "react";
import type { ExtendedTask, NewTaskUI, TaskStatus } from "../components/types/task";

// テストのための仮データ

const initialTasks: ExtendedTask[] = [
  {
    id: 1,
    title: "typesでの型定義",
    taskstatus: "todo",
    priority: 3,
    tag: "feature",
    icon: undefined,
    createdBy: "田原",
    assignedTo: "反保",
    deadline: new Date(),
    createdAt: new Date(),
    oneLine: "型の要素は要件定義を参照",
    relatedUrl:undefined,
    memo: "完了次第、gituhubでPRが必須",
  },
];

export const useTasks = () => {
  const [tasks, setTasks] = useState<ExtendedTask[]>(initialTasks);

    // タスクの追加
    const addTask = useCallback((newTask: NewTaskUI | ExtendedTask) => {
        const id = Date.now(); // 仮のIDを発行
        const createdAt = new Date();
        
        // ExtendedTaskの場合は既存のデータを使用、NewTaskの場合は新しいデータを作成
        const taskToAdd: ExtendedTask ={
          ...newTask,
          id,
          createdAt
        };
            
        setTasks((prev) => [...prev, taskToAdd]);
    }, []);

  // タスクの削除
  const deleteTask = useCallback((id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }, []);

  // タスクの完了状態を切り替える
  const toggleTaskStatus = useCallback((id: number) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        let newStatus: TaskStatus;
        switch (task.taskstatus) {
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
        return { ...task, taskstatus: newStatus };
      })
    );
  }, []);
    

  // タスクの更新
  const updateTask = useCallback((updatedTask: ExtendedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  }, []);

  return {
    tasks,
    addTask,
    deleteTask,
    toggleTaskStatus,
    updateTask,
  };
};
