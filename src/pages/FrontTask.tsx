import React from "react";
import type { ExtendedTask } from "../components/types/task";

// FrontTaskのプロパティ型定義
interface FrontTaskProps {
  onTaskClick?: (task: ExtendedTask) => void;
}

const FrontTask: React.FC<FrontTaskProps> = ({ onTaskClick: _onTaskClick }) => {
  return (
    <div className="container mx-auto p-4">
      <div className="text-center text-gray-500">
        <p>グループタスク機能は準備中です。</p>
        <p>後でSupabaseと連携して実装予定です。</p>
      </div>
    </div>
  );
};

export default FrontTask;
