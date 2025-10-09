import {useEffect} from "react";
import { useOutletContext } from "react-router-dom";
import TaskBoard from "../components/TaskBoard/TaskBoard";
import type { OutletContextType } from "../components/types/outletContext";

const SoloTask: React.FC = () => {
  const { tasks, onTaskClick, toggleTaskStatus, setFilter, deleteTask, onShowConfirmModal } =
    useOutletContext<OutletContextType>();
  

  useEffect(() =>{
      setFilter({type:"solo"});   
  },[setFilter]);
    
  
  return (
    <div className="w-full">
      <TaskBoard
        tasks={tasks}
        onTaskClick={onTaskClick}
        onToggleDone={toggleTaskStatus}
        onDeleteTask={deleteTask}
        onShowConfirmModal={onShowConfirmModal}
      />
    </div>
  );
};

export default SoloTask;
