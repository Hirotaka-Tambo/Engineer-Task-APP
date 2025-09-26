import React from "react";
import PriorityBadge from "./PriorityBadge";
import type { Task, TaskStatus } from "../types/task";

// 拡張されたTask型（types.tsの基本型に追加フィールドを加えたもの）
export interface ExtendedTask extends Task {
  status?: TaskStatus;
}

interface TaskCardProps {
  task: ExtendedTask;
  onClick?: (task: ExtendedTask) => void;
  onToggleDone?: (taskId: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onClick, 
  onToggleDone
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(task);
    }
  };


  const handleToggleDone = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleDone) {
      onToggleDone(task.id);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ja-JP", {
      month: "numeric",
      day: "numeric",
    });
  };

  return (
    <div 
      className="bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white border-opacity-60 transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1 hover:shadow-xl w-full h-48 flex flex-col"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 flex-1 pr-2 min-w-0">
          {onToggleDone && (
            <button
              onClick={handleToggleDone}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 flex-shrink-0 ${
                task.done 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'border-gray-300 hover:border-green-400'
              }`}
              title={task.done ? "完了を取り消し" : "完了にする"}
            >
              {task.done && "✓"}
            </button>
          )}
          <h3 className="text-base font-semibold m-0 leading-tight truncate min-w-0 flex-1 text-gray-800" title={task.text}>
            {task.text}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={task.priority} />
        </div>
      </div>
      
      <div className="flex flex-col flex-1">
        {/* 一行メモ（タイトルの下） */}
        {task.oneLine && (
          <div className="text-sm text-gray-600 truncate min-w-0 mt-2 mb-4" title={task.oneLine}>
            {task.oneLine}
          </div>
        )}

        {/* 右下の情報エリア */}
        <div className="mt-auto">
          {/* 担当者（上の段） */}
          {task.assign && (
            <div className="flex justify-start mb-3">
              <span className="text-xs text-gray-600 bg-white bg-opacity-30 px-2 py-1 rounded-lg border border-white border-opacity-40 truncate max-w-[120px]" title={`担当: ${task.assign}`}>
                担当: {task.assign}
              </span>
            </div>
          )}

          {/* 作成日、期限、言語タグを横一列（下の段） */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-gray-600 bg-white bg-opacity-30 px-2 py-1 rounded-lg border border-white border-opacity-40">
              作成: {formatDate(task.createdAt)}
            </span>
            
            {task.deadline && (
              <span className="text-gray-600 bg-white bg-opacity-30 px-2 py-1 rounded-lg border border-white border-opacity-40">
                期限: {formatDate(task.deadline)}
              </span>
            )}

            {task.tag && (
              <span className="text-blue-600 bg-blue-100 bg-opacity-50 px-2 py-1 rounded-lg border border-blue-200 border-opacity-40 truncate max-w-[80px]" title={`#${task.tag}`}>
                #{task.tag}
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TaskCard;
