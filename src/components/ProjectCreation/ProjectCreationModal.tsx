import React, { useState } from 'react';
import { useProjectCreation, type ProjectCreationData } from '../../hooks/useProjectCreation';

interface ProjectCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (projectCode: string) => void;
  creatorUserId: string;
}

const ProjectCreationModal: React.FC<ProjectCreationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  creatorUserId,
}) => {
  const [formData, setFormData] = useState<ProjectCreationData>({
    name: '',
  });
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [errors, setErrors] = useState<Partial<ProjectCreationData>>({});

  const {
    loading,
    error,
    createProjectWithOwner,
    generateProjectCode,
    validateForm,
    clearError,
  } = useProjectCreation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // エラーをクリア
    if (errors[name as keyof ProjectCreationData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    clearError();
  };

  const handleGenerateCode = () => {
    const newCode = generateProjectCode();
    setGeneratedCode(newCode);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // プロジェクトコードが生成されているかチェック
    if (!generatedCode) {
      setErrors({ code: 'プロジェクトコードを生成してください' });
      return;
    }

    // バリデーション（コードを含めて）
    const validationData = { ...formData, code: generatedCode };
    const validation = validateForm(validationData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // プロジェクト作成
    const result = await createProjectWithOwner(validationData, creatorUserId);
    
    if (result.success) {
      // 成功時は生成されたプロジェクトコードを返してモーダルを閉じる
      onSuccess(generatedCode);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({ name: '' });
    setGeneratedCode('');
    setErrors({});
    clearError();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        {/* ヘッダー */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            新規プロジェクト作成
          </h3>
          <p className="text-sm text-gray-600">
            新しいプロジェクトを作成して、すぐにログインできます
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* エラーメッセージ */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* プロジェクト名 */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                プロジェクト名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="例: マイプロジェクト"
                disabled={loading}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* プロジェクトコード生成 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                プロジェクトコード <span className="text-red-500">*</span>
              </label>
              
              {generatedCode ? (
                <div className="relative">
                  <div className="px-3 py-2 pr-10 rounded-lg border-2 border-gray-300 bg-white" style={{ height: '48px' }}>
                    <div className="flex items-center h-full">
                      <p className="text-lg font-mono font-bold text-gray-800">{generatedCode}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    disabled={loading}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerateCode}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  disabled={loading}
                >
                  プロジェクトコードを生成
                </button>
              )}
              
              {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
              <p className="mt-1 text-xs text-gray-500">
                ボタンを押すと自動的にプロジェクトコードが生成されます
              </p>
            </div>

            {/* ボタン */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
                disabled={loading}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? '作成中...' : 'プロジェクト作成'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreationModal;

// エクスポートの集約
export { default as ProjectCreationModal } from './ProjectCreationModal';
