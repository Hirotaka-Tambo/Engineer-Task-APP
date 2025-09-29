import React from "react";
import { useOutletContext } from "react-router-dom";
import TaskBoard from "../components/TaskBoard/TaskBoard";
import type { OutletContextType } from "../components/types/outletContext";

const SoloTask: React.FC = () => {
  const { tasks, onTaskClick, toggleTaskStatus } =
    useOutletContext<OutletContextType>();
  const soloTasks = tasks.filter((task) => task.taskCategory?.includes("solo"));

  return (
    <div className="container mx-auto p-4">
      <TaskBoard
        tasks={soloTasks}
        onTaskClick={onTaskClick}
        onToggleDone={toggleTaskStatus}
      />
    </div>
  );
};

export default SoloTask;
