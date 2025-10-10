import {useEffect} from "react";
import { useOutletContext } from "react-router-dom";
import TaskBoard from "../components/TaskBoard/TaskBoard";
import type { OutletContextType } from "../components/types/outletContext";


const FrontTask: React.FC = () => {
  const { tasks, onTaskClick, toggleTaskStatus, setFilter, onShowConfirmModal } =
    useOutletContext<OutletContextType>();

  
  useEffect(() =>{
          setFilter({type:"front"});   
      },[setFilter]);
      
  return (
    <div className="w-full">
      <TaskBoard
        tasks={tasks}
        onTaskClick={onTaskClick}
        onToggleDone={toggleTaskStatus}
        onShowConfirmModal={onShowConfirmModal}
      />
    </div>
  );
};

export default FrontTask;
