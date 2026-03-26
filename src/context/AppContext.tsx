import React, { createContext, useContext, ReactNode } from 'react';
import { Task, Subject } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AppContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('study-planner-tasks', []);
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('study-planner-subjects', [
    { id: '1', name: 'Math', color: '#ef4444' },
    { id: '2', name: 'Science', color: '#3b82f6' },
    { id: '3', name: 'History', color: '#eab308' },
  ]);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('study-planner-dark-mode', false);

  return (
    <AppContext.Provider value={{ tasks, setTasks, subjects, setSubjects, darkMode, setDarkMode }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
