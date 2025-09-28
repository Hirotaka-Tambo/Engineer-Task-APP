import React from "react";
import PriorityBadge from "./PriorityBadge";
import type { ExtendedTask } from "../types/task";
import { getDeadlineStatus } from "../../utils/dateUtils";

interface TaskCardProps {
  task: ExtendedTask;
  onClick?: (task: ExtendedTask) => void;
  onToggleDone?: (taskId: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onToggleDone}) =>{
  // 残り日数に応じたスタイルを取得する関数
  const getDeadlineStyle = (deadline: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const oneDay = 1000 * 60 * 60 * 24;
    const diffTime = deadlineDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / oneDay);
    
    if (daysRemaining < 0) {
      return "bg-red-100 text-red-800 border-red-300";
    } else if (daysRemaining === 0) {
      return "bg-red-200 text-red-900 border-red-400 font-bold";
    } else if (daysRemaining === 1) {
      return "bg-orange-200 text-orange-800 border-orange-300 font-semibold";
    } else if (daysRemaining <= 3) {
      return "bg-yellow-200 text-yellow-800 border-yellow-300";
    } else {
      return "bg-green-100 text-green-800 border-green-300";
    }
  };
  return (
    <div 
      className="bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-lg border border-white border-opacity-60 transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1 hover:shadow-xl w-full flex flex-col"
      onClick={() => onClick?.(task)}
    >
      {/*1列目 タイトル+ ステータス */}
      <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">
            {task.title}
          </h3>

          {task.taskstatus === "done" ? (
            <span className="px-2 py-1 text-xs rounded bg-green-200 text-green-800">
              完了
            </span>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleDone?.(task.id!);
              }}
              className={`px-3 py-1 text-xs rounded transition-colors duration-200 font-medium ${
                task.taskstatus === "todo"
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  : "bg-blue-200 text-blue-800 hover:bg-blue-300"
              }`}
            >
              {task.taskstatus === "todo" ? "未着手" : "進行中"}
            </button>
          )}
      </div>

      {/* 2列目 優先度 + タグ */}
      <div className="flex items-center gap-3 mb-3">
        <PriorityBadge priority={task.priority} />
        <span className="text-xs text-blue-600 bg-white bg-opacity-30 px-2 py-1 rounded-xl border border-blue-600 ">
          #{task.groupCategory}
        </span>
        {/* 残り日数タグ */}
        <span className={`text-xs px-2 py-1 rounded-xl border ${getDeadlineStyle(task.deadline)}`}>
          {getDeadlineStatus(task.deadline)}
        </span>
        {task.icon && (
          <img src={task.icon} alt="task icon" className="w-5 h-5" />
        )}
      </div>

      {/* 3列目 作成者 / 担当者 */}
      <div className="text-xs text-gray-500 mb-3">
        <span>作成: {task.createdBy}</span> /{" "}
        <span>担当: {task.assignedTo}</span>
      </div>

      {/* 4列目 日付 */}
      <div className="text-xs text-gray-500 mb-3">
        <span>作成日: {task.createdAt.toLocaleDateString()}</span> /{" "}
        <span>締切: {task.deadline.toLocaleDateString()}</span>
      </div>

      {/* 自由記述欄 (1行メモだけカード表示) */}
      {task.oneLine && task.oneLine.trim() && (
        <p className="text-sm text-gray-700 truncate">{task.oneLine}</p>
      )}
    </div>
  );
};

export default TaskCard;
