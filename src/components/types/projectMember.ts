// プロジェクトメンバーテーブル（中間テーブル）の型定義

export interface ProjectMember {
  id: string; // PK (uuid)
  project_id: string; // FK → project.id
  user_id: string; // FK → user.id
  role: 'admin' | 'member'; // プロジェクトごとの役割
  is_active: boolean; // 有効/無効
  created_at: string; // 作成日時
  updated_at: string; // 更新日時
}

// 新規メンバー追加時の型
export type NewProjectMember = Omit<ProjectMember, 'id' | 'created_at' | 'updated_at'>;

// メンバー情報更新時の型（役割変更や有効/無効化）
export type UpdateProjectMember = Partial<Pick<ProjectMember, 'role' | 'is_active'>>;

// ユーザー情報を含む拡張型（表示用）
export interface ProjectMemberWithUser extends ProjectMember {
  user_name: string; // ユーザー名
  email: string; // メールアドレス
}

