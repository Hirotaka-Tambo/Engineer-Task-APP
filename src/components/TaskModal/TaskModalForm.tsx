import React, { useEffect, useState } from "react";
import type { ExtendedTask, NewTaskUI, TaskCategory } from "../types/task";
import { getDeadlineStatus } from "../../utils/dateUtils";
import IconSelector from "../IconSelector/IconSelector";
import { getUsersByProjectId } from "../../services/userService";
import type { User } from "../types/user";

interface TaskModalFormProps {
  editedTask: ExtendedTask | NewTaskUI;                      // 編集中のタスクデータ
  isNewTask: boolean;                                         // 新規タスクかどうか
  errors: { [key: string]: string };                          // バリデーションエラー
  onInputChange: (name: keyof ExtendedTask, value: any) => void;  // 入力変更ハンドラー
  onCancel: () => void;                                       // キャンセルハンドラー
  onSave: () => void;                                         // 保存ハンドラー
  getDeadlineStyle: (deadline: Date) => string;               // 締切日スタイル取得関数
  formatDateForInput: (date: Date) => string;                 // 日付フォーマット関数
  parseDateFromInput: (dateString: string) => Date;           // 日付パース関数
  projectId?: string;                                         // プロジェクトID（ユーザー一覧取得用）
}

const TaskModalForm: React.FC<TaskModalFormProps> = ({
  editedTask,
  isNewTask,
  errors,
  onInputChange,
  onCancel,
  onSave,
  getDeadlineStyle,
  formatDateForInput,
  parseDateFromInput,
  projectId,
}) => {
  // プロジェクトのユーザー一覧を管理
  const [projectUsers, setProjectUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  
  // バリデーションエラーの表示状態
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // 保存ボタンのハンドラー
  const handleSave = () => {
    // バリデーションチェック
    if (editedTask.taskCategory.length === 0 || editedTask.assignedTo === "") {
      setShowValidationErrors(true);
      return;
    }
    // バリデーションOKなら保存
    onSave();
  };

  // モーダルが開いている時にbodyのスクロールを無効にする
  useEffect(() => {
    // モーダルが開いている時
    document.body.style.overflow = 'hidden';
    
    // クリーンアップ関数：モーダルが閉じる時にスクロールを復元
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // プロジェクトのユーザー一覧を取得
  useEffect(() => {
    const fetchProjectUsers = async () => {
      if (!projectId) return;
      
      setUsersLoading(true);
      try {
        const users = await getUsersByProjectId(projectId);
        setProjectUsers(users);
      } catch (error) {
        console.error('プロジェクトユーザー取得エラー:', error);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchProjectUsers();
  }, [projectId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-hidden">
      {/* モーダルコンテナ */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900">
            {isNewTask ? "新規タスク作成" : "タスク詳細・編集"}
          </h2>
          {/* 閉じるボタン */}
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 p-2"
            aria-label="閉じる"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* メインコンテンツ */}
        <div className="p-8">
          {/* タスク名 */}
          <div className="mb-4">
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => onInputChange("title", e.target.value)}
              className={`w-full text-2xl font-bold border-none outline-none bg-transparent placeholder-gray-400 ${
                errors.title ? "text-red-500" : "text-gray-900"
              }`}
              placeholder="タスク名を入力してください"
            />
            {errors.title && <p className="mt-2 text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* 締切日・残り日数・優先度・保存ボタン（コンパクト表示） */}
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              {/* 残り日数 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-700 font-semibold">残り日数 :</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDeadlineStyle(editedTask.deadline)}`}>
                  {getDeadlineStatus(editedTask.deadline)}
                </span>
              </div>

              {/* 締切日 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-700 font-semibold">締切 :</span>
                <input
                  type="date"
                  value={formatDateForInput(editedTask.deadline)}
                  onChange={(e) => onInputChange("deadline", parseDateFromInput(e.target.value))}
                  className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* 優先度 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-700 font-semibold">優先度 :</span>
                <select
                  value={editedTask.priority}
                  onChange={(e) => onInputChange("priority", Number(e.target.value))}
                  className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value={1}>低</option>
                  <option value={2}>中</option>
                  <option value={3}>高</option>
                </select>
              </div>
            </div>

            {/* 保存ボタン */}
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded text-xs font-medium shadow-sm transition-all bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
            >
              {isNewTask ? "タスクを作成" : "保存して閉じる"}
            </button>
          </div>

           {/* プロパティ */}
            <div className="space-y-6">

            {/* グループ・担当者・1行メモ（カード型レイアウト） */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-3">
              {/* グループカード */}
              <div className={`bg-gray-50 rounded-xl p-3 border transition-colors ${
                showValidationErrors && editedTask.taskCategory.length === 0 
                  ? "border-red-300 bg-red-50" 
                  : "border-gray-200 hover:border-green-300"
              }`}>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">グループ</span>
                </div>
                <div className="flex gap-2 gap-y-0 flex-wrap">
                  {["solo","front","back","setting","team"].map((category) =>{
                    const isChecked = editedTask.taskCategory.includes(category as TaskCategory);
                    const isDisabled = !isChecked && editedTask.taskCategory.length >= 3;
                    
                    return (
                      <label key={category} className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-white'}`}>
                        <input
                          type="checkbox"
                          value={category}
                          checked={isChecked}
                          disabled={isDisabled}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            onInputChange("taskCategory", {
                              category: category as TaskCategory,
                              checked,
                              currentCategories: editedTask.taskCategory
                            });
                          }}
                          className={`h-3 w-3 text-green-600 border-gray-300 rounded focus:ring-green-500 ${isDisabled ? 'cursor-not-allowed' : ''}`}
                        />
                        <span className="text-xs font-medium">{category}</span>
                      </label>
                    );
                  })}      
                </div>
              </div>

              {/* 担当者カード */}
              <div className={`bg-gray-50 rounded-xl p-3 border transition-colors ${
                showValidationErrors && editedTask.assignedTo === "" 
                  ? "border-red-300 bg-red-50" 
                  : "border-gray-200 hover:border-blue-300"
              }`}>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">担当者</span>
                </div>
                <select
                  value={editedTask.assignedTo}
                  onChange={(e) => onInputChange("assignedTo", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={usersLoading}
                >
                  <option value="">担当者を選択</option>
                  <option value="未定">未定</option>
                  {projectUsers.map((user) => (
                    <option key={user.id} value={user.user_name}>
                      {user.user_name}
                    </option>
                  ))}
                </select>
                {usersLoading && (
                  <p className="text-xs text-gray-500 mt-1">ユーザー一覧を読み込み中...</p>
                )}
              </div>

              {/* 1行メモカード */}
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 hover:border-purple-300 transition-colors">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">1行メモ</span>
                </div>
                <input
                  type="text"
                  value={editedTask.oneLine}
                  onChange={(e) => onInputChange("oneLine", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="簡潔なメモを入力してください"
                />
              </div>
            </div>

            {/* 言語アイコンカード */}
            <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-pink-300 transition-colors">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-sm font-semibold text-gray-700">言語アイコン</span>
                {editedTask.icon && (
                  <>
                    <span className="text-sm text-gray-400">|</span>
                    <div className="flex items-center space-x-2">
                      <img 
                        src={`/icons/${editedTask.icon}.svg`}
                        alt={editedTask.icon}
                        className="w-5 h-5"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="text-sm text-gray-600 font-medium">
                        {editedTask.icon.charAt(0).toUpperCase() + editedTask.icon.slice(1)}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <IconSelector
                selectedIcon={editedTask.icon || ""}
                onIconSelect={(iconName) => onInputChange("icon", iconName)}
              />
            </div>

            {/* 関連URLカード */}
            <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-cyan-300 transition-colors">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                <span className="text-sm font-semibold text-gray-700">関連URL</span>
              </div>
              <input
                type="url"
                value={editedTask.relatedUrl || ""}
                onChange={(e) => onInputChange("relatedUrl", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                placeholder="例: https://github.com/user/repo/issues/123"
              />
            </div>

            {/* 詳細メモカード */}
            <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-indigo-300 transition-colors">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className="text-sm font-semibold text-gray-700">詳細メモ</span>
              </div>
              <textarea
                value={editedTask.memo}
                onChange={(e) => onInputChange("memo", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-vertical"
                placeholder="詳細な説明やメモを入力してください"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModalForm;
