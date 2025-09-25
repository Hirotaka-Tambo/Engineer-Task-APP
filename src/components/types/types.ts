// タスクの優先度を表すリテラル型
export type Priority = 1 | 2 | 3;

// タスクの状態を表す型
export type TaskStatus = 'todo' | 'in-progress' | 'done';

/**
 * @description タスクの基本要素を定義する型
 */
export interface Task {
    id: number;
    text: string;
    done: boolean;
    priority: Priority; // 優先度
    tag: string;     // 言語カテゴリ
    assign: string; // 配属(タスク担当者)*soloTaskには表示しないようにする
    oneLine: string; // 1行メモ
    memo: string; // 備考欄 *モーダルで表示
    // icon: string; 画像ファイルは後々収集して再定義。(SVGで記述。)
    deadline: Date; // 締め切り
    createdAt: Date;
}

// ユーザー入力用の型定義
export type NewTask = Omit<Task, 'id' | 'createdAt'>; 

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

// 画像ファイルは後々収集して再定義。(SVGで記述。)
// const tsIcon: string = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#3178C6" d="..."></path></svg>`;