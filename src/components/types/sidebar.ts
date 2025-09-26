// サイドバー関連の型定義
// サイドバーのメニューアイテムの基本型
export interface SidebarItem {
  id: string;                    // 一意識別子
  label: string;                 // 表示テキスト
  icon?: string;                 // アイコン（SVG文字列）
  path?: string;                 // ルーティング用パス
  isActive?: boolean;            // 現在選択中かどうか
  onClick?: () => void;          // クリック時のコールバック
  disabled?: boolean;            // 無効化フラグ
  badge?: string | number;       // バッジ（通知数など）
  children?: SidebarItem[];      // サブメニュー（ドロップダウン用）
}

// サイドバーのプロパティ型
export interface SidebarProps {
  items: SidebarItem[];          // メニューアイテムの配列
  activeItemId?: string;         // 現在アクティブなアイテムのID
  onItemClick?: (item: SidebarItem) => void; // アイテムクリック時のコールバック
  className?: string;            // 追加のCSSクラス
}

// プロジェクト情報の型
export interface ProjectInfo {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;                // プロジェクトのテーマカラー
    isActive?: boolean;
}

// サイドバーの設定型
export interface SidebarConfig {
    width: number;                 // サイドバーの幅
    showProjectInfo: boolean;      // プロジェクト情報を表示するか
    showUserInfo: boolean;         // ユーザー情報を表示するか
    theme: 'light' | 'dark';       // テーマ
    animation: boolean;            // アニメーション有効かどうか
}