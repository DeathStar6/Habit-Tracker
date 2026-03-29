export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  difficulty: Difficulty;
  createdAt: string;
}

export type DailyRecord = Record<string, string[]>;

export interface UserStats {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  achievements: string[];
}

export type Theme = 'light' | 'dark';
