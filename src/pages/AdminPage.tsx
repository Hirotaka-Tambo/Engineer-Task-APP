import { useState, useEffect } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { useParams } from 'react-router-dom';

export const AdminPage = () => {
  const {projectId} = useParams<{projectId: string}>();
  
  const { members, fetchProjectMembers, addMember, updateMemberRole, removeMember, loading, error } = useAdmin(projectId);
  const [newUserId, setNewUserId] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'member'>('member');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (projectId) fetchProjectMembers();
  }, [projectId, fetchProjectMembers]);

  if (!projectId) return <p className="p-4 text-red-500">プロジェクトが選択されていません</p>;

  if(error) return <p className='text-red-500'>{error}</p>

  const handleAddMember = async () => {
    if (!newUserId) return;
    setActionLoading(true);
    try {
      await addMember(newUserId, newRole);
      setNewUserId('');
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateRole = async (memberId: string, role: 'admin' | 'member') => {
    setActionLoading(true);
    try {
      await updateMemberRole(memberId, { role });
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    setActionLoading(true);
    try {
      await removeMember(memberId);
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">プロジェクト管理(ID: {projectId})</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4 flex items-center gap-2">
        <input
          className="border p-2"
          placeholder="ユーザーID"
          value={newUserId}
          onChange={e => setNewUserId(e.target.value)}
        />
        <select className="border p-2" value={newRole} onChange={e => setNewRole(e.target.value as 'admin' | 'member')}>
          <option value="member">メンバー</option>
          <option value="admin">管理者</option>
        </select>
        <button
          className="bg-green-500 text-white px-2 py-1 rounded"
          onClick={handleAddMember}
          disabled={actionLoading || !newUserId}
        >
          {actionLoading ? '処理中...' : '追加'}
        </button>
      </div>

      <table className="border w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">ユーザー名</th>
            <th className="border px-2 py-1">メール</th>
            <th className="border px-2 py-1">役割</th>
            <th className="border px-2 py-1">操作</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map(member => (
              <tr key={member.id}>
                <td className="border px-2 py-1">{member.user_name || '-'}</td>
                <td className="border px-2 py-1">{member.email || '-'}</td>
                <td className="border px-2 py-1">
                  <select
                    value={member.role}
                    onChange={e => handleUpdateRole(member.id, e.target.value as 'admin' | 'member')}
                  >
                    <option value="member">メンバー</option>
                    <option value="admin">管理者</option>
                  </select>
                </td>
                <td className="border px-2 py-1">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={actionLoading}
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-2">メンバーがいません</td>
            </tr>
          )}
        </tbody>
      </table>

      {loading && <p>読み込み中...</p>}
    </div>
  );
};

export default AdminPage;
