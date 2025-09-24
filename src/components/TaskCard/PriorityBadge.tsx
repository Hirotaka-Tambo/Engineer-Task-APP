import React from 'react';
import type { Priority } from '../types/types';

interface PriorityBadgeProps {
  priority: Priority;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case 1:
        return '高';
      case 2:
        return '中';
      case 3:
        return '低';
      default:
        return '未設定';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority)}`}></div>
      <span className="text-xs text-gray-600 bg-white bg-opacity-30 px-2 py-1 rounded-lg border border-white border-opacity-40">
        {getPriorityLabel(priority)}
      </span>
    </div>
  );
};

export default PriorityBadge;
