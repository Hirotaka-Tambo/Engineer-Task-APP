import TaskCard from "../components/TaskCard/TaskCard";
import TaskForm from "../components/TaskForm/TaskForm";
import { useTasks } from "../hooks/useTasks"

const SoloTask = () => {
    const {tasks, addTask, deleteTask, toggleTaskDone} = useTasks();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text -3x1 font-bold text-center text-gray-800 mb-8">
                個人タスク
            </h1>
            <TaskForm onAddTask={addTask} />
            <div className="mt-8">
                {tasks.length === 0?(
                    <p className="text-center text-gray-500">タスクを追加してください。</p>
                ):(
                    tasks.map((task) =>(
                        <TaskCard
                            key = {task.id}
                            task={task}
                            onToggleDone={toggleTaskDone}
                            onDelete={deleteTask}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default SoloTask;