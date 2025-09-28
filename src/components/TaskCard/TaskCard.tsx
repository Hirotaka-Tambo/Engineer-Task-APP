import React from "react";
import PriorityBadge from "./PriorityBadge";
import type { ExtendedTask } from "../types/task";

interface TaskCardProps {
  task: ExtendedTask;
  onClick?: (task: ExtendedTask) => void;
  onToggleDone?: (taskId: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick}) =>{
  return (
    <div 
      className="bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white border-opacity-60 transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1 hover:shadow-xl w-full h-48 flex flex-col"
      onClick={() => onClick?.(task)}
    >
      {/*1列目 タイトル+ ステータス */}
      <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">
            {task.title}
          </h3>

          <span
          className={`px-2 py-1 text-xs rounded ${
            task.taskstatus === "todo"
              ? "bg-gray-200 text-gray-800"
              : task.taskstatus === "in-progress"
              ? "bg-blue-200 text-blue-800"
              : "bg-green-200 text-green-800"
          }`}
        >
          {task.taskstatus === "todo"
            ? "未着手"
            : task.taskstatus === "in-progress"
            ? "進行中"
            : "完了"}
        </span>
      </div>

      {/* 2列目 優先度 + タグ */}
      <div className="flex items-center gap-3 mb-2">
        <PriorityBadge priority={task.priority} />
        <span className="text-sm text-gray-600">#{task.tag}</span>
        {task.icon && (
          <img src={task.icon} alt="task icon" className="w-5 h-5" />
        )}
      </div>

      {/* 3列目 作成者 / 担当者 */}
      <div className="text-xs text-gray-500 mb-2">
        <span>作成: {task.createdBy}</span> /{" "}
        <span>担当: {task.assignedTo}</span>
      </div>

      {/* 4列目 日付 */}
      <div className="text-xs text-gray-500 mb-2">
        <span>作成日: {task.createdAt.toLocaleDateString()}</span> /{" "}
        <span>締切: {task.deadline.toLocaleDateString()}</span>
      </div>

      {/* 自由記述欄 (1行メモだけカード表示) */}
      <p className="text-sm text-gray-700 truncate">{task.oneLine}</p>
    </div>
  );
};

export default TaskCard;
