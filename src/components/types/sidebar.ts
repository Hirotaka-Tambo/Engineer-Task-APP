// サイドバー関連の型定義

import type { TaskFilter } from "../../hooks/useTasks";

// サイドバーのメニューアイテムの基本型
export interface SidebarItem {
  id: string;                    // 一意識別子
  label: string;                 // 表示テキスト
  icon?: string;                 // アイコン（SVG文字列）
  path?: string;                 // ルーティング用パス
  isActive?: boolean;            // 現在選択中かどうか
  onClick?: () => void;          // クリック時のコールバック
  disabled?: boolean;            // 無効化フラグ
  disabledReason?: string;       // 無効化理由
  badge?: string | number;       // バッジ（通知数など）
  children?: SidebarItem[];      // サブメニュー（ドロップダウン用）
  filter?: TaskFilter;
}

// サイドバーのプロパティ型
export interface SidebarProps {
  items: SidebarItem[];          // メニューアイテムの配列
  activeItemId?: string;         // 現在アクティブなアイテムのID
  onItemClick?: (item: SidebarItem) => void; // アイテムクリック時のコールバック
  className?: string;            // 追加のCSSクラス
}