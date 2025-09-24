// タスクの優先度を表すリテラル型
export type Priority = 1 | 2 | 3;

// タスクの状態を表す型
export type TaskStatus = 'todo' | 'in-progress' | 'done';

/**
 * @description タスクの基本要素を定義する型
 */
export interface Task {
    id: number;
    text: string;
    done: boolean;
    priority: Priority;
    tag: string;
    // icon: string; 画像ファイルは後々収集して再定義。(SVGで記述。)
    createdAt: Date;
}

// 画像ファイルは後々収集して再定義。(SVGで記述。)
// const tsIcon: string = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#3178C6" d="..."></path></svg>`;