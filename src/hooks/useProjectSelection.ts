import { useState, useEffect } from 'react';
import { getUserProjects, getProjectByCode, addProjectMember, getProjectMembers } from '../services/adminService';
import { getCurrentAuthUser } from '../services/authService';
import type { Project } from '../components/types/project';

export const useProjectSelection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // ユーザーIDを取得
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await getCurrentAuthUser();
        if (user) {
          setUserId(user.id);
        }
      } catch (err) {
        console.error('ユーザーID取得エラー:', err);
      }
    };
    fetchUserId();
  }, []);

  // ユーザーの参加済みプロジェクト一覧を取得
  const fetchUserProjects = async () => {
    if (!userId) {
      console.log('userId が設定されていないため、プロジェクト一覧を取得しません');
      return;
    }
    
    console.log('プロジェクト一覧取得開始, userId:', userId);
    setLoading(true);
    setError(null);
    
    try {
      const userProjects = await getUserProjects(userId);
      console.log('取得したプロジェクト一覧:', userProjects);
      
      // 各プロジェクトのメンバー数を取得
      const projectsWithMemberCount = await Promise.all(
        userProjects.map(async (project) => {
          try {
            const members = await getProjectMembers(project.id);
            console.log(`プロジェクト ${project.name} のメンバー数:`, members.length);
            return {
              ...project,
              memberCount: members.length,
            };
          } catch (err) {
            console.error(`プロジェクト ${project.id} のメンバー数取得エラー:`, err);
            return {
              ...project,
              memberCount: 0,
            };
          }
        })
      );
      
      console.log('メンバー数付きプロジェクト一覧:', projectsWithMemberCount);
      setProjects(projectsWithMemberCount);
    } catch (err) {
      console.error('プロジェクト一覧取得エラー:', err);
      setError('プロジェクト一覧の取得に失敗しました');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // プロジェクトコードで参加
  const joinProjectByCode = async (projectCode: string): Promise<{ success: boolean; project?: Project; error?: string }> => {
    if (!userId) {
      return { success: false, error: 'ユーザー情報が取得できません' };
    }

    setLoading(true);
    setError(null);

    try {
      // プロジェクトを検索
      const project = await getProjectByCode(projectCode);
      
      if (!project) {
        setError('プロジェクトが見つかりません');
        return { success: false, error: 'プロジェクトが見つかりません' };
      }

      // 既に参加しているかチェック
      const isAlreadyMember = projects.some(p => p.id === project.id);
      
      if (isAlreadyMember) {
        return { success: true, project };
      }

      // プロジェクトに参加
      await addProjectMember(project.id, userId, 'member');
      
      // プロジェクト一覧を更新
      await fetchUserProjects();
      
      return { success: true, project };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'プロジェクトへの参加に失敗しました';
      console.error('プロジェクト参加エラー:', err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // プロジェクト作成成功後の処理
  const handleProjectCreated = async (projectCode: string): Promise<{ success: boolean; project?: Project; error?: string }> => {
    try {
      const project = await getProjectByCode(projectCode);
      
      if (!project) {
        return { success: false, error: 'プロジェクトの取得に失敗しました' };
      }

      // プロジェクト一覧を更新
      await fetchUserProjects();
      
      return { success: true, project };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'プロジェクトの取得に失敗しました';
      console.error('プロジェクト取得エラー:', err);
      return { success: false, error: errorMessage };
    }
  };

  return {
    projects,
    loading,
    error,
    userId,
    fetchUserProjects,
    joinProjectByCode,
    handleProjectCreated,
    clearError: () => setError(null),
  };
};

