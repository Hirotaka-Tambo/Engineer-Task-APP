import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { getProjectByCode, addProjectMember, getUserProjects } from '../services/adminService';
import type { LoginFormData } from './useLoginValidation';

export const useLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (formData: LoginFormData) => {
    setErrorMessage('');
    setLoading(true);

    try {
      // ログイン処理
      const authUser = await login(formData.email, formData.password);
      console.log("ログイン成功!");

      // プロジェクトコードでプロジェクトを検索
      const project = await getProjectByCode(formData.projectCode);
      if (!project) {
        setErrorMessage("プロジェクトコードが無効です。正しいコードを入力してください。");
        return;
      }

      console.log("📋 プロジェクトが見つかりました:", project.name);

      // プロジェクトメンバーシップの処理
      if (authUser.user) {
        try {
          const userProjects = await getUserProjects(authUser.user.id);
          const isMember = userProjects.some(p => p.id === project.id);

          if (!isMember) {
            // メンバーでない場合のみ追加を試みる
            await addProjectMember(project.id, authUser.user.id, 'member');
          }
        } catch (memberError: any) {
          console.warn("プロジェクトメンバー処理エラー:", memberError.message);
          setErrorMessage("プロジェクトへの参加に失敗しました。");
          return;
        }
      }

      // 認証状態の更新を待ってから遷移
      setTimeout(() => {
        navigate('/');
      }, 100);

    } catch (error: any) {
      console.error("ログインエラー:", error);
      setErrorMessage(error.message || "ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  /**
   * プロジェクト作成後のログイン処理
   * @param formData ログインフォームデータ
   * @param projectCode 作成されたプロジェクトコード
   */
  const handleProjectCreation = async (formData: LoginFormData, projectCode: string) => {
    setErrorMessage('');
    setLoading(true);

    try {
      // ログイン処理
      const authUser = await login(formData.email, formData.password);
      console.log("ログイン成功!");

      // 作成されたプロジェクトを取得
      const project = await getProjectByCode(projectCode);
      if (!project) {
        setErrorMessage("プロジェクトの作成に失敗しました。再度お試しください。");
        return;
      }

      console.log("プロジェクトが見つかりました:", project.name);

      // プロジェクトメンバーシップの処理
      const userProjects = await getUserProjects(authUser.user.id);
      const isAlreadyMember = userProjects.some(p => p.id === project.id);

      if (!isAlreadyMember) {
        // 作成者を管理者として追加
        await addProjectMember(project.id, authUser.user.id, 'admin');
        console.log("プロジェクト管理者として追加されました");
      }

      // ログイン成功、メインページにリダイレクト
      navigate('/');
    } catch (error) {
      console.error('プロジェクト作成後のログインエラー:', error);
      setErrorMessage(error instanceof Error ? error.message : 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    errorMessage,
    setLoading,
    setErrorMessage,
    handleLogin,
    handleRegisterClick,
    handleProjectCreation,
  };
};
