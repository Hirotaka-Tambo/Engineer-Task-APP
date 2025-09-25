import React, { useState } from 'react';
import TaskCard from "../components/TaskCard/TaskCard";
import TaskModal from "../components/TaskModal/TaskModal";
import { useTasks } from "../hooks/useTasks"
import type { Task, ExtendedTask } from "../components/types/types";

// SoloTaskのプロパティ型定義
interface SoloTaskProps {
  tasks: ExtendedTask[];
  onTaskClick?: (task: ExtendedTask) => void;
}

const SoloTask: React.FC<SoloTaskProps> = ({ tasks, onTaskClick }) => {
    const {deleteTask, toggleTaskDone, updateTask} = useTasks();

    // 編集中のタスクを保持
    const [editingTask,setEditingTask] = useState<ExtendedTask | null>(null);

    // タスククリック時のハンドラー
    const handleTaskClick = (task: ExtendedTask) => {
        if (onTaskClick) {
            onTaskClick(task);
        } else {
            // フォールバック: ローカルでモーダル表示
            setEditingTask(task);
        }
    };

    // 編集ボタン押下
    const handleEditTask = (taskToEdit : Task)=>{
        setEditingTask(taskToEdit);
    }

    // モーダルを閉じる
    const closeModal = () =>{
        setEditingTask(null);
    }
    
    // モーダルでタスクが更新された時のハンドラ
    const handleUpdateTask = (updatedTask: Task)=>{
        updateTask(updatedTask);
        closeModal();
    }



    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.length === 0?(
                    <p className="text-center text-gray-500 col-span-full">タスクを追加してください。</p>
                ):(
                    tasks.map((task) =>(
                        <TaskCard
                            key = {task.id}
                            task={task}
                            onClick={handleTaskClick}
                            onToggleDone={toggleTaskDone}
                            onDelete={deleteTask}
                            onEdit={handleEditTask}
                        />
                    ))
                )}
            </div>

            {/*TaskModalの追加（フォールバック用）*/}
            {editingTask && !onTaskClick && (
                <TaskModal
                task = {editingTask}
                isOpen = {!!editingTask}
                onClose = {closeModal}
                onSave = {handleUpdateTask}
                />
            )}

        </div>
    );
};

export default SoloTask;