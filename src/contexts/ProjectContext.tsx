import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Project } from '../components/types/project';

interface ProjectContextType {
  selectedProjectId: string | null;
  selectedProject: Project | null;
  setSelectedProject: (projectId: string, project: Project) => void;
  clearSelectedProject: () => void;
  hasSelectedProject: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const PROJECT_STORAGE_KEY = 'nexst_task_selected_project_id';
const PROJECT_DATA_STORAGE_KEY = 'nexst_task_selected_project_data';

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProject, setSelectedProjectState] = useState<Project | null>(null);

  // 初期化時にローカルストレージから復元
  useEffect(() => {
    const storedProjectId = localStorage.getItem(PROJECT_STORAGE_KEY);
    const storedProjectData = localStorage.getItem(PROJECT_DATA_STORAGE_KEY);
    
    if (storedProjectId && storedProjectData) {
      try {
        const project = JSON.parse(storedProjectData) as Project;
        setSelectedProjectId(storedProjectId);
        setSelectedProjectState(project);
        console.log('プロジェクト情報を復元しました:', project.name);
      } catch (error) {
        console.error('プロジェクト情報の復元に失敗しました:', error);
        localStorage.removeItem(PROJECT_STORAGE_KEY);
        localStorage.removeItem(PROJECT_DATA_STORAGE_KEY);
      }
    }
  }, []);

  const setSelectedProject = (projectId: string, project: Project) => {
    console.log('setSelectedProject 呼び出し:', { projectId, projectName: project.name });
    setSelectedProjectId(projectId);
    setSelectedProjectState(project);
    localStorage.setItem(PROJECT_STORAGE_KEY, projectId);
    localStorage.setItem(PROJECT_DATA_STORAGE_KEY, JSON.stringify(project));
    console.log('プロジェクトを選択しました:', project.name);
    console.log('ローカルストレージに保存:', { projectId, projectData: project });
  };

  const clearSelectedProject = () => {
    setSelectedProjectId(null);
    setSelectedProjectState(null);
    localStorage.removeItem(PROJECT_STORAGE_KEY);
    localStorage.removeItem(PROJECT_DATA_STORAGE_KEY);
    console.log('プロジェクト選択をクリアしました');
  };

  return (
    <ProjectContext.Provider
      value={{
        selectedProjectId,
        selectedProject,
        setSelectedProject,
        clearSelectedProject,
        hasSelectedProject: selectedProjectId !== null,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

