import { supabase } from './supabaseClient';
import type { User } from '../components/types/user';

/**
 * プロジェクトに所属する全ユーザーを取得
 */
export const getUsersByProjectId = async (projectId: string): Promise<User[]> => {
    try {
    // 1. project_members からアクティブなユーザーIDを取得
    const { data: membersData, error: membersError } = await supabase
    .from('project_members')
    .select('user_id')
    .eq('project_id', projectId)
    .eq('is_active', true);

    if (membersError) throw membersError;
    if (!membersData || membersData.length === 0) return [];

    const userIds = membersData.map(m => m.user_id);

    // 2. users テーブルからユーザー情報を取得
    const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select('id, user_name, email, role, is_active')
    .in('id', userIds);

    if (usersError) throw usersError;

    return usersData as User[];
} catch (err) {
    console.error('getUsersByProjectId エラー:', err);
    throw err;
}
};

export const getUserIdByUserName = async (userName: string, projectId: string): Promise<string | null> => {
    try {
    const users = await getUsersByProjectId(projectId);
    const user = users.find(u => u.user_name === userName);
    return user ? user.id : null;
} catch (error) {
    console.error('ユーザーID取得エラー:', error);
    return null;
}
};