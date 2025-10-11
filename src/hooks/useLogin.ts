import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
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
      await login(formData.email, formData.password);
      console.log("ログイン成功!");

      // ログイン成功後はプロジェクト選択ページへ遷移
      setTimeout(() => {
        navigate('/project-selection');
      }, 100);

    } catch (error: any) {
      console.error("ログインエラー:", error);
      
      // エラーメッセージの日本語化
      let message = "ログインに失敗しました";
      
      if (error.message === "Invalid login credentials") {
        message = "メールアドレスまたはパスワードが正しくありません";
      } else if (error.message?.includes("Email not confirmed")) {
        message = "メールアドレスの確認が完了していません";
      } else if (error.message?.includes("Too many requests")) {
        message = "ログイン試行回数が上限に達しました。しばらくしてから再試行してください";
      } else if (error.message?.includes("User not found")) {
        message = "このメールアドレスは登録されていません";
      } else if (error.message) {
        message = error.message;
      }
      
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return {
    loading,
    errorMessage,
    handleLogin,
    handleRegisterClick,
  };
};
