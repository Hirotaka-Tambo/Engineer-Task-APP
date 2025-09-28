import React, { useState } from "react";
import TaskBoard from "../components/TaskBoard/TaskBord";
import TaskModal from "../components/TaskModal/TaskModal";
import { useTasks } from "../hooks/useTasks";
import type { ExtendedTask, NewTaskUI } from "../components/types/task";


const SoloTask: React.FC= () => {
  const { tasks, toggleTaskStatus, updateTask } = useTasks();
  const [editingTask, setEditingTask] = useState<ExtendedTask | null>(null);

  const handleTaskClick = (task:ExtendedTask)=>{
    const safeTask: ExtendedTask ={
      ...task,
      createdAt: task.createdAt instanceof Date ? task.createdAt : new Date(task.createdAt),
      deadline: task.deadline instanceof Date ? task.deadline : new Date(task.deadline),
    };
    setEditingTask(safeTask);
  };

  const closeModal = () => setEditingTask(null);

  const handleUpdateTask = (updatedTask: ExtendedTask| NewTaskUI) => {
    if ("createdAt" in updatedTask) {
      updateTask(updatedTask);
    }
    closeModal();
  };

  return (
    <div className="container mx-auto p-4">
      <TaskBoard
        tasks={tasks}
        onTaskClick={handleTaskClick}
        onToggleDone={toggleTaskStatus}
      />

      {editingTask && (
        <TaskModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={closeModal}
          onSave={handleUpdateTask} // ExtendedTask で型が一致
        />
      )}
    </div>
  );
};

export default SoloTask;
