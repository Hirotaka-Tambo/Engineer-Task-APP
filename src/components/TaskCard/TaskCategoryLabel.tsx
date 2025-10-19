// components/TaskCategoryLabel.tsx
import type{ TaskCategory } from '../types/task';

type Props = { categories: TaskCategory[] };

export const TaskCategoryLabel = ({ categories }: Props) => (
<div className="flex flex-wrap gap-1">
    {categories.map((c) => (
        <span
        key={c}
        className="text-xs text-blue-600 bg-white bg-opacity-30 px-2 py-1 rounded-xl border border-blue-600"
        >
        #{c}
        </span>
    ))}
    </div>
);
