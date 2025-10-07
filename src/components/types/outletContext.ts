import type { TaskFilter } from "../../hooks/useTasks";
import type { ExtendedTask } from "./task";

// Mainlayout(親要素)がOutlet(子要素)に対して提供する共通レイアウト部分
export type OutletContextType = {
    tasks: ExtendedTask[];
    onTaskClick: (task: ExtendedTask) => void;
    deleteTask: (id: string) => void;
    toggleTaskStatus: (id: string) => void;
    openCreateModal: () => void;
    setFilter : (filter:TaskFilter) => void;
    onShowConfirmModal: (task: ExtendedTask) => void;
};
