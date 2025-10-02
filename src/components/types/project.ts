// プロジェクトテーブルの型定義

export interface Project {
  id: string; // PK (uuid)
  name: string; // プロジェクト名
  code: string; // チーム用プロジェクトコード
  created_at: string; // 作成日時
  updated_at: string; // 更新日時
}

// 新規プロジェクト作成時の型
export type NewProject = Omit<Project, 'id' | 'created_at' | 'updated_at'>;

// プロジェクト更新時の型
export type UpdateProject = Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>;

