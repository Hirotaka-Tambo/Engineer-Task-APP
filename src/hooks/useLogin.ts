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
      setErrorMessage(error.message || "ログインに失敗しました");
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
