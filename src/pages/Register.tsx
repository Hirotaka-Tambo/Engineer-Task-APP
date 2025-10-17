import React, { useState } from "react";
import { useRegisterValidation, type RegisterFormData } from "../hooks/useRegisterValidation";
import { useRegister } from "../hooks/useRegister";

const Register = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    userName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { errors, validateForm, clearFieldError } = useRegisterValidation();
  const { loading, errorMessage, handleRegister, handleLoginClick } = useRegister();


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearFieldError(name as keyof RegisterFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm(formData)) {
      await handleRegister(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B62FF] via-[#5B8FFF] to-[#5BFFE4] flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-30 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-lg border border-white border-opacity-60">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Nexst Task
        </h1>

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
          <div className="mb-8">
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
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 focus:outline-none focus:ring-0 border-0 bg-white"
                  placeholder="パスワードを入力（6文字以上）"
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
            className="w-full bg-white bg-opacity-30 hover:bg-opacity-40 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white border-opacity-60 disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="w-full bg-blue-600 bg-opacity-80 hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ログインページへ
        </button>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 bg-white bg-opacity-20 px-3 py-2 rounded-lg border border-white border-opacity-30">
            © 2025 Nexst Task. 毎日を everyday に.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;