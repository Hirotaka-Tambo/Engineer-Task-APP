import {Routes, Route, Navigate} from "react-router-dom";

import Login from "./pages/Login";
import SoloTask from "./pages/SoloTask";
import FrontTask from "./pages/FrontTask"; 
import BackTask from  "./pages/BackTask";
import SettingTask from "./pages/SettingTask";
import TeamTask from "./pages/TeamTask";
import AdminPage from "./pages/AdminPage";
import RegisterPage from "./pages/RegisterPage";

import MainLayout from "./components/Layout/MainLayout";
import { useAuth } from "./hooks/useAuth";

const App = ()=>{

  // Supabaseの認証状態を取得
  const { isAuthenticated, loading } = useAuth();

  console.log('App.tsx - loading:', loading, 'isAuthenticated:', isAuthenticated);

  // 認証状態の読み込み中は何も表示しない（またはローディング画面）
  if (loading) {
    console.log('App.tsx - ローディング中...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3B62FF] via-[#5B8FFF] to-[#5BFFE4]">
        <div className="text-white text-xl font-semibold">読み込み中...</div>
      </div>
    );
  }

  console.log('App.tsx - ルーティング開始');

  // ルート
  return(
    <Routes>
      {/* ログインページ：認証済みの場合はメインページにリダイレクト */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
      />

      {/*メインレイアウトの適用(認証をもとに)*/}
      <Route
        path = "/" // 認証のない場合はログインページへリダイレクト
        element = { isAuthenticated? <MainLayout /> : <Navigate to = "/login" />}
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
        <Route path = "/admin" element = {<AdminPage />}/>
        <Route path = "register" element={<RegisterPage currentUserId="user123"/>}/>
        {/*user123はtest用 */}

      </Route>

      {/*すべてのパスにマッチしない(404Found)*/}
      <Route path = "*" element={<div>404 Not Found</div>}/>

    </Routes>
  );

  
};

export default App;