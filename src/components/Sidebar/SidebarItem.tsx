import React from 'react';
import type { SidebarItem as SidebarItemType } from '../types/types';

// サイドバーアイテムのプロパティ型定義
interface SidebarItemProps {
  item: SidebarItemType;
  isActive?: boolean;
  onClick?: (item: SidebarItemType) => void;
  className?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  item, 
  isActive = false, 
  onClick, 
  className = '' 
}) => {
  // アイテムクリック時のハンドラー
  const handleClick = () => {
    if (item.disabled) return;
    
    if (item.onClick) {
      item.onClick();
    }
    
    if (onClick) {
      onClick(item);
    }
  };

  // アクティブ状態に応じたスタイルクラスを生成
  const getItemClasses = () => {
    const baseClasses = 'p-4 md:p-6 my-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out text-gray-700 font-medium whitespace-nowrap md:transform-none';
    const activeClasses = isActive 
      ? 'bg-white bg-opacity-50 text-gray-900 font-semibold md:shadow-md md:hover:shadow-lg' 
      : 'hover:bg-white hover:bg-opacity-50 hover:text-gray-900 hover:font-semibold';
    const disabledClasses = item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:translate-x-1';
    
    return `${baseClasses} ${activeClasses} ${disabledClasses} ${className}`;
  };

  return (
    <div 
      className={getItemClasses()}
      onClick={handleClick}
      role="button"
      tabIndex={item.disabled ? -1 : 0}
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="flex items-center gap-3">
        {/* アイコン表示 */}
        {item.icon && (
          <div 
            className="w-5 h-5 flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: item.icon }}
          />
        )}
        
        {/* ラベル表示 */}
        <span className="flex-1">{item.label}</span>
        
        {/* バッジ表示 */}
        {item.badge && (
          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
            {item.badge}
          </span>
        )}
      </div>
    </div>
  );
};

export default SidebarItem;
