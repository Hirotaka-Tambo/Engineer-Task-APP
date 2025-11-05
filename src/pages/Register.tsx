import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRegisterValidation, type RegisterFormData } from "../hooks/useRegisterValidation";
import { useRegister } from "../hooks/useRegister";
import { getPasswordStrength, type PasswordStrength } from "../utils/validationUtils";

const Register = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    userName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const { errors, validateForm, clearFieldError } = useRegisterValidation();
  const { loading, errorMessage, handleRegister, handleLoginClick } = useRegister();

  // パスワード強度をリアルタイムで計算
  const passwordStrength = useMemo<PasswordStrength>(() => {
    return getPasswordStrength(formData.password);
  }, [formData.password]);

  // パスワード強度の表示用ラベルとスタイル
  const getStrengthInfo = (strength: PasswordStrength) => {
    switch (strength) {
      case 'weak':
        return { label: '弱い', color: 'bg-red-500', textColor: 'text-red-600' };
      case 'medium':
        return { label: '普通', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
      case 'strong':
        return { label: '強い', color: 'bg-blue-500', textColor: 'text-blue-600' };
      case 'very-strong':
        return { label: '非常に強い', color: 'bg-green-500', textColor: 'text-green-600' };
      default:
        return { label: '', color: 'bg-gray-300', textColor: 'text-gray-600' };
    }
  };

  const strengthInfo = getStrengthInfo(passwordStrength);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearFieldError(name as keyof RegisterFormData);
  };

  // パスワード入力時にポップアップの位置を計算
  useEffect(() => {
    if (formData.password && passwordInputRef.current) {
      const rect = passwordInputRef.current.getBoundingClientRect();
      setPopupPosition({
        top: rect.top + window.scrollY,
        left: rect.right + 16 // フォームの右側に16pxのマージン
      });
      // アニメーション用：少し遅延させてから表示
      setTimeout(() => setShowPopup(true), 10);
    } else {
      // 消えるアニメーションを実行（popupPositionが存在する場合のみ）
      if (popupPosition) {
        setShowPopup(false);
        // アニメーション完了後に要素を削除
        const timer = setTimeout(() => {
          setPopupPosition(null);
        }, 300); // アニメーション時間（0.3s）に合わせる
        
        return () => clearTimeout(timer);
      }
    }
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm(formData)) {
      await handleRegister(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B62FF] via-[#5B8FFF] to-[#5BFFE4] flex items-center justify-center p-4">
      <div className="relative bg-white bg-opacity-30 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-lg border border-white border-opacity-60">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Nexst Task
        </h1>
        
        {/* 区切り線 */}
        <div className="mb-8 relative flex items-center">
          <div className="flex-1 border-t border-white border-opacity-40"></div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* エラーメッセージ */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* ユーザー名 */}
          <div className="mb-6">
            <label htmlFor="userName" className="block text-sm font-bold text-gray-700 mb-2">
              ユーザー名
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 ${
                errors.userName 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-white border-opacity-60 focus:border-blue-500'
              }`}
              placeholder="ユーザー名を入力"
              disabled={loading}
            />
            {errors.userName && <p className="mt-1 text-sm text-red-600">{errors.userName}</p>}
          </div>

          {/* メールアドレス */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-white border-opacity-60 focus:border-blue-500'
              }`}
              placeholder="example@email.com"
              disabled={loading}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* パスワード（一体型デザイン） */}
          <div className="mb-8 relative">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              パスワード
            </label>
            <div className={`rounded-lg border-2 overflow-hidden ${
              errors.password || errors.confirmPassword
                ? 'border-red-500' 
                : 'border-white border-opacity-60 focus-within:border-blue-500'
            }`}>
              {/* パスワード入力欄 */}
              <div className="relative">
                <input
                  ref={passwordInputRef}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 focus:outline-none focus:ring-0 border-0 bg-white"
                  placeholder="パスワードを入力"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* 区切り線 */}
              <div className="h-px bg-gray-300 mx-3"></div>
              
              {/* パスワード確認入力欄 */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 focus:outline-none focus:ring-0 border-0 bg-white"
                  placeholder="パスワードを再入力"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {/* エラーメッセージ */}
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 bg-opacity-80 hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "登録中..." : "アカウント作成"}
          </button>
        </form>

        {/* 区切り線 */}
        <div className="mt-6 mb-4 relative flex items-center">
          <div className="flex-1 border-t border-white border-opacity-40"></div>
          <span className="px-4 text-sm text-white">または</span>
          <div className="flex-1 border-t border-white border-opacity-40"></div>
        </div>

        <button
          onClick={handleLoginClick}
          className="w-full bg-white bg-opacity-30 hover:bg-opacity-40 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white border-opacity-60"
        >
          ログインページへ
        </button>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 bg-white bg-opacity-20 px-3 py-2 rounded-lg border border-white border-opacity-30">
            © 2025 Nexst Task. 毎日を everyday に.
          </p>
        </div>
      </div>

      {/* パスワード強度ポップアップ - コンテナ外に表示（デスクトップ用） */}
      {popupPosition && (
        <div 
          className="fixed w-80 bg-white rounded-lg shadow-xl p-4 z-50 hidden md:block"
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
            opacity: showPopup ? 1 : 0,
            transform: showPopup ? 'translateX(0) scale(1)' : 'translateX(-10px) scale(0.95)',
            transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
          }}
        >
          {/* パスワード強度インジケーター */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-gray-700">パスワード強度:</span>
              <span className={`text-sm font-bold ${strengthInfo.textColor}`}>
                {strengthInfo.label}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${strengthInfo.color}`}
                style={{
                  width: passwordStrength === 'weak' ? '25%' :
                         passwordStrength === 'medium' ? '50%' :
                         passwordStrength === 'strong' ? '75%' : '100%'
                }}
              />
            </div>
          </div>
          
          {/* パスワード要件リスト */}
          <div className="text-xs text-gray-700">
            <p className="mb-2 font-semibold text-gray-800">パスワード要件:</p>
            <ul className="list-disc list-inside space-y-1">
              <li className={formData.password.length >= 8 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                8文字以上
              </li>
              <li className={/[A-Z]/.test(formData.password) ? 'text-green-600 font-medium' : 'text-gray-500'}>
                大文字を含む
              </li>
              <li className={/[a-z]/.test(formData.password) ? 'text-green-600 font-medium' : 'text-gray-500'}>
                小文字を含む
              </li>
              <li className={/\d/.test(formData.password) ? 'text-green-600 font-medium' : 'text-gray-500'}>
                数字を含む
              </li>
              <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-green-600 font-medium' : 'text-gray-500'}>
                特殊文字を含む（!@#$%^&*など）
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* モバイル用：パスワード強度ポップアップ - 下に表示 */}
      {popupPosition && (
        <div 
          className="mt-4 md:hidden bg-white rounded-lg shadow-xl p-4"
          style={{
            opacity: showPopup ? 1 : 0,
            transform: showPopup ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
            transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
          }}
        >
          {/* パスワード強度インジケーター */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-gray-700">パスワード強度:</span>
              <span className={`text-sm font-bold ${strengthInfo.textColor}`}>
                {strengthInfo.label}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${strengthInfo.color}`}
                style={{
                  width: passwordStrength === 'weak' ? '25%' :
                         passwordStrength === 'medium' ? '50%' :
                         passwordStrength === 'strong' ? '75%' : '100%'
                }}
              />
            </div>
          </div>
          
          {/* パスワード要件リスト */}
          <div className="text-xs text-gray-700">
            <p className="mb-2 font-semibold text-gray-800">パスワード要件:</p>
            <ul className="list-disc list-inside space-y-1">
              <li className={formData.password.length >= 8 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                8文字以上
              </li>
              <li className={/[A-Z]/.test(formData.password) ? 'text-green-600 font-medium' : 'text-gray-500'}>
                大文字を含む
              </li>
              <li className={/[a-z]/.test(formData.password) ? 'text-green-600 font-medium' : 'text-gray-500'}>
                小文字を含む
              </li>
              <li className={/\d/.test(formData.password) ? 'text-green-600 font-medium' : 'text-gray-500'}>
                数字を含む
              </li>
              <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-green-600 font-medium' : 'text-gray-500'}>
                特殊文字を含む（!@#$%^&*など）
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;