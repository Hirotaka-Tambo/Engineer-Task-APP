import type { ExtendedTask } from "./task";

// Mainlayout(親要素)がOutlet(子要素)に対して提供する共通レイアウト部分
export type OutletContextType = {
    tasks: ExtendedTask[];
    onTaskClick: (task: ExtendedTask) => void;
    deleteTask: (id: number) => void;
    toggleTaskDone: (id: number) => void;
    openCreateModal: () => void;
};
