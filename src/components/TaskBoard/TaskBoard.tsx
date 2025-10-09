import React from "react";
import TaskCard from "../TaskCard/TaskCard";
import type { ExtendedTask } from "../types/task";

interface TaskBoardProps {
    tasks: ExtendedTask[];
    onTaskClick?: (task: ExtendedTask) => void;
    onToggleDone?: (taskId: string) => void;
    onDeleteTask?: (taskId: string) => void;
    onShowConfirmModal?: (task: ExtendedTask) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onTaskClick, onToggleDone, onDeleteTask, onShowConfirmModal }) => {
    const columns = [
        { key: "todo", label: "未着手" },
        { key: "in-progress", label: "進行中" },
        { key: "done", label: "完了" },
    ] as const;

    // 期限別のタスク件数を計算する関数
    const getDeadlineCounts = (statusTasks: typeof tasks) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let safe = 0;      // 緑: 4日以上
        let warning = 0;   // 黄: 2-3日
        let urgent = 0;    // 赤: 0-1日または期限切れ
        
        statusTasks.forEach(task => {
            const deadlineDate = new Date(task.deadline);
            deadlineDate.setHours(0, 0, 0, 0);
            
            const oneDay = 1000 * 60 * 60 * 24;
            const diffTime = deadlineDate.getTime() - today.getTime();
            const daysRemaining = Math.ceil(diffTime / oneDay);
            
            if (daysRemaining >= 4) {
                safe++;
            } else if (daysRemaining >= 2) {
                warning++;
            } else {
                urgent++;
            }
        });
        
        return { safe, warning, urgent };
    };
    
    return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 items-start">
        {columns.map((col) => {
            const statusTasks = tasks.filter((task) => task.taskStatus === col.key);
            const deadlineCounts = getDeadlineCounts(statusTasks);
            
            return (
            <div key={col.key} className="bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white border-opacity-60" style={{ willChange: 'transform', transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold">
                        {col.label}
                        <span className="ml-2 text-sm font-normal text-gray-500">
                            ({statusTasks.length})
                        </span>
                    </h2>
                    
                    {/* 期限別件数表示 - 右側に配置（完了カラム以外で表示） */}
                    {statusTasks.length > 0 && col.key !== 'done' && (
                        <div className="flex items-center gap-2">
                            {/* 緑: 安全 (4日以上) */}
                            {deadlineCounts.safe > 0 && (
                                <>
                                    <div className="flex items-center gap-1">
                                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                            <span className="text-xs text-white font-bold">{deadlineCounts.safe}</span>
                                        </div>
                                        <span className="text-xs text-gray-700 font-bold">安全</span>
                                    </div>
                                    {(deadlineCounts.warning > 0 || deadlineCounts.urgent > 0) && (
                                        <div className="w-px h-4 bg-gray-300"></div>
                                    )}
                                </>
                            )}
                            
                            {/* 黄: 注意 (2-3日) */}
                            {deadlineCounts.warning > 0 && (
                                <>
                                    <div className="flex items-center gap-1">
                                        <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                                            <span className="text-xs text-white font-bold">{deadlineCounts.warning}</span>
                                        </div>
                                        <span className="text-xs text-gray-700 font-bold">注意</span>
                                    </div>
                                    {deadlineCounts.urgent > 0 && (
                                        <div className="w-px h-4 bg-gray-300"></div>
                                    )}
                                </>
                            )}
                            
                            {/* 赤: 緊急 (0-1日または期限切れ) */}
                            {deadlineCounts.urgent > 0 && (
                                <div className="flex items-center gap-1">
                                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-xs text-white font-bold">{deadlineCounts.urgent}</span>
                                    </div>
                                        <span className="text-xs text-gray-700 font-bold">緊急</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {statusTasks.length === 0 ? (
                    <p className="text-gray-400 text-sm">タスクなし</p>
                ) : (
                    <div className="space-y-3">
                        {statusTasks.map((task) => (
                    <TaskCard
                    key={task.id}
                    task={task}
                    onClick={onTaskClick}
                    onToggleDone={onToggleDone}
                    onDeleteTask={onDeleteTask}
                    onShowConfirmModal={onShowConfirmModal}
                    />
                ))}
                    </div>
            )}
        </div>
        );
        })}
    </div>
    );
};

export default TaskBoard;
