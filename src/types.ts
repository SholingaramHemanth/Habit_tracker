export interface Habit {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  color: string;
  icon: string;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  accentColor: string;
  weekStart: 'sunday' | 'monday';
  language: string;
  reminders: {
    enabled: boolean;
    times: string[];
    repeatDays: string[];
    smartReminders: boolean;
    snooze: boolean;
    mute: boolean;
    streakAlerts: boolean;
    sound: boolean;
    vibration: boolean;
    dnd: boolean;
    missedAlerts: boolean;
    aiTiming: boolean;
    tone: string;
  };
  gamification: {
    showXp: boolean;
    showLevels: boolean;
    showRewards: boolean;
  };
  habits: {
    resetRule: '1miss' | '2misses' | 'flexible';
    units: {
      distance: 'km' | 'miles';
      water: 'liters' | 'glasses';
    };
  };
  privacy: {
    biometrics: boolean;
    privateMode: boolean;
    lockScreenPrivacy: boolean;
  };
  advanced: {
    aiSuggestions: boolean;
    soundEffects: boolean;
    minimalMode: boolean;
    betaFeatures: boolean;
  };
  vacationMode: boolean;
}

export interface User {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  avatar: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  emoji?: string;
  goal?: string;
  settings: UserSettings;
}

export interface Mission {
  id: string;
  description: string;
  rewardXp: number;
  completed: boolean;
}

export type NotificationType = 'habit' | 'reminder' | 'achievement';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  habitId?: string; // Link to a habit if it's a 'habit' notification
}
