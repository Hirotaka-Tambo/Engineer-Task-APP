import { useState, useCallback } from "react";
import type { Task, NewTask } from "../components/types/types";

// テストのための仮データ

const initialTasks: Task[] = [
    {id: 1 ,text : "typesでの型定義", done:false,priority: 3, tag: "feature", assign: "反保", 
    oneLine: "型の要素は要件定義を参照" , memo: "完了次第、gituhubでPRが必須", deadline: new Date(), createdAt: new Date(),
    },
];

export const useTasks = () =>{
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    // タスクの追加
    const addTask = useCallback((newTask: NewTask) => {
        const id = Date.now(); // 仮のIDを発行
        setTasks(prevTasks => [...prevTasks, { ...newTask, id, createdAt: new Date() }]);
    }, []);

     // タスクの削除
    const deleteTask = useCallback((id: number) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    }, []);

    // タスクの完了状態を切り替える
    const toggleTaskDone = useCallback((id: number) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id ? { ...task, done: !task.done } : task
            )
        );
    }, []);

    // タスクの更新
    const updateTask = useCallback((updatedTask: Task) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === updatedTask.id ? updatedTask : task
            )
        );
    }, []);

    return {
        tasks,
        addTask,
        deleteTask,
        toggleTaskDone,
        updateTask
    };

}


