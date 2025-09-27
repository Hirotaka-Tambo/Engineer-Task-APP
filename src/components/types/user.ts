export interface User{
    id: number; // PK
    projectCode: string; // プロジェクトコード
    userName: string; // ユーザー名
    role: 'admin' | 'member'; // 役割
    isActive: boolean;
}