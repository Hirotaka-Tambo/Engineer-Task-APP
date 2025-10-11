import React from "react";
import SidebarItem from "./SidebarItem";
import type { SidebarProps } from "../types/sidebar";
import { useAuth } from "../../hooks/useAuth";

const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeItemId,
  onItemClick,
  className = ''
}) => {
  const { user } = useAuth();

  return (
    // 外側のコンテナ - 元の位置に戻す
    <div className={`w-full md:w-[280px] m-0 md:m-4 ${className}`}>
      {/* 外側の装飾レイヤー - ヘッダー上部からタスクボード下部まで */}
      <div
        className="bg-white bg-opacity-30 backdrop-blur-xl rounded-2xl shadow-xl border border-white border-opacity-60 transition-all duration-300 ease-in-out overflow-visible h-[calc(100vh-64px)] flex flex-col"
        style={{ willChange: 'transform', transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}
      >
          {/* 内側のコンテンツレイヤー - overflow-visibleで要素の切り取りを防ぐ */}
          <div className="pt-8 pb-12 pl-8 pr-12 md:pt-10 md:pb-12 md:pl-10 md:pr-12 flex flex-col flex-1 overflow-visible">
            
            {/* ユーザーアカウント情報カード - 横に引き伸ばし */}
            {user && (
              <div className="mb-6 -mx-2 md:-mx-4">
                <div className="relative p-4 md:p-5 my-2 rounded-2xl bg-gradient-to-br from-[#3B62FF] via-[#5B8FFF] to-[#5BFFE4] shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden group border border-white border-opacity-60">
                  {/* 背景装飾 */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500"></div>
                  
                  {/* コンテンツ - 横並びレイアウト */}
                  <div className="relative z-10 flex items-center gap-4">
                    {/* ユーザー情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-white text-left truncate">
                          {user.user_name}
                        </div>
                        {/* ロールバッジ */}
                        {user.role && (
                          <span className="px-2 py-1 text-xs font-semibold text-white bg-white bg-opacity-20 backdrop-blur-sm rounded-full border border-white border-opacity-30 flex-shrink-0">
                            {user.role === 'admin' ? '管理者' : 'メンバー'}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-white text-opacity-90 text-left truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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