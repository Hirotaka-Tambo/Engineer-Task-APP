import React, { useState } from 'react';
import TaskCard from "../components/TaskCard/TaskCard";
import TaskForm from "../components/TaskForm/TaskForm";
import TaskModal from ".._components/TaskModal/TaskModal";
import { useTasks } from "../hooks/useTasks"
import type { Task } from "../components/types/types";

const SoloTask = () => {
    const {tasks, addTask, deleteTask, toggleTaskDone, updateTask} = useTasks();

    // 編集中のタスクを保持
    const [editingTask,setEditingTask] = useState<Task | null>(null);

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
            <h1 className="text -3x1 font-bold text-center text-gray-800 mb-8">
                個人タスク
            </h1>
            <TaskForm onAddTask={addTask} />
            <div className="mt-8 grid gp-4">
                {tasks.length === 0?(
                    <p className="text-center text-gray-500">タスクを追加してください。</p>
                ):(
                    tasks.map((task) =>(
                        <TaskCard
                            key = {task.id}
                            task={task}
                            onToggleDone={toggleTaskDone}
                            onDelete={deleteTask}
                            onEdit={handleEditTask}
                        />
                    ))
                )}
            </div>

            {/*TaskModalの追加*/}
            {editingTask &&(
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