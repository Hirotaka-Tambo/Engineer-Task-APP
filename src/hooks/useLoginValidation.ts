import { useState } from 'react';
import { validateEmail, validatePasswordStrength, containsXSSPattern, containsSQLInjectionPattern } from '../utils/validationUtils';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export const useLoginValidation = () => {
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const validateForm = (formData: LoginFormData): boolean => {
    const newErrors: LoginFormErrors = {};

    // メールアドレスのバリデーション（セキュリティ強化版）
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid && emailValidation.message) {
      newErrors.email = emailValidation.message;
    }

    // セキュリティパターンチェック
    if (containsXSSPattern(formData.email) || containsSQLInjectionPattern(formData.email)) {
      newErrors.email = "不正な文字が含まれています";
    }

    // パスワードのバリデーション（セキュリティ強化版）
    const passwordValidation = validatePasswordStrength(formData.password, 6);
    if (!passwordValidation.isValid && passwordValidation.message) {
      newErrors.password = passwordValidation.message;
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
