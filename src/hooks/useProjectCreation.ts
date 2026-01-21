import { useState } from 'react';
import { createProject } from '../services/adminService';
import { supabase } from '../services/supabaseClient';
import type { NewProject } from '../components/types/project';

export interface ProjectCreationData {
  name: string;
  code?: string; // オプショナルに変更（自動生成するため）
}

export interface ProjectCreationResult {
  success: boolean;
  project?: any;
  error?: string;
}

export const useProjectCreation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * プロジェクトコードを自動生成
   * @returns 生成されたプロジェクトコード（PRJ-XXXXXX形式）
   */
  const generateProjectCode = (): string => {
    const prefix = 'PRJ';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    
    // 6文字のランダムな英数字を生成
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    
    return `${prefix}-${code}`;
  };

  /**
   * プロジェクトを作成し、作成者をオーナーとして追加
   * @param projectData プロジェクト作成データ
   * @param creatorUserId 作成者のユーザーID
   * @returns 作成結果
   */
  const createProjectWithOwner = async (
    projectData: ProjectCreationData,
    creatorUserId: string
  ): Promise<ProjectCreationResult> => {
    setLoading(true);
    setError(null);

    try {
      // 認証状態を確認
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('セッション取得エラー:', sessionError);
        throw new Error('認証セッションの取得に失敗しました');
      }
      
      if (!session) {
        console.error('認証セッションが存在しません');
        throw new Error('ログインが必要です');
      }

      // セッションのユーザーIDと渡されたユーザーIDが一致しているか確認
      // 空文字の場合はセッションのユーザーIDを使用
      if (!creatorUserId || creatorUserId === '') {
        creatorUserId = session.user.id;
      } else if (session.user.id !== creatorUserId) {
        console.warn('セッションのユーザーIDと渡されたユーザーIDが一致しません');
        console.warn('セッションID:', session.user.id);
        console.warn('渡されたID:', creatorUserId);
        // セッションのユーザーIDを使用する
        creatorUserId = session.user.id;
      }

      // プロジェクトコードを自動生成（指定されていない場合）
      const projectCode = projectData.code || generateProjectCode();

      // プロジェクト作成データを準備
      const newProject: NewProject = {
        name: projectData.name,
        code: projectCode,
      };

      // プロジェクトを作成
      const project = await createProject(newProject, creatorUserId);

      return {
        success: true,
        project,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'プロジェクト作成に失敗しました';
      console.error('❌ プロジェクト作成エラー:', errorMessage);
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * プロジェクトコードの重複チェック
   * @param code チェックするプロジェクトコード
   * @returns 重複していない場合はtrue
   */
  const validateProjectCode = (code: string): boolean => {
    // 基本的なバリデーション
    if (!code || code.trim().length === 0) {
      return false;
    }

    // プロジェクトコードの形式チェック（例: 英数字とハイフンのみ）
    const codePattern = /^[A-Z0-9-]+$/;
    if (!codePattern.test(code)) {
      return false;
    }

    // 長さチェック（3-20文字）
    if (code.length < 3 || code.length > 20) {
      return false;
    }

    return true;
  };

  /**
   * プロジェクト名のバリデーション
   * @param name チェックするプロジェクト名
   * @returns 有効な場合はtrue
   */
  const validateProjectName = (name: string): boolean => {
    if (!name || name.trim().length === 0) {
      return false;
    }

    // 長さチェック（1-50文字）
    if (name.length < 1 || name.length > 50) {
      return false;
    }

    return true;
  };

  /**
   * フォーム全体のバリデーション
   * @param data プロジェクト作成データ
   * @returns バリデーション結果
   */
  const validateForm = (data: ProjectCreationData): { isValid: boolean; errors: Partial<ProjectCreationData> } => {
    const errors: Partial<ProjectCreationData> = {};

    if (!validateProjectName(data.name)) {
      errors.name = 'プロジェクト名は1-50文字で入力してください';
    }

    if (data.code && !validateProjectCode(data.code)) {
      errors.code = 'プロジェクトコードは3-20文字の英数字とハイフンで入力してください';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  return {
    loading,
    error,
    createProjectWithOwner,
    generateProjectCode,
    validateProjectCode,
    validateProjectName,
    validateForm,
    clearError: () => setError(null),
  };
};
