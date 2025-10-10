import { useState } from 'react';
import { signUp } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import type { RegisterFormData } from './useRegisterValidation';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (formData: RegisterFormData) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      await signUp(formData.email, formData.password, formData.userName);
      
      // 登録成功時の処理（自動ログイン状態でプロジェクト選択ページへ）
      console.log("アカウント作成成功！プロジェクト選択ページへ遷移します");
      
      // プロジェクト選択ページに遷移
      navigate("/project-selection");
      
    } catch (error: any) {
      console.error("登録エラー:", error);
      
      // エラーメッセージの設定
      if (error.message?.includes("already registered")) {
        setErrorMessage("このメールアドレスは既に登録されています");
      } else if (error.message?.includes("Invalid email")) {
        setErrorMessage("無効なメールアドレスです");
      } else if (error.message?.includes("Password should be at least")) {
        setErrorMessage("パスワードは6文字以上で入力してください");
      } else {
        setErrorMessage("登録に失敗しました。もう一度お試しください");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return {
    loading,
    errorMessage,
    handleRegister,
    handleLoginClick
  };
};
