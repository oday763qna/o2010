
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { AppState, Task, Note, UserStats, Theme } from './types';

type Action =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'UPDATE_USER'; payload: Partial<UserStats> }
  | { type: 'SET_FOCUS_MODE'; payload: boolean }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_AI_ENABLED'; payload: boolean }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'HYDRATE'; payload: AppState };

// Level thresholds: 0, 500, 1500, 3000, 5000, 7500, 10000, 13500, 17500, 22000
const LEVEL_THRESHOLDS = [0, 500, 1500, 3000, 5000, 7500, 10000, 13500, 17500, 22000, 30000];

const calculateLevel = (xp: number) => {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return Math.min(level, 10);
};

const initialState: AppState = {
  tasks: [],
  notes: [],
  user: {
    name: 'مستخدم OD',
    xp: 0,
    level: 1,
    streak: 0,
    totalFocusTime: 0,
    completedTasks: 0,
    focusSessions: 0,
    lastActivityDate: null,
  },
  theme: 'light',
  onboarded: false,
  isFocusMode: false,
  activeTaskId: null,
  aiEnabled: true,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  isOnline: boolean;
} | undefined>(undefined);

function reducer(state: AppState, action: Action): AppState {
  let newState = { ...state };
  switch (action.type) {
    case 'ADD_TASK':
      newState.tasks = [action.payload, ...state.tasks];
      break;
    case 'UPDATE_TASK':
      newState.tasks = state.tasks.map(t => t.id === action.payload.id ? action.payload : t);
      break;
    case 'DELETE_TASK':
      newState.tasks = state.tasks.filter(t => t.id !== action.payload);
      break;
    case 'ADD_NOTE':
      newState.notes = [action.payload, ...state.notes];
      break;
    case 'UPDATE_NOTE':
      newState.notes = state.notes.map(n => n.id === action.payload.id ? { ...action.payload, updatedAt: new Date().toISOString() } : n);
      break;
    case 'UPDATE_USER':
      const currentUser = state.user;
      const updates = action.payload;
      
      let newXp = updates.xp !== undefined ? updates.xp : currentUser.xp;
      let newLevel = calculateLevel(newXp);
      let newStreak = currentUser.streak;
      let newLastActivity = currentUser.lastActivityDate;

      // Handle Streak logic when a task is completed (if completedTasks increments)
      if (updates.completedTasks !== undefined && updates.completedTasks > currentUser.completedTasks) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (currentUser.lastActivityDate === yesterdayStr) {
          newStreak = currentUser.streak + 1;
        } else if (currentUser.lastActivityDate !== today) {
          newStreak = 1;
        }
        newLastActivity = today;
      }

      newState.user = { 
        ...currentUser, 
        ...updates, 
        xp: newXp, 
        level: newLevel,
        streak: newStreak,
        lastActivityDate: newLastActivity
      };
      break;
    case 'SET_FOCUS_MODE':
      newState.isFocusMode = action.payload;
      break;
    case 'SET_THEME':
      newState.theme = action.payload;
      break;
    case 'SET_AI_ENABLED':
      newState.aiEnabled = action.payload;
      break;
    case 'COMPLETE_ONBOARDING':
      newState.onboarded = true;
      break;
    case 'HYDRATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
  
  localStorage.setItem('od_tasks_pro_state', JSON.stringify(newState));
  return newState;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const saved = localStorage.getItem('od_tasks_pro_state');
    if (saved) {
      try {
        dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) });
      } catch (e) {
        console.error("فشل تحميل البيانات", e);
      }
    }
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, isOnline }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('يجب استخدام useApp ضمن AppProvider');
  return context;
};
