import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { useProject } from '../contexts/ProjectContext';
import { getProjectMemberRole } from '../services/adminService';

type ProjectRole = 'admin' | 'member' | null;

export const useProjectRole = () => {
  const { user } = useAuth();
  const { selectedProjectId } = useProject();
  const [role, setRole] = useState<ProjectRole>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRole = async () => {
      if (!user?.id || !selectedProjectId) {
        if (isMounted) {
          setRole(null);
          setLoading(false);
          setError(null);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const fetchedRole = await getProjectMemberRole(selectedProjectId, user.id);

        if (isMounted) {
          setRole(fetchedRole);
        }
      } catch (err) {
        console.error('プロジェクトロール取得エラー:', err);
        if (isMounted) {
          setRole(null);
          setError('プロジェクトロールの取得に失敗しました');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRole();

    return () => {
      isMounted = false;
    };
  }, [user?.id, selectedProjectId]);

  return {
    role,
    loading,
    error,
    projectId: selectedProjectId,
  };
};


