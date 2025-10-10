import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectSelection } from '../hooks/useProjectSelection';
import { useProject } from '../contexts/ProjectContext';
import { ProjectCreationModal } from '../components/ProjectCreation/ProjectCreationModal';
import { logout } from '../services/authService';
import type { Project } from '../components/types/project';

const ProjectSelection: React.FC = () => {
  const navigate = useNavigate();
  const { projects, loading, error, userId, fetchUserProjects, joinProjectByCode, handleProjectCreated } = useProjectSelection();
  const { setSelectedProject } = useProject();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);

  // 初回読み込み時にプロジェクト一覧を取得
  useEffect(() => {
    if (userId) {
      fetchUserProjects();
    }
  }, [userId]);

  // プロジェクトを選択してダッシュボードへ
  const handleSelectProject = (project: Project) => {
    console.log('プロジェクト選択開始:', project);
    setSelectedProject(project.id, project);
    console.log('プロジェクト選択完了、ダッシュボードへ遷移');
    
    // 認証状態が安定するまで少し待機してから遷移
    setTimeout(() => {
      navigate('/');
    }, 100);
  };

  // プロジェクト作成成功時の処理
  const handleProjectCreationSuccess = async (projectCode: string) => {
    const result = await handleProjectCreated(projectCode);
    
    if (result.success && result.project) {
      setShowCreateModal(false);
      // 作成したプロジェクトを自動選択
      handleSelectProject(result.project);
    }
  };

  // プロジェクトコードで参加
  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError('');
    setJoinLoading(true);

    try {
      const result = await joinProjectByCode(joinCode.trim());
      
      if (result.success && result.project) {
        setShowJoinForm(false);
        setJoinCode('');
        // 参加したプロジェクトを自動選択
        handleSelectProject(result.project);
      } else {
        setJoinError(result.error || 'プロジェクトへの参加に失敗しました');
      }
    } catch (err) {
      setJoinError('プロジェクトへの参加に失敗しました');
    } finally {
      setJoinLoading(false);
    }
  };

  // ログアウト
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('ログアウトエラー:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B62FF] via-[#5B8FFF] to-[#5BFFE4] flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl p-8 w-full max-w-4xl shadow-lg border border-white border-opacity-60">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Nexst Task
            </h1>
            <p className="text-sm text-gray-600 mt-1">プロジェクトを選択してください</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            ログアウト
          </button>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* アクションボタン */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新規プロジェクト作成
          </button>

          <button
            onClick={() => setShowJoinForm(!showJoinForm)}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            コードで参加
          </button>
        </div>

        {/* プロジェクトコード入力フォーム */}
        {showJoinForm && (
          <div className="mb-8 p-6 bg-white bg-opacity-70 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">プロジェクトコードを入力</h3>
            <form onSubmit={handleJoinSubmit}>
              {joinError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {joinError}
                </div>
              )}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="例: PRJ-ABC123"
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"
                  disabled={joinLoading}
                />
                <button
                  type="submit"
                  disabled={joinLoading || !joinCode.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {joinLoading ? '参加中...' : '参加'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* プロジェクト一覧 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">参加中のプロジェクト</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-600">読み込み中...</div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 bg-white bg-opacity-30 rounded-xl">
              <p className="text-gray-600 mb-4">まだプロジェクトに参加していません</p>
              <p className="text-sm text-gray-500">新しいプロジェクトを作成するか、コードで参加してください</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => {
                    console.log('プロジェクトカードがクリックされました:', project.name);
                    handleSelectProject(project);
                  }}
                  className="bg-white bg-opacity-60 backdrop-blur-lg rounded-xl p-6 shadow-md border border-white border-opacity-60 cursor-pointer hover:bg-opacity-80 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                      {project.memberCount || 0} メンバー
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    <span className="font-mono">{project.code}</span>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    作成日: {new Date(project.created_at).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 bg-white bg-opacity-20 px-3 py-2 rounded-lg border border-white border-opacity-30 inline-block">
            © 2024 Nexst Task. 毎日を everyday に.
          </p>
        </div>
      </div>

      {/* プロジェクト作成モーダル */}
      <ProjectCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleProjectCreationSuccess}
        creatorUserId={userId || ''}
      />
    </div>
  );
};

export default ProjectSelection;

