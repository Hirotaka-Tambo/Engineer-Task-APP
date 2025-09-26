import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import TaskModal from '../TaskModal/TaskModal';
import { useTasks } from '../../hooks/useTasks';
import type { ExtendedTask, SidebarItem } from '../types/types';
import type { OutletContextType } from '../types/outletContext';

const MainLayout : React.FC = () =>{
  const { tasks, deleteTask, toggleTaskDone, updateTask} = useTasks();

  // サイドバーの配列
  const sidebarItems: SidebarItem[] = [
  { id: "solo", label: "Solo", path: "/solo" },
  { id: "group", label: "Group", path: "/group" },
  { id: "team", label: "Team", path: "/team" },
  { id: "admin", label: "Admin", path: "/admin" },
];

  // 編集中タスク
  const [editingTask, setEditingTask] = useState<ExtendedTask | null>(null);

  // タスクをクリック(詳細閲覧と編集時)
  const handleTaskClick = (task:ExtendedTask) =>{
    setEditingTask(task);
  }

  // 新規作成用のモーダルを開く
  const openCreateModal = () =>{
    setEditingTask({
      id: 0,
      text: '',
      done : false,
      priority: 2,
      tag: "",
      assign: "",
      oneLine: "",
      memo: "",
      relatedUrl: "",
      deadline: new Date(),
      createdAt: new Date(),
      status: "todo",
    });
  };

  // モーダルを閉じる
  const closeModal= () =>{
    setEditingTask(null);
  };

  // モーダルを保存
  const handleSaveTask = (updatedTask: ExtendedTask) =>{
    updateTask (updatedTask);
    closeModal();
  }

  // Outletへの受け渡し
  const outletContext: OutletContextType ={
    tasks,
    onTaskClick: handleTaskClick,
    deleteTask,
    toggleTaskDone,
    openCreateModal,
  };

  return(
    <div className= "flex h-screen bg-gray-100">
      {/*サイドバー配置*/}
      <Sidebar 
      items={sidebarItems}
      activeItemId={useLocation().pathname.replace("/", "")}
    />

    {/*メインコンテンツ配置 */}
    <main className = "flex-1 overflow-y-auto p-6">
      <Outlet context ={outletContext} />
    </main>

    {/*モーダルの配置 */}
    {editingTask &&(
      <TaskModal
      task={editingTask}
      isOpen={!!editingTask}
      onClose={closeModal}
      onSave={handleSaveTask}
      />
    ) }
    </div>
  );

};
export default MainLayout;
