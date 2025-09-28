import React, { useState, useEffect } from "react";
import type { ExtendedTask, NewTaskUI, TaskStatus } from "../types/task";
import { getDeadlineStatus } from "../../utils/dateUtils";

interface TaskModalProps {
  task: ExtendedTask | NewTaskUI;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: ExtendedTask | NewTaskUI) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, onSave }) => {
  // NewTaskUI（新規）かExtendedTask（既存）かを判定
  // TaskUIには createdAt があるが、NewTaskUI にはないことを利用
  const isNewTask = !("createdAt" in task);

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
  
  const defaultNewTask: NewTaskUI = {
    title: "",
    taskstatus: "todo" as TaskStatus,
    priority: 1,
    taskType: 'group',
    groupCategory: 'front',
    icon: "",
    createdBy: "", // ログインユーザーから埋め込む想定
    assignedTo: "",
    deadline: new Date(),
    oneLine: "",
    relatedUrl: "",
    memo: "",
  };
  
  
  const [editedTask, setEditedTask] = useState<ExtendedTask | NewTaskUI>(task);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // タスクが切り替わったときに初期化
  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
      setErrors({});
    } else {
      setEditedTask({...defaultNewTask}); // 新規ごとに新しいID
      setErrors({});
    }
  }, [task]);

  const handleCancel = () =>{
    onClose();
  };

  const handleSave = () =>{
    if(!editedTask) return;
    if(Object.keys(errors).length > 0)return;

    if(!editedTask || editedTask.title.trim() === ""){
      setErrors((prev)=>({...prev, title:"タイトルは必須です"}));
      return;
    }

    onSave(editedTask);
  }

  const handleInputChange = (name: keyof ExtendedTask, value:any)=>{
    setEditedTask((prev) =>{

      if(name === "priority"){
        return {...prev, [name]: Number(value) as ExtendedTask["priority"]};
      }
      if(name === "deadline"){
        return {...prev, [name]: new Date(value)};
      }
      return {...prev, [name]:value};
    });

    if(name === "title"){
      if(value.trim() === ""){
        setErrors((prev) => ({...prev,title:"タイトルは必須です"}));
      }else{
        setErrors((prev) =>{
          const newErrors ={...prev};
          delete newErrors.title;
          return newErrors;
        });
      }
    }
  };

  const formatDateForInput = (date: Date) => date.toISOString().split("T")[0];
  const parseDateFromInput = (dateString: string) => new Date(dateString);

  if (!isOpen || !editedTask) return null;


  return (
    <div className="modal">

      {/* ヘッダー */}
      <div className="flex items-center justify-between p-8 border-b border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900">
          {isNewTask ? "新規タスク作成" : "タスク詳細・編集"}
        </h2>
        <button
          onClick={handleCancel}
          className="text-gray-500 hover:text-gray-700 p-2"
          aria-label="閉じる"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

       {/* メインコンテンツ */}
      <div className="p-8 space-y-8">
        {/* タスク名 */}
        <div>
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className={`w-full text-2xl font-bold border-none outline-none bg-transparent placeholder-gray-400 ${
              errors.title ? "text-red-500" : "text-gray-900"
            }`}
            placeholder="タスク名を入力してください"
          />
          {errors.title && <p className="mt-2 text-sm text-red-500">{errors.title}</p>}
        </div>

        {/* プロパティ */}
        <div className="space-y-6">
          {/* 残り日数 */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600 w-24">残り日数</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDeadlineStyle(editedTask.deadline)}`}>
              {getDeadlineStatus(editedTask.deadline)}
            </span>
          </div>

          {/* 優先度と言語カテゴリ（同じ行に配置） */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 優先度編集 */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600 w-24">優先度</span>
              <select
                value={editedTask.priority}
                onChange={(e) => handleInputChange("priority", Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value={1}>低</option>
                <option value={2}>中</option>
                <option value={3}>高</option>
              </select>
            </div>

            {/* 言語カテゴリ */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600 w-24">言語カテゴリ</span>
              <input
                type="text"
                value={editedTask.icon}
                onChange={(e) => handleInputChange("icon", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="例: React, TypeScript"
              />
            </div>

          {/* 担当者 */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600 w-24">担当者</span>
            <input
              type="text"
              value={editedTask.assignedTo}
              onChange={(e) => handleInputChange("assignedTo", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="担当者名を入力"
            />
          </div>

           {/* タグ */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600">グループ</span>
            <input
              type="text"
              value={editedTask.groupCategory}
              onChange={(e) => handleInputChange("groupCategory", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="例: React, TypeScript"
            />
          </div>

          {/* 締切日 */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600">締切日</span>
            <input
              type="date"
              value={formatDateForInput(editedTask.deadline)}
              onChange={(e) => handleInputChange("deadline", parseDateFromInput(e.target.value))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 1行メモ */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600 w-24">1行メモ</span>
            <input
            type="text"
            value={editedTask.oneLine}
            onChange={(e) => handleInputChange("oneLine", e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="簡潔なメモを入力してください"
            />
            </div>
          </div>

          {/* 詳細メモ */}
          <div className="flex items-start space-x-4">
            <span className="text-sm font-medium text-gray-600 mt-2 w-24">詳細メモ</span>
            <textarea
              value={editedTask.memo}
              onChange={(e) => handleInputChange("memo", e.target.value)}
              rows={3}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-vertical"
              placeholder="詳細な説明やメモを入力してください"
            />
          </div>

          {/* 関連URL */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600 w-24">関連URL</span>
            <input
              type="url"
              value={editedTask.relatedUrl || ""}
              onChange={(e) => handleInputChange("relatedUrl", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="例: https://github.com/user/repo/issues/123"
            />
          </div>
        </div>
      </div>

      {/* フッター */}
      <div className="flex justify-end gap-4 p-8 border-t border-gray-200 bg-gray-50 bg-opacity-50">
        <button
          onClick={handleCancel}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          キャンセル
        </button>
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700"
        >
          {isNewTask ? "タスクを作成" : "保存して閉じる"}
        </button>
      </div>

    </div>
  );
};

export default TaskModal;
