import React from "react";
import {Routes, Route, Navigate, useOutletContext} from "react-router-dom";

import Login from "./pages/Login";
import SoloTask from "./pages/SoloTask";
import GroupTask from "./pages/GroupTask";
import TeamTask from "./pages/TeamTask";
import AdminPage from "./pages/AdminPage";

import MainLayout from "./components/Layout/MainLayout";
import type { OutletContextType } from "./components/types/outletContext";

const App = ()=>{

  // 共通レイアウト使用可否の認証判定(supabaseの際に再編集必須)
  const isAuthenticated = true;

  // ルートとしての
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
        <Route path = "solo-task" element={<SoloTaskWrapper />} />
        <Route path = "group-task" element={<GroupTask />} />
        <Route path = "team-task" element = {<TeamTask />} />
        <Route path = "admin" element = {<AdminPage />}/>

      </Route>

      {/*すべてのパスにマッチしない(404Found)*/}
      <Route path = "*" element={<div>404 Not Found</div>}/>

    </Routes>
  );
};

const SoloTaskWrapper = () =>{
  const outletContext = useOutletContext<OutletContextType>();

  return(
    <SoloTask
    tasks={ outletContext.tasks}
    onTaskClick={outletContext.onTaskClick}
    onToggleDone={outletContext.toggleTaskStatus}
    />
  );

};

export default App;