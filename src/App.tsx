import {Routes, Route, Navigate} from "react-router-dom";

import Login from "./pages/Login";
import SoloTask from "./pages/SoloTask";
import FrontTask from "./pages/FrontTask"; 
import BackTask from  "./pages/BackTask";
import SettingTask from "./pages/SettingTask";
import TeamTask from "./pages/TeamTask";
import Admin from "./pages/Admin";
import RegisterPage from "./pages/Register";
import ProjectSelection from "./pages/ProjectSelection";

import MainLayout from "./components/Layout/MainLayout";
import { useAuth } from "./hooks/useAuth";
import { ProjectProvider, useProject } from "./contexts/ProjectContext";

// プロジェクト選択状態を考慮したルートラッパー
const ProtectedRoutes = () => {
  const { hasSelectedProject, selectedProjectId, selectedProject } = useProject();
  const { isAuthenticated, loading } = useAuth();

  console.log('ProtectedRoutes チェック:', { 
    isAuthenticated, 
    loading,
    hasSelectedProject, 
    selectedProjectId, 
    selectedProjectName: selectedProject?.name 
  });

  // 認証状態の読み込み中は待機
  if (loading) {
    console.log('認証状態読み込み中...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3B62FF] via-[#5B8FFF] to-[#5BFFE4]">
        <div className="text-white text-xl font-semibold">読み込み中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('認証されていないため、ログインページへリダイレクト');
    return <Navigate to="/login" />;
  }

  if (!hasSelectedProject) {
    console.log('プロジェクトが選択されていないため、プロジェクト選択ページへリダイレクト');
    return <Navigate to="/project-selection" />;
  }

  console.log('認証済みかつプロジェクト選択済み、メインレイアウトを表示');
  return <MainLayout />;
};

const App = ()=>{

  // Supabaseの認証状態を取得
  const { isAuthenticated, loading, role } = useAuth();

  console.log('App.tsx - loading:', loading, 'isAuthenticated:', isAuthenticated);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3B62FF] via-[#5B8FFF] to-[#5BFFE4]">
        <div className="text-white text-xl font-semibold">読み込み中...</div>
      </div>
    );
  }

  // ルート
  return(
    <ProjectProvider>
      <Routes>
        {/* ログインページ：認証済みの場合はプロジェクト選択ページにリダイレクト */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/project-selection" /> : <Login />} 
        />

        <Route 
          path = "register" 
          element={isAuthenticated ? <Navigate to="/project-selection" /> : <RegisterPage />}
        />

        {/* プロジェクト選択ページ：認証済みユーザーのみアクセス可能 */}
        <Route 
          path="/project-selection" 
          element={isAuthenticated ? <ProjectSelection /> : <Navigate to="/login" />} 
        />

        {/*メインレイアウトの適用(認証とプロジェクト選択をもとに)*/}
        <Route
          path = "/"
          element = {<ProtectedRoutes />}
        >

        {/* MainLayout の中の <Outlet> に描画される子ルートを定義 */}
        {/* / にアクセスしたら /solo へリダイレクト */}
        <Route index element={<Navigate to = "/solo-task" />} />

        {/*各ページ*/}
        <Route path = "solo-task" element={<SoloTask />} />
        <Route path = "group-task/front" element={<FrontTask />} />
        <Route path = "group-task/back" element={<BackTask />} />
        <Route path = "group-task/setting" element={<SettingTask />} />
        <Route path = "team-task" element = {<TeamTask />} />
        <Route path="admin" element={role === "admin" ? <Admin /> : <Navigate to="/" />}/>

        
      </Route>


      {/*すべてのパスにマッチしない(404Found)*/}
      <Route path = "*" element={<div>404 Not Found</div>}/>

      </Routes>
    </ProjectProvider>
  );

  
};

export default App;