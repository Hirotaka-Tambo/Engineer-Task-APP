// タスクの優先度を表すリテラル型
export type Priority = 1 | 2 | 3;

// タスクの状態を表す型
export type TaskStatus = 'todo' | 'in-progress' | 'done';

// タスクの分類を表す型
export type TaskType = 'solo' | 'group' | 'team';

// Group Task のサブカテゴリを表す型
export type GroupCategory = 'front' | 'back' | 'setting';

//タスクのUIを定義する型
export interface TaskUI{

    // TaskCard :: Figma section1 
    // TaskModal :: Figma section2
    // 上から表示されていく
    
    // 1列目
    title: string; // タスク名
    taskstatus: TaskStatus; // 進行中/未着手/完了

    // 2列目
    priority: Priority; // 優先度(上記で限定的に型を指定)
    taskType: TaskType;     // fromt/backなど
    groupCategory?: GroupCategory;
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
  id : number // PK
  projectCode: string; // 内部での管理用
  title: string;
  taskstatus: TaskStatus;
  priority: Priority;
  tasktype: TaskType
  groupCategory?: GroupCategory;
  icon?: string;
  createdBy: string;
  assignedTo: string;
  createdAt: string;    // DBからは string として返ってくる
  deadline: string;
  oneLine: string;
  relatedUrl?: string;
  memo: string;
}

// DBからUI表示のための変換関数
export const toTaskUI = (task: TaskDB): TaskUI =>({
  title: task.title,
  taskstatus: task.taskstatus,
  priority: task.priority,
  taskType: task.tasktype,
  groupCategory:task.groupCategory,
  icon: task.icon,
  createdBy: task.createdBy,
  assignedTo: task.assignedTo,
  createdAt: new Date(task.createdAt),
  deadline: new Date(task.deadline),
  oneLine: task.oneLine,
  relatedUrl: task.relatedUrl,
  memo: task.memo,
})


// 新規タスクの作成時にDB側で必要な型
export type NewTaskDB = Omit<TaskDB, 'id' | 'createdAt'>;

// 新規タスクの作成時にUI側で必要な型
export type NewTaskUI = Omit<TaskUI, "createdAt">;

// UI用に拡張する型(カスタム(Card状態やModal状態)可能にするためにinterfaceを採用)
export interface ExtendedTask extends TaskUI{
  id? :number;
  isEditing?: boolean; // モーダルでの編集機能のためのoptional
  isUpdatingStatus?: boolean; // カード状態でもStatusを変更できるか否か
  isUpdatingPriority?: boolean; // カード状態でも優先度を変更できる否か
}

// データベースへ更新を接続する用の型
export type UpdateTaskDB = Partial<Omit<TaskDB, 'id' | 'createdAt'>>; // Partialで全てを編集対象に
export type CardUpdate = Pick<UpdateTaskDB, 'taskstatus' | 'priority'>; // カード状態ではstatusとpriorityのみが編集可能に
export type ModalUpdate = Omit<UpdateTaskDB, 'createdBy' | 'createdAt'>;
