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
    <div
      className={`w-full md:w-[280px] bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl p-8 md:p-10 m-0 md:m-4 shadow-xl border border-white border-opacity-60 transition-all duration-300 ease-in-out flex flex-col h-fit md:h-[calc(100vh-2rem)] ${className}`}
      style={{ willChange: 'transform', transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}
    >
      {/* プロジェクトの名前 */}
      <div className="mb-6">
        <div
          className="p-4 md:p-6 my-2 rounded-xl cursor-pointer text-gray-700 font-medium md:transform-none bg-white bg-opacity-50 text-gray-900 font-semibold md:shadow-md md:hover:shadow-lg hover:translate-x-1"
          style={{ borderLeft: `4px solid ${projectInfo.color}` }}
        >
          <div className="flex flex-col gap-1">
            <div className="text-lg font-bold text-left whitespace-nowrap overflow-hidden text-ellipsis">
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
      <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto md:flex-1">
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
