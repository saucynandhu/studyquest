export interface User {
  uid: string;
  email: string;
  displayName: string;
  xp: number;
  level: number;
  streak: number;
  achievements: string[];
  powerUps: PowerUp[];
  lastLoginDate: string;
}

export interface Mission {
  id: string;
  title: string;
  subject: string;
  duration: number; // in minutes
  deadline: string;
  xpValue: number;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  timerActive?: boolean;
  timerStartTime?: string;
  timeRemaining?: number; // in minutes
  overdue?: boolean;
}

export interface TimetableEntry {
  id: string;
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  day: string;
  userId: string;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  effect: string;
  cooldown: number; // in hours
  lastUsed: string | null;
  active: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  xp: number;
  level: number;
  streak: number;
} 