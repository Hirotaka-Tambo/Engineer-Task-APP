import React from "react";
import { useOutletContext } from "react-router-dom";
import TaskBoard from "../components/TaskBoard/TaskBoard";
import type { OutletContextType } from "../components/types/outletContext";


const SettingTask: React.FC = () => {
    const { tasks, onTaskClick, toggleTaskStatus, deleteTask, onShowConfirmModal } =
    useOutletContext<OutletContextType>();
    
    return (
    <div className="container mx-auto p-4">
        <TaskBoard
        tasks={tasks}
        onTaskClick={onTaskClick}
        onToggleDone={toggleTaskStatus}
        onDeleteTask={deleteTask}
        onShowConfirmModal={onShowConfirmModal}
        />
    </div>
    );
};

export default SettingTask;
