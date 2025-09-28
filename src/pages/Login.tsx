import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      userName: "",
      password: ""
    });
    const [errors, setErrors] = useState<{userName?: string, password?: string}>({});
    const [showPassword, setShowPassword] = useState(false);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  
      if (errors[name as keyof typeof errors]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    };
  
    const validateForm = () => {
      const newErrors: {userName?: string, password?: string} = {};
  
      if (!formData.userName.trim()) {
        newErrors.userName = "ユーザー名を入力してください";
      } else if (formData.userName.trim().length < 3) {
        newErrors.userName = "ユーザー名は3文字以上で入力してください";
      }
  
      if (!formData.password) {
        newErrors.password = "パスワードを入力してください";
      } else if (formData.password.length < 6) {
        newErrors.password = "パスワードは6文字以上で入力してください";
      }
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        console.log("ログイン情報:", formData);
        // TODO: API連携 & navigate('/dashboard') など
      }
    };
  
    const handleRegisterClick = () => {
      navigate('/register');
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#3B62FF] via-[#5B8FFF] to-[#5BFFE4] flex items-center justify-center p-4">
        <div className="bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-lg border border-white border-opacity-60">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Nexst Task
          </h1>
  
          <form onSubmit={handleSubmit}>
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
              />
              {errors.userName && <p className="mt-1 text-sm text-red-600">{errors.userName}</p>}
            </div>
  
            {/* パスワード */}
            <div className="mb-8">
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                パスワード
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 pr-10 rounded-lg border-2 focus:outline-none focus:ring-2 ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-white border-opacity-60 focus:border-blue-500'
                  }`}
                  placeholder="パスワードを入力"
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
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
  
            <button
              type="submit"
              className="w-full bg-white bg-opacity-30 hover:bg-opacity-40 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white border-opacity-60"
            >
              ログイン
            </button>
          </form>
  
          {/* 区切り線 */}
          <div className="mt-6 mb-4 relative flex items-center">
            <div className="flex-1 border-t border-white border-opacity-40"></div>
            <span className="px-4 text-sm text-white">または</span>
            <div className="flex-1 border-t border-white border-opacity-40"></div>
          </div>
  
          <button
            onClick={handleRegisterClick}
            className="w-full bg-blue-600 bg-opacity-80 hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            新規登録はこちら
          </button>
  
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 bg-white bg-opacity-20 px-3 py-2 rounded-lg border border-white border-opacity-30">
              © 2024 Nexst Task. 毎日を everyday に.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
export default Login;