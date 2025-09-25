import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import TaskModal from '../TaskModal/TaskModal';
import { useTasks } from '../../hooks/useTasks';
import type { SidebarItem, ExtendedTask } from '../types/types';

// ページコンポーネントのインポート（後で実装）
import SoloTask from '../../pages/SoloTask';
import GroupTask from '../../pages/GroupTask';
import TeamTask from '../../pages/TeamTask';
import AdminPage from '../../pages/AdminPage';

// MainLayoutのプロパティ型定義
interface MainLayoutProps {
  children?: React.ReactNode;
}

// サイドバーのメニューアイテム定義
const sidebarItems: SidebarItem[] = [
  {
    id: 'solo-task',
    label: 'Solo Task',
    path: '/solo-task',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>'
  },
  {
    id: 'group-task',
    label: 'Group Task',
    path: '/group-task',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>'
  },
  {
    id: 'team-task',
    label: 'Team Task',
    path: '/team-task',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>'
  },
  {
    id: 'admin',
    label: 'Admin',
    path: '/admin',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>'
  }
];

// メインコンテンツコンポーネント
const MainContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tasks, addTask, updateTask } = useTasks();
  const [selectedTask, setSelectedTask] = useState<ExtendedTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 現在のアクティブなアイテムIDを取得
  const getActiveItemId = () => {
    const path = location.pathname;
    const item = sidebarItems.find(item => item.path === path);
    return item?.id || 'solo-task';
  };

  // サイドバーアイテムクリック時のハンドラー
  const handleSidebarItemClick = (item: SidebarItem) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  // タスククリック時のハンドラー（モーダル表示）
  const handleTaskClick = (task: ExtendedTask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // タスク保存時のハンドラー（編集用）
  const handleTaskSave = (updatedTask: ExtendedTask) => {
    updateTask(updatedTask);
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // モーダルを閉じるハンドラー
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // タスク作成モーダルを開くハンドラー
  const handleCreateTaskClick = () => {
    setIsCreateModalOpen(true);
  };

  // タスク作成モーダルを閉じるハンドラー
  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  // タスク作成時のハンドラー
  const handleCreateTask = (newTask: ExtendedTask) => {
    addTask(newTask);
    setIsCreateModalOpen(false);
  };

  return (
    <>
      {/* サイドバー */}
      <Sidebar
        items={sidebarItems}
        activeItemId={getActiveItemId()}
        onItemClick={handleSidebarItemClick}
      />

      {/* メインコンテンツエリア */}
      <div className="flex-1 flex flex-col p-2 md:p-4 relative">
        {/* 上部ヘッダー */}
        <div className="bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 md:p-8 mb-8 flex justify-between items-center shadow-xl border border-white border-opacity-60">
          <h1 className="text-xl md:text-3xl font-extrabold text-gray-800 m-0">Task Management</h1>
          <div className="flex gap-4 md:gap-6">
            <button 
              onClick={handleCreateTaskClick}
              className="bg-gradient-to-br from-blue-500 to-blue-800 text-white font-semibold py-3 px-6 rounded-xl cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
            >
              + New Task
            </button>
          </div>
        </div>

        {/* ルーティング */}
        <Routes>
          <Route 
            path="/" 
            element={<SoloTask tasks={tasks} onTaskClick={handleTaskClick} />} 
          />
          <Route 
            path="/solo-task" 
            element={<SoloTask tasks={tasks} onTaskClick={handleTaskClick} />} 
          />
          <Route 
            path="/group-task" 
            element={<GroupTask onTaskClick={handleTaskClick} />} 
          />
          <Route 
            path="/team-task" 
            element={<TeamTask onTaskClick={handleTaskClick} />} 
          />
          <Route 
            path="/admin" 
            element={<AdminPage />} 
          />
        </Routes>

        {/* TaskModal（編集用） */}
        {isModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300" onClick={handleModalClose} />
            <div className="relative bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-lg border border-white border-opacity-60 w-full max-w-4xl max-h-[80vh] overflow-y-auto transform transition-all duration-300 mx-auto">
              <TaskModal
                task={selectedTask}
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSave={handleTaskSave}
              />
            </div>
          </div>
        )}

        {/* TaskModal（作成用） */}
        {isCreateModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300" onClick={handleCreateModalClose} />
            <div className="relative bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-lg border border-white border-opacity-60 w-full max-w-4xl max-h-[80vh] overflow-y-auto transform transition-all duration-300 mx-auto">
              <TaskModal
                task={null}
                isOpen={isCreateModalOpen}
                onClose={handleCreateModalClose}
                onSave={handleCreateTask}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// MainLayoutコンポーネント
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-[#3B62FF] via-[#5B8FFF] to-[#5BFFE4] p-2 md:p-4">
        {children || <MainContent />}
      </div>
    </Router>
  );
};

export default MainLayout;
