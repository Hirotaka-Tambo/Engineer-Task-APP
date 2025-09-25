import React, { useState, useEffect } from 'react';
import type { Task, TaskStatus } from '../types/types';

// 拡張されたTask型（types.tsの基本型に追加フィールドを加えたもの）
export interface ExtendedTask extends Task {
  status?: TaskStatus;
}

// TaskModalのプロパティ型定義
interface TaskModalProps {
  task: ExtendedTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: ExtendedTask) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, onSave }) => {
  // 編集用のタスクデータ（ローカル状態）
  const [editedTask, setEditedTask] = useState<ExtendedTask | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // タスクが変更された時にローカル状態を更新
  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
      setErrors({});
    }
  }, [task]);

  // モーダル外クリック時のハンドラー
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // モーダルを閉じる処理
  const handleClose = () => {
    if (editedTask && task) {
      onSave(editedTask);
    }
    onClose();
  };

  // 入力値の変更ハンドラー
  const handleInputChange = (field: keyof ExtendedTask, value: any) => {
    if (!editedTask) return;

    setEditedTask((prev: ExtendedTask | null) => ({
      ...prev!,
      [field]: value
    }));

    // バリデーション（タイトルのみ必須）
    if (field === 'text') {
      if (value.trim() === '') {
        setErrors(prev => ({ ...prev, text: 'タイトルは必須です' }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.text;
          return newErrors;
        });
      }
    }
  };

  // 日付フォーマット関数
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // 日付文字列をDateオブジェクトに変換
  const parseDateFromInput = (dateString: string) => {
    return new Date(dateString);
  };

  // モーダルが開いていない場合は何も表示しない
  if (!isOpen || !task || !editedTask) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* 背景オーバーレイ */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300" />
      
      {/* モーダルコンテンツ */}
      <div className="relative bg-white bg-opacity-90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">タスク詳細</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2"
            aria-label="閉じる"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* メインコンテンツ */}
        <div className="p-6 space-y-6">
          {/* タスク名（必須） */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タスク名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editedTask.text}
              onChange={(e) => handleInputChange('text', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                errors.text ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="タスク名を入力してください"
            />
            {errors.text && (
              <p className="mt-1 text-sm text-red-500">{errors.text}</p>
            )}
          </div>

          {/* 担当者と優先度の行 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 担当者 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                担当者
              </label>
              <input
                type="text"
                value={editedTask.assign}
                onChange={(e) => handleInputChange('assign', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="担当者を入力してください"
              />
            </div>

            {/* 優先度 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                優先度
              </label>
              <select
                value={editedTask.priority}
                onChange={(e) => handleInputChange('priority', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <option value={1}>高</option>
                <option value={2}>中</option>
                <option value={3}>低</option>
              </select>
            </div>
          </div>

          {/* 言語カテゴリと締切日の行 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 言語カテゴリ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                言語カテゴリ
              </label>
              <input
                type="text"
                value={editedTask.tag}
                onChange={(e) => handleInputChange('tag', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="例: React, TypeScript"
              />
            </div>

            {/* 締切日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                締切日
              </label>
              <input
                type="date"
                value={formatDateForInput(editedTask.deadline)}
                onChange={(e) => handleInputChange('deadline', parseDateFromInput(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
          </div>

          {/* 1行メモ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              1行メモ
            </label>
            <input
              type="text"
              value={editedTask.oneLine}
              onChange={(e) => handleInputChange('oneLine', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="簡潔なメモを入力してください"
            />
          </div>

          {/* 詳細メモ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              詳細メモ
            </label>
            <textarea
              value={editedTask.memo}
              onChange={(e) => handleInputChange('memo', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-vertical"
              placeholder="詳細な説明やメモを入力してください"
            />
          </div>

          {/* 関連URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              関連URL
            </label>
            <input
              type="url"
              value={editedTask.relatedUrl || ''}
              onChange={(e) => handleInputChange('relatedUrl', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="例: https://github.com/user/repo/issues/123"
            />
          </div>

          {/* 完了状態 */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="done"
              checked={editedTask.done}
              onChange={(e) => handleInputChange('done', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="done" className="text-sm font-medium text-gray-700">
              このタスクは完了しました
            </label>
          </div>
        </div>

        {/* フッター */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 bg-opacity-50">
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
