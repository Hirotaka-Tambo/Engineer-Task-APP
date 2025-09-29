import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";

import Login from "./pages/Login";
import SoloTask from "./pages/SoloTask";
import FrontTask from "./pages/FrontTask"; 
import BackTask from  "./pages/BackTask";
import SettingTask from "./pages/SettingTask";
// 後々分岐させる(front/back/settings)
import TeamTask from "./pages/TeamTask";
import AdminPage from "./pages/AdminPage";

import MainLayout from "./components/Layout/MainLayout";

const App = ()=>{

  // 共通レイアウト使用可否の認証判定(supabaseの際に再編集必須)
  const isAuthenticated = true;

  // ルート
  return(
    <Routes>
      <Route path = "/login" element ={<Login />} />

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
        <Route path = "admin" element = {<AdminPage />}/>

      </Route>

      {/*すべてのパスにマッチしない(404Found)*/}
      <Route path = "*" element={<div>404 Not Found</div>}/>

    </Routes>
  );

  
};

export default App;