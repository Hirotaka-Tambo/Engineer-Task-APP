import React from "react";
import SidebarItem from "./SidebarItem";
import type { SidebarProps, ProjectInfo } from "../types/sidebar";

const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeItemId,
  onItemClick,
  className = ''
}) => {
  // プロジェクト情報（後でpropsから受け取るように変更予定）
  const projectInfo: ProjectInfo = {
    id: "default-project",
    name: "Project Name",
    description: "Task Management",
    color: "#3B62FF",
  };

  return (
    // 外側のコンテナ - 元の幅を維持
    <div className={`w-full md:w-[280px] m-0 md:m-4 ${className}`}>
      {/* 外側の装飾レイヤー */}
      <div
        className="bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-xl border border-white border-opacity-60 transition-all duration-300 ease-in-out overflow-visible"
        style={{ willChange: 'transform', transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}
      >
          {/* 内側のコンテンツレイヤー - overflow-visibleで要素の切り取りを防ぐ */}
          <div className="pt-8 pb-12 pl-8 pr-12 md:pt-10 md:pb-36 md:pl-10 md:pr-12 flex flex-col h-fit overflow-visible">
            
            {/* プロジェクトの名前 */}
            <div className="mb-6">
              <div
                className="p-4 md:p-6 my-2 rounded-xl cursor-pointer text-gray-700 font-medium bg-white bg-opacity-50 text-gray-900 font-semibold md:shadow-md md:hover:shadow-lg hover:translate-x-2 transition-all duration-300"
                style={{ borderLeft: `4px solid ${projectInfo.color}` }}
              >
                <div className="flex flex-col gap-1">
                  <div className="text-lg font-bold text-left">
                    {projectInfo.name}
                  </div>
                  {projectInfo.description && (
                    <div className="text-sm text-gray-600 ml-4 text-left">
                      {projectInfo.description}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* メニューアイテムセクション */}
            <div className="flex md:flex-col overflow-visible">
              {items.map((item) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  isActive={activeItemId === item.id}
                  onClick={onItemClick ? () => onItemClick(item) : undefined}
                />
              ))}
            </div>
          </div>
      </div>
    </div>
  );
};

export default Sidebar;