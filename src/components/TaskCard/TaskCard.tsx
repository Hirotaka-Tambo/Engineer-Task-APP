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
  onEdit?: (task: ExtendedTask) => void;
  onDelete?: (taskId: number) => void;
  onToggleDone?: (taskId: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClick,
  onEdit,
  onDelete,
  onToggleDone,
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(task);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(task);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(task.id);
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
      className={`bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white border-opacity-60 transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1 hover:shadow-xl ${
        task.done ? "opacity-75" : ""
      }`}
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 flex-1 pr-2">
          {onToggleDone && (
            <button
              onClick={handleToggleDone}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                task.done
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300 hover:border-green-400"
              }`}
              title={task.done ? "完了を取り消し" : "完了にする"}
            >
              {task.done && "✓"}
            </button>
          )}
          <h3
            className={`text-base font-semibold m-0 leading-tight ${
              task.done ? "line-through text-gray-500" : "text-gray-800"
            }`}
          >
            {task.text}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={task.priority} />
          {(onEdit || onDelete) && (
            <div className="flex gap-1 ml-2">
              {onEdit && (
                <button
                  onClick={handleEditClick}
                  className="text-gray-500 hover:text-blue-600 transition-colors duration-200 text-sm"
                  title="編集"
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDeleteClick}
                  className="text-gray-500 hover:text-red-600 transition-colors duration-200 text-sm"
                  title="削除"
                >
                  🗑️
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600 bg-white bg-opacity-30 px-2 py-1 rounded-lg border border-white border-opacity-40">
            作成: {formatDate(task.createdAt)}
          </span>

          {task.deadline && (
            <span className="text-xs text-gray-600 bg-white bg-opacity-30 px-2 py-1 rounded-lg border border-white border-opacity-40">
              期限: {formatDate(task.deadline)}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          {task.tag && (
            <span className="text-xs text-blue-600 bg-blue-100 bg-opacity-50 px-2 py-1 rounded-lg border border-blue-200 border-opacity-40">
              #{task.tag}
            </span>
          )}

          {task.assign && (
            <span className="text-xs text-gray-600 bg-white bg-opacity-30 px-2 py-1 rounded-lg border border-white border-opacity-40">
              担当: {task.assign}
            </span>
          )}
        </div>

        {task.status && (
          <div className="flex justify-end">
            <span
              className={`text-xs px-2 py-1 rounded-lg border ${
                task.status === "done"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : task.status === "in-progress"
                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                  : "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              {task.status === "done"
                ? "完了"
                : task.status === "in-progress"
                ? "進行中"
                : "未着手"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
