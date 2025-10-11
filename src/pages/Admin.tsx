import { useEffect } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { useAuth } from '../hooks/useAuth';
import { useDropdownMenu } from '../hooks/useDropdownMenu';
import { useAdminActions } from '../hooks/useAdminActions';

export const Admin = () => {
  const { user } = useAuth();
  
  // プロジェクトIDの取得とメンバー管理を統合
  const { 
    userProjectId, 
    userProject,
    projectLoading, 
    members, 
    fetchProjectMembers, 
    updateMemberRole, 
    removeMember, 
    loading: adminLoading, 
    error 
  } = useAdmin(undefined, user?.id);
  
  // ドロップダウンメニュー管理
  const { openDropdownId, toggleDropdown, closeDropdown } = useDropdownMenu();
  
  // 管理者操作（役割変更、削除）
  const { actionLoading, handleUpdateRole, handleRemoveMember } = useAdminActions(
    updateMemberRole,
    removeMember,
    closeDropdown // 操作完了後にドロップダウンを閉じる
  );

  // プロジェクトIDが変更されたらメンバーを取得
  useEffect(() => {
    if (userProjectId) fetchProjectMembers();
  }, [userProjectId, fetchProjectMembers]);

  // ローディング中
  if (projectLoading) return <p className="p-4">読み込み中...</p>;
  
  // プロジェクトが見つからない
  if (!userProjectId) return <p className="p-4 text-red-500">プロジェクトが選択されていません/見つかりません</p>;
  
  // エラー表示
  if (error) return <p className='text-red-500'>{error}</p>;

  return (
    <div className="h-full w-full bg-white bg-opacity-30 backdrop-blur-xl rounded-2xl shadow-xl border border-white border-opacity-60 p-6" style={{ willChange: 'transform', transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}>
      {/* ヘッダーセクション */}
      <div className="mb-8">
        <div className="bg-white bg-opacity-30 backdrop-blur-xl rounded-2xl shadow-xl border border-white border-opacity-60 p-6" style={{ willChange: 'transform', transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">プロジェクト管理</h1>
              <p className="text-sm text-gray-500 mt-1">プロジェクトコード: {userProject?.code || 'N/A'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">総メンバー数</p>
                <p className="text-2xl font-bold text-blue-600">{members?.length || 0}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">管理者数</p>
                <p className="text-2xl font-bold text-purple-600">
                  {members?.filter(m => m.role === 'admin').length || 0}
                </p>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>


      {/* メンバー一覧 */}
      {adminLoading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">読み込み中...</p>
        </div>
      ) : members && members.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="space-y-0">
            {/* ヘッダー */}
            <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">ユーザー</div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">メールアドレス</div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">ロール</div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">操作</div>
            </div>
            
            {/* メンバー一覧 */}
            {members.map((member, index) => (
              <div key={member.id} className={`grid grid-cols-4 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ${index === members.length - 1 ? 'rounded-b-xl' : ''}`}>
                {/* ユーザー情報 */}
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">
                      {(member.user_name || member.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {member.user_name || '名前未設定'}
                    </div>
                  </div>
                </div>
                
                {/* メールアドレス */}
                <div className="flex items-center">
                  <div className="text-sm text-gray-900">{member.email || 'メール未設定'}</div>
                </div>
                
                {/* ロール */}
                <div className="flex items-center relative">
                  <div className="relative">
                    <button
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 hover:shadow-md cursor-pointer ${
                        member.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => {
                        if (!actionLoading) {
                          toggleDropdown(member.id);
                        }
                      }}
                      disabled={actionLoading}
                      title="クリックしてロールを変更"
                    >
                      {member.role === 'admin' ? '管理者' : 'メンバー'}
                      <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {openDropdownId === member.id && (
                      <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-[9999]">
                        <div className="py-2">
                          <button
                            className={`inline-flex items-center px-3 py-2 text-xs font-semibold rounded-full mx-2 mb-1 transition-colors duration-150 ${
                              member.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' 
                                : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-800'
                            }`}
                            onClick={() => handleUpdateRole(member.id, 'admin')}
                            disabled={actionLoading}
                          >
                            管理者
                          </button>
                          <button
                            className={`inline-flex items-center px-3 py-2 text-xs font-semibold rounded-full mx-2 mb-1 transition-colors duration-150 ${
                              member.role === 'member' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-800'
                            }`}
                            onClick={() => handleUpdateRole(member.id, 'member')}
                            disabled={actionLoading}
                          >
                            メンバー
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 操作 */}
                <div className="flex items-center">
                  <button
                    className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? '処理中...' : '削除'}
                  </button>
                </div>
              </div>
            ))}
            
            {/* ドロップダウンメニュー用の余白 */}
            <div className="h-20"></div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">メンバーがいません</h3>
          <p className="text-gray-500">ユーザーがプロジェクトに参加すると、ここに表示されます</p>
        </div>
      )}
    </div>
  );
};

export default Admin;
