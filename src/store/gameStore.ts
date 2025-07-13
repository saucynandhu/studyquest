import { create } from 'zustand';
import { PowerUp, Achievement } from '@/types';
import { getUserProfile, updateUserProfile, saveTimetableSessions as saveTimetableToFirebase, saveExams as saveExamsToFirebase } from '@/lib/firebase-utils';

interface Mission {
  id: string;
  title: string;
  subject: string;
  duration: number;
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

interface Exam {
  id: string;
  title: string;
  subject: string;
  examDate: string;
  examTime: string;
  location?: string;
  notes?: string;
  createdAt: string;
}

interface GameState {
  userId: string | null;
  xp: number;
  level: number;
  streak: number;
  powerUps: PowerUp[];
  achievements: Achievement[];
  missions: Mission[];
  exams: Exam[];
  timetable: any[];
  isLoading: boolean;
  setUserId: (userId: string | null) => void;
  setXP: (xp: number) => void;
  addXP: (amount: number) => void;
  setLevel: (level: number) => void;
  setStreak: (streak: number) => void;
  activatePowerUp: (powerUpId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  addMission: (mission: Omit<Mission, 'id' | 'createdAt' | 'xpValue'>) => void;
  completeMission: (missionId: string) => void;
  deleteMission: (missionId: string) => void;
  startTimer: (missionId: string) => void;
  stopTimer: (missionId: string) => void;
  checkDeadlines: () => void;
  addExam: (exam: Omit<Exam, 'id' | 'createdAt'>) => void;
  deleteExam: (examId: string) => void;
  saveTimetableSessions: (sessions: any[]) => Promise<void>;
  loadUserData: (userId: string) => Promise<void>;
  saveUserData: () => Promise<void>;
  resetUserData: () => void;
}

export const useGameStore = create<GameState>()((set, get) => ({
  userId: null,
  xp: 0,
  level: 1,
  streak: 0,
  isLoading: false,
  powerUps: [
    {
      id: 'study-buddy',
      name: 'Study Buddy',
      description: 'Get a study partner for 30 minutes - reduces mission duration by 25%',
      effect: 'duration-reduction',
      cooldown: 12,
      lastUsed: null,
      active: false,
    },
    {
      id: 'xp-boost',
      name: 'XP Boost',
      description: 'Double XP for next 3 missions',
      effect: 'xp-boost',
      cooldown: 12,
      lastUsed: null,
      active: false,
    },
    {
      id: 'time-freeze',
      name: 'Time Freeze',
      description: 'Extend deadline by 24 hours',
      effect: 'deadline-extension',
      cooldown: 48,
      lastUsed: null,
      active: false,
    },
  ],
  achievements: [
    {
      id: 'first-mission',
      name: 'First Steps',
      description: 'Complete your first mission',
      icon: '🎯',
      unlocked: false,
    },
    {
      id: 'streak-7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      unlocked: false,
    },
    {
      id: 'level-10',
      name: 'Scholar',
      description: 'Reach level 10',
      icon: '🎓',
      unlocked: false,
    },
    {
      id: 'xp-1000',
      name: 'Knowledge Seeker',
      description: 'Earn 1000 XP',
      icon: '⭐',
      unlocked: false,
    },
  ],
  missions: [],
  exams: [],
  timetable: [],
  setUserId: async (userId: string | null) => {
    const currentUserId = get().userId;
    console.log('=== SET USER ID ===');
    console.log('Current user ID:', currentUserId);
    console.log('New user ID:', userId);
    
    if (currentUserId !== userId) {
      console.log('🔄 Switching user from', currentUserId, 'to', userId);
      
      // Save current user data before switching
      if (currentUserId) {
        console.log('💾 Saving data for previous user:', currentUserId);
        await get().saveUserData();
        console.log('✅ Saved data for previous user:', currentUserId);
      }
      
      // Reset state for new user
      console.log('🔄 Resetting state for new user');
      set({ 
        userId,
        xp: 0,
        level: 1,
        streak: 0,
        missions: [],
        isLoading: true
      });
      
      // Load new user data if provided
      if (userId) {
        console.log('📥 Loading data for new user:', userId);
        await get().loadUserData(userId);
      }
      
      set({ isLoading: false });
      console.log('✅ User ID set successfully');
    } else {
      console.log('⚠️ Same user ID, no change needed');
    }
  },
  setXP: (xp) => {
    set({ xp });
    get().saveUserData();
  },
  addXP: (amount) => {
    const { xp, level } = get();
    const newXP = xp + amount;
    const newLevel = Math.floor(newXP / 100) + 1;
    console.log('⭐ Adding XP:', amount, 'New XP:', newXP, 'New Level:', newLevel);
    set({ xp: newXP, level: newLevel });
    console.log('💾 Saving data after adding XP...');
    get().saveUserData();
  },
  setLevel: (level) => {
    set({ level });
    get().saveUserData();
  },
  setStreak: (streak) => {
    set({ streak });
    get().saveUserData();
  },
  activatePowerUp: (powerUpId) => {
    const { powerUps } = get();
    const updatedPowerUps = powerUps.map(powerUp =>
      powerUp.id === powerUpId
        ? { ...powerUp, active: true, lastUsed: new Date().toISOString() }
        : powerUp
    );
    set({ powerUps: updatedPowerUps });
    get().saveUserData();
  },
  unlockAchievement: (achievementId) => {
    const { achievements } = get();
    const updatedAchievements = achievements.map(achievement =>
      achievement.id === achievementId
        ? { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
        : achievement
    );
    set({ achievements: updatedAchievements });
    get().saveUserData();
  },
  addMission: (mission) => {
    const { missions } = get();
    const calculateXP = (duration: number, priority: 'low' | 'medium' | 'high') => {
      const baseXP = duration * 2; // 2 XP per minute
      const priorityMultiplier = {
        'low': 0.8,
        'medium': 1.0,
        'high': 1.5
      };
      return Math.round(baseXP * priorityMultiplier[priority]);
    };
    
    const newMission: Mission = {
      ...mission,
      id: Date.now().toString(),
      xpValue: calculateXP(mission.duration, mission.priority),
      createdAt: new Date().toISOString()
    };
    console.log('🎯 Adding mission:', newMission);
    set({ missions: [...missions, newMission] });
    console.log('💾 Saving data after adding mission...');
    get().saveUserData();
  },
  completeMission: (missionId) => {
    const { missions, addXP, unlockAchievement } = get();
    const updatedMissions = missions.map(mission => {
      if (mission.id === missionId && !mission.completed) {
        console.log('🎯 Completing mission:', mission.title, 'XP:', mission.xpValue);
        addXP(mission.xpValue);
        // Check for first mission achievement
        const completedMissions = missions.filter(m => m.completed).length;
        if (completedMissions === 0) {
          unlockAchievement('first-mission');
        }
        return { ...mission, completed: true, completedAt: new Date().toISOString() };
      }
      return mission;
    });
    set({ missions: updatedMissions });
    console.log('💾 Saving data after completing mission...');
    get().saveUserData();
  },
  deleteMission: (missionId) => {
    const { missions } = get();
    set({ missions: missions.filter(mission => mission.id !== missionId) });
    get().saveUserData();
  },
  startTimer: (missionId) => {
    const { missions } = get();
    const updatedMissions = missions.map(mission => {
      if (mission.id === missionId && !mission.completed) {
        return { 
          ...mission, 
          timerActive: true, 
          timerStartTime: new Date().toISOString(),
          timeRemaining: mission.timeRemaining || mission.duration // Use existing time or full duration
        };
      }
      return mission;
    });
    set({ missions: updatedMissions });
    get().saveUserData();
  },
  stopTimer: (missionId) => {
    const { missions } = get();
    const updatedMissions = missions.map(mission => {
      if (mission.id === missionId && mission.timerActive) {
        // Calculate remaining time when stopping
        const startTime = new Date(mission.timerStartTime!);
        const currentTime = new Date();
        const elapsedSeconds = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000);
        const remainingSeconds = Math.max(0, (mission.timeRemaining || mission.duration) * 60 - elapsedSeconds);
        const remainingMinutes = Math.floor(remainingSeconds / 60);
        
        return { 
          ...mission, 
          timerActive: false,
          timeRemaining: remainingMinutes
        };
      }
      return mission;
    });
    set({ missions: updatedMissions });
    get().saveUserData();
  },
  checkDeadlines: () => {
    const { missions, addXP } = get();
    const now = new Date();
    let hasOverdueMissions = false;
    
    const updatedMissions = missions.map(mission => {
      if (!mission.completed && !mission.overdue) {
        const deadline = new Date(mission.deadline);
        if (now > deadline) {
          hasOverdueMissions = true;
          // Penalty: remove 10% of mission XP
          const penalty = Math.round(mission.xpValue * 0.1);
          addXP(-penalty);
          
          // Show notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Mission Overdue!', {
              body: `${mission.title} is overdue! You lost ${penalty} XP.`,
              icon: '/favicon.ico'
            });
          }
          
          return { ...mission, overdue: true };
        }
      }
      return mission;
    });
    
    if (hasOverdueMissions) {
      set({ missions: updatedMissions });
      get().saveUserData();
    }
  },
  addExam: (exam) => {
    const { exams, userId } = get();
    const newExam: Exam = {
      ...exam,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    console.log('📚 Adding exam:', newExam);
    const updatedExams = [...exams, newExam];
    set({ exams: updatedExams });
    
    // Save to Firebase immediately
    if (userId) {
      saveExamsToFirebase(userId, updatedExams);
    }
    get().saveUserData();
  },
  deleteExam: (examId) => {
    const { exams, userId } = get();
    const updatedExams = exams.filter(exam => exam.id !== examId);
    set({ exams: updatedExams });
    
    // Save to Firebase immediately
    if (userId) {
      saveExamsToFirebase(userId, updatedExams);
    }
    get().saveUserData();
  },
  saveTimetableSessions: async (sessions) => {
    console.log('📅 Saving timetable sessions to store:', sessions);
    set({ timetable: sessions });
    console.log('💾 Calling saveUserData for timetable...');
    await saveTimetableToFirebase(get().userId!, sessions);
    console.log('✅ Timetable sessions saved to Firebase');
  },
  loadUserData: async (userId) => {
    try {
      console.log('=== LOAD USER DATA ===');
      console.log('User ID:', userId);
      set({ isLoading: true });
      
      const userProfile = await getUserProfile(userId);
      if (userProfile) {
        console.log('✅ User profile found:', userProfile);
        console.log('Profile data:', {
          xp: userProfile.xp,
          level: userProfile.level,
          missions: userProfile.missions?.length || 0,
          achievements: userProfile.achievements?.length || 0
        });
        console.log('Full user profile data:', {
          xp: userProfile.xp,
          level: userProfile.level,
          streak: userProfile.streak,
          missions: userProfile.missions,
          achievements: userProfile.achievements,
          powerUps: userProfile.powerUps
        });
        
        const loadedData = {
          userId,
          xp: userProfile.xp !== undefined ? userProfile.xp : 0,
          level: userProfile.level !== undefined ? userProfile.level : 1,
          streak: userProfile.streak !== undefined ? userProfile.streak : 0,
          powerUps: userProfile.powerUps || get().powerUps,
          achievements: userProfile.achievements || get().achievements,
          missions: userProfile.missions || [],
          exams: userProfile.exams || [],
          timetable: userProfile.timetable || [],
          isLoading: false
        };
        
        console.log('About to set game store with data:', loadedData);
        set(loadedData);
        console.log('✅ User data loaded successfully for:', userId);
      } else {
        console.log('❌ No user profile found, initializing new user');
        // Initialize new user with default data
        set({
          userId,
          xp: 0,
          level: 1,
          streak: 0,
          missions: [],
          isLoading: false
        });
        console.log('✅ New user initialized');
      }
    } catch (error: any) {
      console.error('❌ Error loading user data:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      set({ isLoading: false });
    }
  },
  saveUserData: async () => {
    const { userId, xp, level, streak, powerUps, achievements, missions, exams, timetable } = get();
    if (userId) {
      try {
        console.log('=== SAVE USER DATA ===');
        console.log('User ID:', userId);
        console.log('Data to save:', { 
          xp, 
          level, 
          streak, 
          missionsCount: missions.length,
          achievementsCount: achievements.length,
          powerUpsCount: powerUps.length
        });
        console.log('Full missions array:', missions);
        console.log('Full achievements array:', achievements);
        console.log('Full powerUps array:', powerUps);
        
        const dataToSave = {
          xp,
          level,
          streak,
          powerUps,
          achievements,
          missions,
          exams,
          timetable
        };
        
        console.log('About to save this data:', dataToSave);
        await updateUserProfile(userId, dataToSave);
        console.log('✅ User data saved successfully for:', userId);
      } catch (error: any) {
        console.error('❌ Error saving user data:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          stack: error.stack
        });
      }
    } else {
      console.log('⚠️ No user ID, skipping save');
    }
  },
  resetUserData: () => {
    set({
      userId: null,
      xp: 0,
      level: 1,
      streak: 0,
      missions: [],
      isLoading: false
    });
  },
})); 