import React from "react";
import { useOutletContext } from "react-router-dom";
import TaskBoard from "../components/TaskBoard/TaskBoard";
import type { OutletContextType } from "../components/types/outletContext";


const SettingTask: React.FC = () => {
    const { tasks, onTaskClick, toggleTaskStatus, onShowConfirmModal } =
    useOutletContext<OutletContextType>();
    
    return (
    <div className="w-full">
        <TaskBoard
        tasks={tasks}
        onTaskClick={onTaskClick}
        onToggleDone={toggleTaskStatus}
        onShowConfirmModal={onShowConfirmModal}
        />
    </div>
    );
};

export default SettingTask;
