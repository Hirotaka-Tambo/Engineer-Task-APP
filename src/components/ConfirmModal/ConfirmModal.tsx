import React from 'react';
import type { ExtendedTask } from '../types/task';

interface ConfirmModalProps {
  isOpen: boolean;
  task: ExtendedTask | null;
  onClose: () => void;
  onConfirm: (action: 'revert' | 'delete') => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  task, 
  onClose, 
  onConfirm 
}) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        {/* ヘッダー */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            タスクの状態変更確認
          </h3>
          <p className="text-sm text-gray-600">
            タスクは全体進捗度に反映されています！本当にタスクの状態を変更しますか?
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="p-6">
          {/* タスク情報 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
            <div className="text-sm text-gray-600">
              <p>現在の状態: <span className="font-medium text-green-600">完了</span></p>
              <p>カテゴリ: <span className="font-medium">#{task.taskCategory}</span></p>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-3">
            <button
              onClick={() => onConfirm('revert')}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
            >
              タスクを進行中に戻す
            </button>
            <button
              onClick={() => onConfirm('delete')}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
            >
              タスクを削除する
            </button>
          </div>

          {/* キャンセルボタン */}
          <div className="mt-3">
            <button
              onClick={onClose}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
