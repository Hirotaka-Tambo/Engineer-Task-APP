import React, { useState } from "react";
import TaskCard from "../components/TaskCard/TaskCard";
import TaskModal from "../components/TaskModal/TaskModal";
import { useTasks } from "../hooks/useTasks";
import type { ExtendedTask, NewTaskUI } from "../components/types/task";

interface SoloTaskProps {
  tasks: ExtendedTask[]; // id?: は外さないと TaskModal で型エラーになる
  onTaskClick?: (task: ExtendedTask) => void;
  onToggleDone?: (taskId: number) => void;
}

const SoloTask: React.FC<SoloTaskProps> = ({ tasks, onTaskClick, onToggleDone }) => {
  const { toggleTaskStatus: localToggleTaskDone, updateTask } = useTasks();
  const handleToggleDone = onToggleDone || localToggleTaskDone;

  const [editingTask, setEditingTask] = useState<ExtendedTask | null>(null);

  const handleTaskClick = (task: ExtendedTask) => {
    if (onTaskClick) {
      onTaskClick(task);
    } else {
      // createdAt と deadline が Date 型であることを保証
      const safeTask: ExtendedTask = {
        ...task,
        createdAt: task.createdAt instanceof Date ? task.createdAt : new Date(task.createdAt),
        deadline: task.deadline instanceof Date ? task.deadline : new Date(task.deadline),
      };
      setEditingTask(safeTask);
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">タスクを追加してください。</p>
        ) : (
          tasks.map((task ,index) => (
            <TaskCard
              key= {task.id ?? index}
              task={task}
              onClick={handleTaskClick}
              onToggleDone={handleToggleDone}
            />
          ))
        )}
      </div>

      {editingTask && !onTaskClick && (
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
