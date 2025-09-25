import React from 'react';
import type { ExtendedTask } from '../components/types/types';

// TeamTaskのプロパティ型定義
interface TeamTaskProps {
  onTaskClick?: (task: ExtendedTask) => void;
}

const TeamTask: React.FC<TeamTaskProps> = ({ onTaskClick: _onTaskClick }) => {
  return (
    <div className="container mx-auto p-4">
      <div className="text-center text-gray-500">
        <p>チームタスク機能は準備中です。</p>
        <p>後でSupabaseと連携して実装予定です。</p>
      </div>
    </div>
  );
};

export default TeamTask;
