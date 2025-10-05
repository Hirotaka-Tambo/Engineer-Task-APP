import { useState } from 'react';

export interface LoginFormData {
  email: string;
  password: string;
  projectCode: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  projectCode?: string;
}

export const useLoginValidation = () => {
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const validateForm = (formData: LoginFormData): boolean => {
    const newErrors: LoginFormErrors = {};

    // メールアドレスのバリデーション
    if (!formData.email.trim()) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }

    // パスワードのバリデーション
    if (!formData.password) {
      newErrors.password = "パスワードを入力してください";
    } else if (formData.password.length < 6) {
      newErrors.password = "パスワードは6文字以上で入力してください";
    }

    // プロジェクトコードのバリデーション
    if (!formData.projectCode.trim()) {
      newErrors.projectCode = "プロジェクトコードを入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (fieldName: keyof LoginFormErrors) => {
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  return {
    errors,
    validateForm,
    clearFieldError
  };
};
