import {useEffect} from "react";
import { useOutletContext } from "react-router-dom";
import TaskBoard from "../components/TaskBoard/TaskBoard";
import type { OutletContextType } from "../components/types/outletContext";


const TeamTask: React.FC = () => {
  const { tasks, onTaskClick, toggleTaskStatus, setFilter } =
    useOutletContext<OutletContextType>();

  useEffect(() =>{
          setFilter({type:"team"});   
      },[setFilter]);

  return (
    <div className="container mx-auto p-4">
      <TaskBoard
        tasks={tasks}
        onTaskClick={onTaskClick}
        onToggleDone={toggleTaskStatus}
      />
    </div>
  );
};

export default TeamTask;
