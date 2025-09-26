import React from "react";
import { Link } from "react-router-dom";
import type { SidebarItem as SidebarItemType } from "../types/sidebar";

// サイドバーアイテムのプロパティ型定義
interface SidebarItemProps {
  item: SidebarItemType;
  isActive?: boolean;
  className?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isActive = false,
  className = "",
}) => {
  // アイテムクリック時のハンドラー
  const handleClick = () => {
    if (item.disabled) return;

    if (item.onClick) {
      item.onClick();
    }
  };

  // アクティブ状態に応じたスタイルクラスを生成
  const getItemClasses = () => {
    const baseClasses =
      "p-4 md:p-6 my-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out text-gray-700 font-medium whitespace-nowrap md:transform-none";
    const activeClasses = isActive
      ? "bg-blue-600text-white font-semibold shadow-md"
      : "hover:bg-white hover:bg-opacity-50 hover:text-gray-900 hover:font-semibold";
    const disabledClasses = item.disabled
      ? "opacity-50 cursor-not-allowed"
      : "hover:translate-x-1";

    return `${baseClasses} ${activeClasses} ${disabledClasses} ${className}`;
  };

  // コンテンツ(サイドバー)全体をラップするコンポーネント
  const content = (
    <div className="flex item-center gap-3">
      {/*アイコンの表示*/}
      {item.icon && (
        <div
          className="w-5 h-5 flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: item.icon }}
        />
      )}

      {/*ラベル表示 */}
      {item.badge && (
        <span className='"bg-blue500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center'>
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
      className={getItemClasses()}
      onClick={handleClick}
      role="button"
      tabIndex={item.disabled ? -1 : 0}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
    >
      {content}
    </div>
  );
};

export default SidebarItem;
