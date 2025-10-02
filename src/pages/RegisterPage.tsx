import { useState } from 'react';
import * as adminService from '../services/adminService';
import type { NewProject } from '../components/types/project';

interface Props {
    currentUserId: string;
}

export const RegisterPage = ({ currentUserId }: Props) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

  // ランダムプロジェクトコード生成
const generateProjectCode = () => 'PRJ-' + Math.random().toString(36).substring(2, 8).toUpperCase();

const handleSubmit = async () => {
    if (!name) return;
    setLoading(true);
    setError(null);
    try {
        const newProject: NewProject = {
        name,
        code: generateProjectCode(),
    };
    await adminService.createProject(newProject, currentUserId);
    setName('');
    alert('プロジェクト作成完了！');
    } catch (err: any) {
        setError(err.message || '作成失敗');
    } finally {
        setLoading(false);
    }
};

return (
    <div className="p-4 max-w-lg mx-auto">
        <h1 className="text-xl font-bold mb-4">新規プロジェクト作成</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input
        className="border p-2 w-full mb-2"
        placeholder="プロジェクト名"
        value={name}
        onChange={e => setName(e.target.value)}
        />
        <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
        disabled={loading}
        >
        {loading ? '作成中...' : '作成'}
        </button>
    </div>
);
};

export default RegisterPage;
