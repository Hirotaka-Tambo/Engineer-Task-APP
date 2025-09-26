export interface User{
    id: number; // PK
    projectCode: string; // プロジェクトコード
    userId: string; // ユーザーID
    role: 'admin' | 'member'; // 役割
    isActive: boolean;
}