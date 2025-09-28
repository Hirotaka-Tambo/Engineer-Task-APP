import React, { useState, useEffect } from "react";
import type { ExtendedTask, TaskStatus } from "../types/task";

interface TaskModalProps {
  task: ExtendedTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: ExtendedTask) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, onSave }) => {
  const defaultNewTask: ExtendedTask = {
    title: "",
    taskstatus: "todo" as TaskStatus,
    priority: 1,
    tag: "",
    icon: "",
    createdBy: "", // ログインユーザーから埋め込む想定
    assignedTo: "",
    createdAt: new Date(),
    deadline: new Date(),
    oneLine: "",
    relatedUrl: "",
    memo: "",
  };
  
  
  const [editedTask, setEditedTask] = useState<ExtendedTask>(
    task ? { ...task } : defaultNewTask
  );
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
      <h2>{task ? "タスク編集" : "新規タスク作成"}</h2>

      {/* ヘッダー */}
      <div className="flex items-center justify-between p-8 border-b border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900">
          {task ? "タスク詳細・編集" : "新規タスク作成"}
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
            <span className="text-sm font-medium text-gray-600">残り日数</span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
              {Math.ceil((editedTask.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} 日
            </span>
          </div>

          {/* 優先度 */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600">優先度</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                editedTask.priority === 1
                  ? "bg-red-100 text-red-800"
                  : editedTask.priority === 2
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {editedTask.priority === 1 ? "高" : editedTask.priority === 2 ? "中" : "低"}
            </span>
          </div>

          {/* 担当者 */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600">担当者</span>
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
            <span className="text-sm font-medium text-gray-600">言語カテゴリ</span>
            <input
              type="text"
              value={editedTask.tag}
              onChange={(e) => handleInputChange("tag", e.target.value)}
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
            <span className="text-sm font-medium text-gray-600">1行メモ</span>
            <input
              type="text"
              value={editedTask.oneLine}
              onChange={(e) => handleInputChange("oneLine", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="簡潔なメモを入力してください"
            />
          </div>

          {/* 詳細メモ */}
          <div className="flex items-start space-x-4">
            <span className="text-sm font-medium text-gray-600 mt-2">詳細メモ</span>
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
            <span className="text-sm font-medium text-gray-600">関連URL</span>
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
          {task ? "保存して閉じる" : "タスクを作成"}
        </button>
      </div>

    </div>
  );
};

export default TaskModal;
