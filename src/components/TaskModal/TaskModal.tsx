import React from "react";
import type { ExtendedTask, NewTaskUI } from "../types/task";
import { useTaskModal } from "../../hooks/useTaskModal";
import TaskModalForm from "./TaskModalForm";
import { useAuth } from "../../hooks/useAuth";

/**
 * TaskModal - タスクモーダルのメインコンポーネント
 *
 * このコンポーネントは、タスクの作成・編集を行うモーダルダイアログです。
 * ロジック部分（useTaskModal）とUI部分（TaskModalForm）を統合します。
 *
 * @component
 */

interface TaskModalProps {
  task: ExtendedTask | NewTaskUI;  // 編集対象のタスク（新規 or 既存）
  isOpen: boolean;                 // モーダルの開閉状態
  onClose: () => void;             // モーダルを閉じる処理
  onSave: (updatedTask: ExtendedTask | NewTaskUI) => void;  // タスク保存処理
}

const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, onSave }) => {
  // 現在のユーザー情報を取得（プロジェクトID用）
  const { user } = useAuth();
  
  // カスタムフックからロジック部分を取得
  const {
    editedTask,          // 編集中のタスクデータ
    isNewTask,           // 新規タスクかどうか
    errors,              // バリデーションエラー
    handleCancel,        // キャンセル処理
    handleSave,          // 保存処理
    handleInputChange,   // 入力変更処理
    getDeadlineStyle,    // 締切日のスタイル取得
    formatDateForInput,  // 日付フォーマット（表示用）
    parseDateFromInput,  // 日付パース（入力用）
  } = useTaskModal({ task, onClose, onSave });

  // モーダルが閉じている、またはタスクがない場合は何も表示しない
  if (!isOpen || !editedTask) return null;

  // TaskModalFormにすべてのpropsを渡してUIをレンダリング
  return (
    <TaskModalForm
      editedTask={editedTask}
      isNewTask={isNewTask}
      errors={errors}
      onInputChange={handleInputChange}
      onCancel={handleCancel}
      onSave={handleSave}
      getDeadlineStyle={getDeadlineStyle}
      formatDateForInput={formatDateForInput}
      parseDateFromInput={parseDateFromInput}
      projectId={user?.project_id}
    />
  );
};

export default TaskModal;