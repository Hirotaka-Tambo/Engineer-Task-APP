import React from "react";
import PriorityBadge from "./PriorityBadge";
import type { ExtendedTask } from "../types/task";
import { getDeadlineStatus } from "../../utils/dateUtils";

interface TaskCardProps {
  task: ExtendedTask;
  onClick?: (task: ExtendedTask) => void;
  onToggleDone?: (taskId: string) => void;
  onShowConfirmModal?: (task: ExtendedTask) => void;
  // レイアウト調整オプション
  horizontalPadding?: number; // 左右パディング (デフォルト: 5 = 20px)
  verticalPadding?: number; // 上下パディング (デフォルト: 4 = 16px)
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onClick, 
  onToggleDone, 
  onShowConfirmModal,
  horizontalPadding = 5,
  verticalPadding = 4,
}) => {
  // 日付計算を1回だけ実行する共通関数
  const getDaysRemaining = (deadline: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const oneDay = 1000 * 60 * 60 * 24;
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / oneDay);
  };

  // 残り日数に応じたスタイルを取得する関数（タグスタイルと枠スタイルを統合）
  const getDeadlineStyles = (daysRemaining: number) => {
    if (daysRemaining < 0) {
      // 締め切り過ぎ
      return {
        tagStyle: "bg-red-100 text-red-800 border-red-300",
        borderStyle: "border-red-400"
      };
    } else if (daysRemaining === 0) {
      // 締め切り当日
      return {
        tagStyle: "bg-red-200 text-red-900 border-red-400 font-bold",
        borderStyle: "border-red-400"
      };
    } else if (daysRemaining === 1) {
      // 残り1日
      return {
        tagStyle: "bg-orange-200 text-orange-800 border-orange-300 font-semibold",
        borderStyle: "border-orange-400"
      };
    } else if (daysRemaining <= 3) {
      // 残り2-3日
      return {
        tagStyle: "bg-yellow-200 text-yellow-800 border-yellow-300",
        borderStyle: "border-yellow-400"
      };
    } else {
      // それ以外
      return {
        tagStyle: "bg-green-100 text-green-800 border-green-300",
        borderStyle: "border-white border-opacity-60"
      };
    }
  };

  // 計算を1回だけ実行
  const daysRemaining = getDaysRemaining(task.deadline);
  const deadlineStyles = getDeadlineStyles(daysRemaining);
  
  // 完了タスクの場合は期限による枠線スタイルを適用しない
  const borderStyle = task.taskStatus === 'done' 
    ? 'border-white border-opacity-60' 
    : deadlineStyles.borderStyle;
    
  return (
    <div 
      className={`bg-white bg-opacity-80 backdrop-blur-xl rounded-2xl shadow-lg border transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1 hover:shadow-xl w-full flex flex-col ${borderStyle}`}
      style={{
        paddingLeft: `${horizontalPadding * 4}px`,
        paddingRight: `${horizontalPadding * 4}px`,
        paddingTop: `${verticalPadding * 4}px`,
        paddingBottom: `${verticalPadding * 4}px`,
      }}
      onClick={() => onClick?.(task)}
    >
      {/*1列目 タイトル+ アイコン + ステータス */}
      <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {task.icon && (
              <img
                src={`/icons/${task.icon}.svg`}
                alt={task.icon}
                className="w-5 h-5"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <h3 className="font-semibold text-lg">
              {task.title}
            </h3>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (task.taskStatus === "done") {
                onShowConfirmModal?.(task);
              } else {
                onToggleDone?.(task.id!);
              }
            }}
            className={`px-3 py-1 text-xs rounded transition-colors duration-200 font-medium ${
              task.taskStatus === "todo"
                ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                : task.taskStatus === "in-progress"
                ? "bg-blue-200 text-blue-800 hover:bg-blue-300"
                : "bg-green-200 text-green-800 hover:bg-green-300"
            }`}
          >
            {task.taskStatus === "todo" ? "未着手" : task.taskStatus === "in-progress" ? "進行中" : "完了"}
          </button>
      </div>

      {/* 2列目 優先度 + タグ */}
      <div className="flex items-center gap-3 mb-3">
        <PriorityBadge priority={task.priority} />
        <span className="text-xs text-blue-600 bg-white bg-opacity-30 px-2 py-1 rounded-xl border border-blue-600 ">
          #{task.taskCategory}
        </span>
        {/* 残り日数タグ（完了タスク以外で表示） */}
        {task.taskStatus !== 'done' && (
          <span className={`text-xs px-2 py-1 rounded-xl border ${deadlineStyles.tagStyle}`}>
            {getDeadlineStatus(task.deadline)}
          </span>
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
