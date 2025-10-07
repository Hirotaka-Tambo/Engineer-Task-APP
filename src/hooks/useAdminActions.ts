import { useState } from 'react';

/**
 * 管理者操作（役割変更、メンバー削除）を管理するhook
 * @param updateRoleFn - 役割更新関数
 * @param removeMemberFn - メンバー削除関数
 * @param onActionComplete - 操作完了時のコールバック（オプション）
 * @returns actionLoading, handleUpdateRole, handleRemoveMember
 */
export const useAdminActions = (
  updateRoleFn: (memberId: string, data: { role: 'admin' | 'member' }) => Promise<void>,
  removeMemberFn: (memberId: string) => Promise<void>,
  onActionComplete?: () => void
) => {
  const [actionLoading, setActionLoading] = useState(false);

  /**
   * メンバーの役割を更新
   */
  const handleUpdateRole = async (memberId: string, role: 'admin' | 'member') => {
    setActionLoading(true);
    try {
      await updateRoleFn(memberId, { role });
      onActionComplete?.();
    } catch (error) {
      console.error('役割更新エラー:', error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * メンバーを削除
   */
  const handleRemoveMember = async (memberId: string) => {
    setActionLoading(true);
    try {
      await removeMemberFn(memberId);
      onActionComplete?.();
    } catch (error) {
      console.error('メンバー削除エラー:', error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  return { actionLoading, handleUpdateRole, handleRemoveMember };
};

