import { useState, useCallback } from 'react';
import type{Project} from '../components/types/project'
import type { ProjectMemberWithUser, UpdateProjectMember } from '../components/types/projectMember';
import * as adminService from '../services/adminService';

export const useAdmin = (projectId?: string) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [members, setMembers] = useState<ProjectMemberWithUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

const fetchProjectMembers = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
        const data = await adminService.getProjectMembers(projectId);
        setMembers(data || []);
    } catch (err: any) {
        setError(err.message || 'メンバー取得エラー');
    } finally {
        setLoading(false);
    }
}, [projectId]);


const addMember = useCallback(async (userId: string, role: 'admin' | 'member') => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
        await adminService.addProjectMember(projectId, userId, role);
        await fetchProjectMembers();
    } catch (err: any) {
        setError(err.message || 'メンバー追加エラー');
    } finally {
        setLoading(false);
    }  
}, [projectId, fetchProjectMembers]);

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

return {
    projects,
    members,
    loading,
    error,
    fetchAllProjects,
    fetchProjectMembers,
    addMember,
    updateMemberRole,
    removeMember,
};
};
