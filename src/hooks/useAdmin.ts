import { useState, useCallback, useEffect } from 'react';
import type{Project} from '../components/types/project'
import type { ProjectMemberWithUser, UpdateProjectMember } from '../components/types/projectMember';
import * as adminService from '../services/adminService';

export const useAdmin = (projectId?: string, userId?: string) => {
    // State管理
    const [projects, setProjects] = useState<Project[]>([]); // すべてのプロジェクト一覧
    const [members, setMembers] = useState<ProjectMemberWithUser[]>([]); // プロジェクトメンバー一覧
    const [loading, setLoading] = useState(false); // メンバー操作中のローディング状態
    const [error, setError] = useState<string | null>(null); // エラーメッセージ
    const [userProjectId, setUserProjectId] = useState<string | undefined>(undefined); // ユーザーのプロジェクトID（自動取得）
    const [userProject, setUserProject] = useState<Project | undefined>(undefined); // ユーザーのプロジェクト情報
    const [projectLoading, setProjectLoading] = useState(true); // プロジェクトID取得中のローディング状態

    /**
     * ユーザーが所属するプロジェクトを自動的に取得
     * userIdが指定されている場合、そのユーザーのプロジェクト一覧を取得し、
     * 最初のプロジェクトのIDをuserProjectIdにセットする
     */
    useEffect(() => {
        const loadUserProject = async () => {
            if (!userId) {
                setProjectLoading(false);
                return;
            }

            try {
                setError(null);
                const userProjects = await adminService.getUserProjects(userId);
                if (userProjects.length > 0) {
                    setUserProjectId(userProjects[0].id);
                    setUserProject(userProjects[0]); // プロジェクト情報も保存
                } else {
                    setUserProjectId(undefined);
                    setError('プロジェクトが見つかりません');
                }
            } catch (err) {
                console.error('プロジェクト取得エラー:', err);
                setUserProjectId(undefined);
                setError('プロジェクトの取得に失敗しました');
            } finally {
                setProjectLoading(false);
            }
        };

        loadUserProject();
    }, [userId]);

    /**
     * すべてのプロジェクトを取得する
     * 管理者用：システム内のすべてのプロジェクトを一覧表示する際に使用
     */
    const fetchAllProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
        const data = await adminService.getAllProjects();
        setProjects(data || []);
    } catch (err: any) {
        setError(err.message || 'プロジェクト取得エラー');
    } finally {
        setLoading(false);
    }
}, []);

/**
 * 指定されたプロジェクトのメンバー一覧を取得する
 * projectIdまたはuserProjectId（自動取得したプロジェクトID）のいずれかを使用
 * メンバーの名前、メールアドレス、役割（admin/member）などの情報を取得
 */
const fetchProjectMembers = useCallback(async () => {
    // projectIdまたはuserProjectIdのどちらかを使用
    const targetProjectId = projectId || userProjectId;
    if (!targetProjectId) return;
    setLoading(true);
    setError(null);
    try {
        const data = await adminService.getProjectMembers(targetProjectId);
        setMembers(data || []);
    } catch (err: any) {
        setError(err.message || 'メンバー取得エラー');
    } finally {
        setLoading(false);
    }
}, [projectId, userProjectId]);



/**
 * プロジェクトメンバーの役割を更新する
 * @param memberId - 更新対象のメンバーID
 * @param updates - 更新内容（role: 'admin' | 'member'）
 * 更新後、自動的にメンバー一覧を再取得して最新状態に更新
 */
const updateMemberRole = useCallback(async (memberId: string, updates: UpdateProjectMember) => {
    setLoading(true);
    setError(null);
    try {
        await adminService.updateProjectMemberRole(memberId, updates);
        await fetchProjectMembers();
    } catch (err: any) {
        setError(err.message || '役割更新エラー');
    } finally {
        setLoading(false);
    }  
}, [fetchProjectMembers]);


/**
 * プロジェクトからメンバーを削除する
 * @param memberId - 削除対象のメンバーID
 * 削除後、自動的にメンバー一覧を再取得して最新状態に更新
 * 注意：削除操作は取り消せないため、慎重に実行すること
 */
const removeMember = useCallback(async (memberId: string) => {
    setLoading(true);
    setError(null);
    try {
        await adminService.removeProjectMember(memberId);
        await fetchProjectMembers();
    } catch (err: any) {
        setError(err.message || 'メンバー削除エラー');
    } finally {
        setLoading(false);
    }
}, [fetchProjectMembers]);

// 外部に公開するAPIを返す
return {
    // State
    projects,           // すべてのプロジェクト一覧
    members,            // プロジェクトメンバー一覧
    loading,            // メンバー操作中のローディング状態
    error,              // エラーメッセージ
    userProjectId,      // ユーザーのプロジェクトID（自動取得）
    userProject,        // ユーザーのプロジェクト情報
    projectLoading,     // プロジェクトID取得中のローディング状態
    
    // メソッド
    fetchAllProjects,   // すべてのプロジェクトを取得
    fetchProjectMembers, // プロジェクトメンバーを取得
    updateMemberRole,   // メンバーの役割を更新
    removeMember,       // メンバーを削除
};
};
