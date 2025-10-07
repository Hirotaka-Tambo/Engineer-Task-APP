import React, { useState,useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import TaskModal from "../TaskModal/TaskModal";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { useTasks } from "../../hooks/useTasks";
import { logout } from "../../services/authService";
import type { ExtendedTask, NewTaskUI } from "../types/task";
import type { SidebarItem } from "../types/sidebar";
import type { OutletContextType } from "../types/outletContext";

const MainLayout : React.FC = () =>{
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    tasks, addTask, deleteTask, toggleTaskStatus, updateTask, setFilter, currentFilter} = useTasks();

  // テスト用の仮ユーザー
  const currentUser = "demoUser";

  // サイドバーの配列
  const sidebarItems: SidebarItem[] = [
    { 
      id: "solo-task", 
      label: "Solo Task", 
      path: "/solo-task",
      filter: {type: 'solo', category: 'all'},
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>'
    },
    { 
      id: "group-front", 
      label: "Front-end", 
      path: "/group-task/front",
      filter: {type: 'front', category: 'front'},
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>'
    },
    { 
      id: "group-back", 
      label: "Back-end", 
      path: "/group-task/back",
      filter: {type: 'back', category: 'back'},
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>'
    },
    { 
      id: "group-setting", 
      label: "Setting", 
      path: "/group-task/setting",
      filter: {type: 'setting', category: 'setting'},
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>'
    },
    { 
      id: "team-task", 
      label: "Team Task", 
      path: "/team-task",
      filter: {type: 'team', category: 'all'},
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>'
    },
    { 
      id: "admin", 
      label: "Admin", 
      path: "/admin",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>'
    },
  ];

  // アクティブアイテムIDを計算
  const activeItemId = sidebarItems.find(item => item.path === location.pathname)?.id || location.pathname.replace("/","");

  // 編集中タスク
  const [editingTask, setEditingTask] = useState<ExtendedTask | NewTaskUI | null>(null);
  
  // 確認モーダル用のタスク
  const [confirmTask, setConfirmTask] = useState<ExtendedTask | null>(null);

  // ルート変更時に自動でフィルタを同期する
  useEffect(() => {
    const activeItem = sidebarItems.find((item) => item.path === location.pathname);
    if (activeItem?.filter) {
      setFilter(activeItem.filter);
    }
  }, [location.pathname]);

  // タスクをクリック(詳細閲覧と 編集時)
  const handleTaskClick = (task:ExtendedTask) =>{
    setEditingTask(task);
  };

  // 新規作成用のモーダルを開く
  const openCreateModal = () => {
    const initialCategory = currentFilter.category !== 'all' ? currentFilter.category : undefined;

    const newTask:NewTaskUI ={
      title: "",
      taskStatus: "todo",
      priority: 2,
      taskCategory: initialCategory ? [initialCategory] : ["solo"],
      icon: "",
      createdBy: currentUser,
      assignedTo: "",
      oneLine: "",
      memo: "",
      relatedUrl: "",
      deadline: new Date(),
    };
    setEditingTask(newTask);
  };

  // モーダルを閉じる
  const closeModal = () => {
    setEditingTask(null);
  };

  // 確認モーダルを表示
  const showConfirmModal = (task: ExtendedTask) => {
    setConfirmTask(task);
  };

  // 確認モーダルを閉じる
  const closeConfirmModal = () => {
    setConfirmTask(null);
  };

  // 確認モーダルでのアクション処理
  const handleConfirmAction = (action: 'revert' | 'delete') => {
    if (!confirmTask) return;
    
    if (action === 'revert') {
      toggleTaskStatus(confirmTask.id!);
    } else if (action === 'delete') {
      deleteTask(confirmTask.id!);
    }
    
    closeConfirmModal();
  };

  // モーダルを保存
  const handleSaveTask = (updatedTask: ExtendedTask | NewTaskUI) =>{
    // NewTaskUIの場合は、新規作成
    if (!("createdAt" in updatedTask)) {
      addTask(updatedTask as NewTaskUI);
    } else {
      // 編集の場合
      updateTask(updatedTask as ExtendedTask);
    }
    closeModal();
  };

  // Outletへの受け渡し
  const outletContext: OutletContextType = {
    tasks,
    onTaskClick: handleTaskClick,
    deleteTask,
    toggleTaskStatus,
    openCreateModal,
    setFilter,
    onShowConfirmModal: showConfirmModal
  };

  return(
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-[#3B62FF] via-[#5B8FFF] to-[#5BFFE4] p-2 md:p-4">
      {/*サイドバー配置*/}
      <Sidebar 
        items={sidebarItems}
        activeItemId={activeItemId}
        onItemClick={(item) => {
          // ナビゲーションはReact RouterのLinkで処理されるため、ここでは何もしない
          if(item.filter){
            setFilter(item.filter);
          }
        }}
      />

      {/*メインコンテンツ配置 */}
      <main className="flex-1 flex flex-col p-2 md:p-4 relative">
        {/* 上部ヘッダー */}
        <div className="bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl p-4 md:p-6 mb-8 shadow-xl border border-white border-opacity-60">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-800 m-0">Task Management</h1>
            <div className="flex-1 flex justify-center" style={{ marginLeft: '360px' }}>
              <div className="text-lg font-semibold text-gray-700">
                進捗: {tasks.length > 0 ? Math.round((tasks.filter(task => task.taskStatus === 'done').length / tasks.length) * 100) : 0}%
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={openCreateModal}
                className="bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold py-3 px-4 rounded-xl cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                NewTask
              </button>
              <button
                onClick={async () => {
                  try {
                    await logout();
                    console.log('ログアウト成功');
                    navigate('/login');
                  } catch (error) {
                    console.error('ログアウトエラー:', error);
                  }
                }}
                className="bg-gradient-to-br from-gray-500 to-gray-700 text-white font-semibold py-3 px-4 rounded-xl cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* ページコンテンツ */}
        <div className="flex-1">
          <Outlet context={outletContext} />
        </div>


        {/*モーダルの配置 */}
        {editingTask && (
          <TaskModal
            task={editingTask}
            isOpen={!!editingTask}
            onClose={closeModal}
            onSave={handleSaveTask}
          />
        )}

        {/*確認モーダルの配置 */}
        {confirmTask && (
          <ConfirmModal
            task={confirmTask}
            isOpen={!!confirmTask}
            onClose={closeConfirmModal}
            onConfirm={handleConfirmAction}
          />
        )}
      </main>
    </div>
  );
};
export default MainLayout;
