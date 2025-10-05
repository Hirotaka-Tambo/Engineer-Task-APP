import { useState } from 'react';
import * as adminService from '../services/adminService';
import { signUp } from '../services/authService';
import type { NewProject } from '../components/types/project';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        projectName: ''
    });
    const [errors, setErrors] = useState<{
        userName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        projectName?: string;
    }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successData, setSuccessData] = useState<{
        projectCode: string;
        email: string;
        password: string;
    } | null>(null);
    const navigate = useNavigate();

     // ランダムプロジェクトコード生成
    const generateProjectCode = () => 'PRJ-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!formData.userName.trim()) {
            newErrors.userName = "ユーザー名を入力してください";
        } else if (formData.userName.trim().length < 2) {
            newErrors.userName = "ユーザー名は2文字以上で入力してください";
        }

        if (!formData.email.trim()) {
            newErrors.email = "メールアドレスを入力してください";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "有効なメールアドレスを入力してください";
        }

        if (!formData.password) {
            newErrors.password = "パスワードを入力してください";
        } else if (formData.password.length < 6) {
            newErrors.password = "パスワードは6文字以上で入力してください";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "パスワード確認を入力してください";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "パスワードが一致しません";
        }

        if (!formData.projectName.trim()) {
            newErrors.projectName = "プロジェクト名を入力してください";
        } else if (formData.projectName.trim().length < 2) {
            newErrors.projectName = "プロジェクト名は2文字以上で入力してください";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (validateForm()) {
            setLoading(true);
            try {
                // 1. ユーザー登録
                console.log("ユーザー登録開始...");
                const authData = await signUp(formData.email, formData.password, formData.userName);
                
                if (!authData.user) {
                    throw new Error("ユーザー登録に失敗しました");
                }

                console.log("ユーザー登録成功, user ID:", authData.user.id);

                // 2. プロジェクト作成
                console.log("🏗️ プロジェクト作成開始...");
            const newProject: NewProject = {
                    name: formData.projectName,
                code: generateProjectCode(),
            };
        
                const createdProject = await adminService.createProject(newProject, authData.user.id);
                
                console.log("登録&プロジェクト作成成功!");
                console.log("作成されたプロジェクト:", createdProject);
                
                // 成功データを設定してモーダルを表示
                setSuccessData({
                    projectCode: createdProject.code,
                    email: formData.email,
                    password: formData.password
                });
                setShowSuccessModal(true);
    } catch (err: any) {
                console.error("登録エラー:", err);
                setError(err.message || "登録に失敗しました");
    } finally {
        setLoading(false);
    }
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        setSuccessData(null);
        // フォームをリセット
        setFormData({
            userName: '',
            email: '',
            password: '',
            confirmPassword: '',
            projectName: ''
        });
        navigate('/login');
};

return (
        <div className="min-h-screen bg-gradient-to-br from-[#3B62FF] via-[#5B8FFF] to-[#5BFFE4] flex items-center justify-center p-4">
            <div className="bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-lg border border-white border-opacity-60">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Nexst Task
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    新規ユーザー登録 & プロジェクト作成
                </p>

                <form onSubmit={handleSubmit}>
                    {/* エラーメッセージ */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
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

                    {/* パスワード */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            パスワード
                        </label>
                        <div className={`rounded-lg border-2 overflow-hidden ${
                            errors.password || errors.confirmPassword
                                ? 'border-red-500' 
                                : 'border-white border-opacity-60'
                        }`}>
                            {/* パスワード入力欄 */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 pr-10 focus:outline-none focus:ring-2 ${
                                        errors.password 
                                            ? 'focus:ring-red-500' 
                                            : 'focus:ring-blue-500'
                                    }`}
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
                            <div className="border-t border-gray-200"></div>
                            
                            {/* パスワード確認入力欄 */}
                            <div className="relative">
        <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 pr-10 focus:outline-none focus:ring-2 ${
                                        errors.confirmPassword 
                                            ? 'focus:ring-red-500' 
                                            : 'focus:ring-blue-500'
                                    }`}
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

                    {/* プロジェクト名 */}
                    <div className="mb-8">
                        <label htmlFor="projectName" className="block text-sm font-bold text-gray-700 mb-2">
                            プロジェクト名
                        </label>
                        <input
                            type="text"
                            id="projectName"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 ${
                                errors.projectName 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-white border-opacity-60 focus:border-blue-500'
                            }`}
                            placeholder="プロジェクト名を入力"
                            disabled={loading}
                        />
                        {errors.projectName && <p className="mt-1 text-sm text-red-600">{errors.projectName}</p>}
                    </div>

                    <button
                        type="submit"
        disabled={loading}
                        className="w-full bg-white bg-opacity-30 hover:bg-opacity-40 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white border-opacity-60 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "登録中..." : "ユーザー登録 & プロジェクト作成"}
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
                    ログインはこちら
                </button>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500 bg-white bg-opacity-20 px-3 py-2 rounded-lg border border-white border-opacity-30">
                        © 2024 Nexst Task. 毎日を everyday に.
                    </p>
                </div>
            </div>

            {/* 成功モーダル */}
            {showSuccessModal && successData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">登録完了！</h2>
                            <p className="text-gray-600">ユーザー登録とプロジェクト作成が完了しました</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3">ログイン情報</h3>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">プロジェクトコード</label>
                                    <div className="bg-white border border-gray-300 rounded-lg p-3 font-mono text-sm">
                                        {successData.projectCode}
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                                    <div className="bg-white border border-gray-300 rounded-lg p-3 text-sm">
                                        {successData.email}
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
                                    <div className="bg-white border border-gray-300 rounded-lg p-3 font-mono text-sm">
                                        {successData.password}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-blue-800">
                                    この情報をメモしておいてください。ログイン時に必要になります。
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleModalClose}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            ログインページへ
        </button>
                    </div>
                </div>
            )}
    </div>
);
};

export default RegisterPage;
