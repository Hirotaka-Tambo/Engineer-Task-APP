export interface User{
    id: string; // PK (uuid)
    user_name: string; // ユーザー名
    email: string; // Supabase Authのメール
    project_id?: string; // 所属プロジェクト (nullable)
    role: 'admin' | 'member'; // 役割
    is_active: boolean; // 有効/無効
    created_at: string; // 作成日時
    updated_at: string; // 更新日時
}