
export type Category = 'دراسة' | 'عمل' | 'ترفيه' | 'أخرى';
export type Priority = 'منخفضة' | 'متوسطة' | 'عالية';
export type Status = 'قيد الانتظار' | 'قيد التنفيذ' | 'مكتملة';
export type Theme = 'light' | 'dark';

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: Status;
  dueDate: string;
  estimatedDuration: number;
  pomodoroConfig: number;
  notes: string;
  subTasks: SubTask[];
  youtubeLinks: string[];
  externalLinks: string[];
  attachments: { name: string; url: string; type: 'image' | 'file' }[];
  completionPercentage: number;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folder: string;
  updatedAt: string;
  attachments: string[];
}

export interface UserStats {
  name: string;
  xp: number;
  level: number;
  streak: number;
  totalFocusTime: number;
  completedTasks: number;
  focusSessions: number;
  lastActivityDate: string | null;
}

export interface AppState {
  tasks: Task[];
  notes: Note[];
  user: UserStats;
  theme: Theme;
  onboarded: boolean;
  isFocusMode: boolean;
  activeTaskId: string | null;
  aiEnabled: boolean;
}
