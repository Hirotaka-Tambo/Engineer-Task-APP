import React from "react";
import TaskCard from "../TaskCard/TaskCard";
import type { ExtendedTask } from "../types/task";

interface TaskBoardProps {
    tasks: ExtendedTask[];
    onTaskClick?: (task: ExtendedTask) => void;
    onToggleDone?: (taskId: number) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onTaskClick, onToggleDone }) => {
    const columns = [
        { key: "todo", label: "未着手" },
        { key: "in-progress", label: "進行中" },
        { key: "done", label: "完了" },
    ] as const;
    
    return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 items-start">
        {columns.map((col) => (
            <div key={col.key} className="bg-gray-50 p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-3">{col.label}</h2>
                {tasks.filter((task) => task.taskstatus === col.key).length === 0 ? (
                    <p className="text-gray-400 text-sm">タスクなし</p>
                ) : (
                    tasks
                    .filter((task) => task.taskstatus === col.key)
                    .map((task) => (
                <TaskCard
                key={task.id}
                task={task}
                onClick={onTaskClick}
                onToggleDone={onToggleDone}
                />
            ))
            )}
        </div>
    ))}
    </div>
    );
};

export default TaskBoard;
