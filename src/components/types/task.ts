// タスクの優先度を表すリテラル型
export type Priority = 1 | 2 | 3;

// タスクの状態を表す型
export type TaskStatus = 'todo' | 'in-progress' | 'done';

// タスクの分類を表す型
export type TaskCategory = 'team' | 'front' | 'back' | 'setting' | 'solo';

//タスクのUIを定義する型
export interface TaskUI{
    
    // 1列目
    title: string; // タスク名
    taskStatus: TaskStatus; // 進行中/未着手/完了

    // 2列目
    priority: Priority; // 優先度(上記で限定的に型を指定)
    taskCategory: TaskCategory[]; // 上記参照
    icon?: string;  // 画像ファイルは後々収集してselect/optionとして再定義。(拡張子の複数対応のためにoptional)
    
    // 3列目 ともに外部キー(user.tsから引っ張ってくる)
    createdBy: string; // 作成ユーザー名前
    assignedTo: string; // 配属(タスク担当者)

    //4列目
    createdAt: Date; // 作成日
    deadline: Date; // 締め切り日時

    // 自由記述欄
    oneLine: string; // 1行メモ
    relatedUrl?: string; // 参考URL(有無で表示/非表示を切り替え)
    memo: string; // 備考欄(Cardには非表示/Modalでは表示)
}


//内部での管理用にデータベース用の定義

export interface TaskDB{
  id: string; // PK (uuid)
  title: string;
  task_status: TaskStatus;
  priority: Priority;
  task_category: TaskCategory[];
  icon?: string;
  created_by: string; // 作成者のユーザーID (uuid)
  assigned_to: string; // 担当者のユーザーID (uuid)
  deadline: string; // 締め切り日時
  one_line: string; // 1行メモ
  memo: string; // 詳細メモ
  related_url?: string; // 関連URL
  project_id: string; // 所属プロジェクト (uuid)
  created_at: string; // 作成日時
  updated_at: string; // 更新日時
}

// UI/内部処理用に拡張する型(id必須/カスタム(Card状態やModal状態)可能にするためにinterfaceを採用)
export interface ExtendedTask extends TaskUI{
  id:string;
  isEditing?: boolean; // モーダルでの編集機能のためのoptional
  isUpdatingStatus?: boolean; // カード状態でもStatusを変更できるか否か
  isUpdatingPriority?: boolean; // カード状態でも優先度を変更できる否か
}

// 新規タスクの作成時にDB側で必要な型
export type NewTaskDB = Omit<TaskDB, 'id' | 'created_at' | 'updated_at'>;

// 新規タスクの作成時にUI側で必要な型
export type NewTaskUI = Omit<TaskUI, "createdAt">;

// データベースへ更新を接続する用の型
export type UpdateTaskDB = Partial<Omit<TaskDB, 'id' | 'created_at' | 'updated_at' | 'project_id'>>; // Partialで全てを編集対象に
export type CardUpdate = Pick<UpdateTaskDB, 'task_status' | 'priority'>; // カード状態ではstatusとpriorityのみが編集可能に
export type ModalUpdate = Omit<UpdateTaskDB, 'created_by'>; // 作成者は変更不可


// DBからUI表示のための変換関数
// 注意: createdBy/assignedToはuuidなので、表示時にユーザー名を取得する必要があります
export const toExtendedTask = (
  task: TaskDB, 
  createdByName: string, 
  assignedToName: string
): ExtendedTask =>({
  id: task.id,
  title: task.title,
  taskStatus: task.task_status,
  priority: task.priority,
  taskCategory: task.task_category,
  icon: task.icon,
  createdBy: createdByName,
  assignedTo: assignedToName,
  createdAt: new Date(task.created_at),
  deadline: new Date(task.deadline),
  oneLine: task.one_line,
  relatedUrl: task.related_url,
  memo: task.memo,
})