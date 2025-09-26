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
    description: "Task Management App",
    color: "#3B62FF",
  };

  return (
    <div
      className={`w-full md:w-[280px] bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl p-8 md:p-10 m-0 md:m-4 shadow-xl border border-white border-opacity-60 transition-all duration-300 ease-in-out ${className}`}
    >
      {/* プロジェクト情報セクション */}
      <div className="mb-6">
        <div
          className="p-4 md:p-6 my-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out text-gray-700 font-medium whitespace-nowrap md:transform-none bg-white bg-opacity-50 text-gray-900 font-semibold md:shadow-md md:hover:shadow-lg hover:translate-x-1"
          style={{ borderLeft: `4px solid ${projectInfo.color}` }}
        >
          <div className="flex items-center gap-3">
            {/* プロジェクトアイコン */}
            {projectInfo.icon && (
              <div
                className="w-6 h-6 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: projectInfo.icon }}
              />
            )}
            <span className="text-lg font-bold">{projectInfo.name}</span>
          </div>
          {projectInfo.description && (
            <p className="text-sm text-gray-600 mt-1 ml-9">
              {projectInfo.description}
            </p>
          )}
        </div>
      </div>

      {/* メニューアイテムセクション */}
      <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible">
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
  );
};

export default Sidebar;
