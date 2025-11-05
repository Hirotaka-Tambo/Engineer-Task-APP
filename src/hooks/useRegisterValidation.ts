import { useState } from 'react';
import { validatePasswordStrength, validateEmail } from '../utils/validationUtils';

export interface RegisterFormData {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterFormErrors {
  userName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const useRegisterValidation = () => {
  const [errors, setErrors] = useState<RegisterFormErrors>({});

  const validateForm = (formData: RegisterFormData): boolean => {
    const newErrors: RegisterFormErrors = {};

    // ユーザー名のバリデーション
    if (!formData.userName.trim()) {
      newErrors.userName = "ユーザー名を入力してください";
    } else if (formData.userName.trim().length < 2) {
      newErrors.userName = "ユーザー名は2文字以上で入力してください";
    }

    // メールアドレスのバリデーション（強化版）
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message || "正しいメールアドレスを入力してください";
    }

    // パスワードのバリデーション（強化版）
    const passwordValidation = validatePasswordStrength(formData.password, 8, true);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message || "パスワードが要件を満たしていません";
    }

    // パスワード確認のバリデーション
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "パスワードを再入力してください";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "パスワードが一致しません";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (fieldName: keyof RegisterFormErrors) => {
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
