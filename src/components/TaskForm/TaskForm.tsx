import React, { useState } from "react";
import type { Priority, Task } from "../types/task";

// taskの初期状態
type NewTask = Omit<Task, "id" | "createdAt">;

const initialTask: NewTask = {
  title: "",
  status: 'in-progress',
  priority: 1, // 「低」
  tag: "",
  icon: "",
  assign: "",
  oneLine: "",
  memo: "",
  deadline: new Date(),
};

interface TaskFromProps {
  onAddTask: (newTask: NewTask) => void;
}

const TaskForm: React.FC<TaskFromProps> = ({ onAddTask }) => {
  const [task, setTask] = useState<NewTask>(initialTask);

  // 文字列関連(text/tag/assign/oneLine/memo)
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    // 文字列
    const { name, value, type } = e.target;

    // checked(done)は、HTMLInputElementにしか存在しないため、限定して記述する必要あり
    const inputValue =
      type === "checkbox" && e.target instanceof HTMLInputElement
        ? e.target.checked
        : value;

    setTask((prevTask) => ({
      ...prevTask,
      [name]: inputValue,
    }));
  };

  // 優先度はセレクトタグ
  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTask((prevTask) => ({
      ...prevTask,
      priority: Number(e.target.value) as Priority,
    }));
  };

  // 締め切りの日付設定
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask((prevTask) => ({
      ...prevTask,
      deadline: new Date(e.target.value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.text.trim() === "") return;
    onAddTask(task);
    setTask(initialTask); // フォームをリセット(次も入力できるように)
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* タスク名 */}
        <div className="mb-4 col-span-2">
          <label
            htmlFor="text"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            タスク名
          </label>
          <input
            type="text"
            id="text"
            name="text"
            value={task.text}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="新しいタスクを入力..."
          />
        </div>

        {/* 優先度 */}
        <div className="mb-4">
          <label
            htmlFor="priority"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            優先度
          </label>
          <select
            id="priority"
            name="priority"
            value={task.priority}
            onChange={handlePriorityChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value={1}>1 (低)</option>
            <option value={2}>2 (中)</option>
            <option value={3}>3 (高)</option>
          </select>
        </div>

        {/* タグ 言語のため、後々要設定*/}
        <div className="mb-4">
          <label
            htmlFor="tag"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            タグ
          </label>
          <input
            type="text"
            id="tag"
            name="tag"
            value={task.tag}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="例: React, Javaなど"
          />
        </div>

        {/* 担当者 */}
        <div className="mb-4">
          <label
            htmlFor="assign"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            担当者
          </label>
          <input
            type="text"
            id="assign"
            name="assign"
            value={task.assign}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="タスク担当者名"
          />
        </div>

        {/* 締め切り */}
        <div className="mb-4">
          <label
            htmlFor="deadline"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            締め切り
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={task.deadline.toISOString().substring(0, 10)} // DateオブジェクトをISO形式に変換
            onChange={handleDateChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* 1行メモ */}
        <div className="mb-4">
          <label
            htmlFor="oneLine"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            1行メモ
          </label>
          <input
            type="text"
            id="oneLine"
            name="oneLine"
            value={task.oneLine}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="タスクの概要"
          />
        </div>

        {/* 備考欄 */}
        <div className="mb-4">
          <label
            htmlFor="memo"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            備考欄
          </label>
          <textarea
            id="memo"
            name="memo"
            value={task.memo}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="詳細なメモ..."
            rows={4}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          タスクを追加
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
