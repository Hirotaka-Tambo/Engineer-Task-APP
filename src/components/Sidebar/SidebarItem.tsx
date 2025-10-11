import React from "react";
import { Link } from "react-router-dom";
import type { SidebarItem as SidebarItemType } from "../types/sidebar";

// サイドバーアイテムのプロパティ型定義
interface SidebarItemProps {
  item: SidebarItemType;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  item, 
  isActive = false, 
  className = '',
  onClick
}) => {
  // アイテムクリック時のハンドラー
  const handleClick = () => {
    if (item.disabled) return;
    
    if (onClick) {
      onClick();
    } else if (item.onClick) {
      item.onClick();
    }
  };

  // アクティブ状態に応じたスタイルクラスを生成
  const getItemClasses = () => {
    const baseClasses = 'p-4 md:p-6 my-2 rounded-xl transition-all duration-300 ease-in-out text-gray-700 font-medium';
    const activeClasses = isActive 
      ? 'bg-blue-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] translate-x-2 cursor-pointer' 
      : 'hover:bg-white hover:bg-opacity-30 hover:text-gray-900 hover:font-semibold hover:translate-x-2 cursor-pointer';
    const disabledClasses = item.disabled 
      ? 'opacity-40 cursor-not-allowed bg-gray-100 bg-opacity-20 text-gray-400' 
      : '';
    
    return `${baseClasses} ${activeClasses} ${disabledClasses} ${className}`;
  };

  // コンテンツ(サイドバー)全体をラップするコンポーネント
  const content = (
    <div className='flex items-center gap-3'>
      {/*アイコンの表示*/}
      {item.icon && (
        <div
          className="w-5 h-5 flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: item.icon }}
        />
      )}

      {/*ラベル表示 */}
      <span className="flex-1">{item.label}</span>

      {/*バッジ表示 */}
      {item.badge &&(
      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
        {item.badge}
      </span>
      )}
    </div>
  );

  // case:01 pathがあり、無効でないときはLinkを使用
  if (item.path && !item.disabled) {
    return (
      <Link
        to={item.path}
        className={getItemClasses()}
        aria-current={isActive ? "page" : undefined}
      >
        {content}
      </Link>
    );
  }

  // case:02 pathなし/無効の場合はdivを使用
  return (
    <div
      className={`${getItemClasses()} relative group`}
      onClick={handleClick}
      role="button"
      tabIndex={item.disabled ? -1 : 0}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
    >
      {content}
      
      {/* ツールチップ表示 */}
      {item.disabled && item.disabledReason && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[9999]">
          {item.disabledReason}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
