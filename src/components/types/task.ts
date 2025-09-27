// タスクの優先度を表すリテラル型
export type Priority = 1 | 2 | 3;

// タスクの状態を表す型
export type TaskStatus = 'todo' | 'in-progress' | 'done';

/**
 * @description タスクの基本要素を定義する型
 */
export interface Task {
    id: number; // 全てに非表示にすること!!

    // TaskCard :: Figma section1 
    // TaskModal :: Figma section2

    // 上から表示されていく
    
    // 1列目
    title: string; // タスク名
    taskstatus: TaskStatus; // 進行中/未着手/完了

    // 2列目
    priority: Priority; // 優先度(上記で限定的に型を指定)
    tag: string;     // fix/addなど、タスクの役割の明確化
    icon?: string;  // 画像ファイルは後々収集してselect/optionとして再定義。(拡張子の複数対応のためにoptional)
    
    // 3列目
    createdBy: string; // 作成ユーザー名前
    assignedTo: string; // 配属(タスク担当者)

    //4列目(DB/APIのスキーマに柔軟に対応できるように/文字列として返ってくることもあり
    createdAt: string | Date; // 作成日
    deadline: string | Date; // 締め切り日時

    // 自由記述欄
    oneLine: string; // 1行メモ
    relatedUrl?: string; // 参考URL(有無で表示/非表示を切り替え)
    memo: string; // 備考欄(Cardには非表示/Modalでは表示)

    // 内部管理用(UIには非表示)
    projectCode: string;
}

// ユーザー入力用の型定義
// タスクidのみを省略(idはUI上不必要のため)
export type NewTask = Omit<Task, 'id'>;


// 拡張されたTask型（types.tsの基本型に追加フィールドを加えたもの）
export interface ExtendedTask extends Task {
  status: TaskStatus;
} 