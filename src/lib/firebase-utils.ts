import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection,
  query,
  where,
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { User } from 'firebase/auth';
import { PowerUp, Achievement } from '@/types';

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  displayName: string;
  xp: number;
  level: number;
  streak: number;
  achievements: Achievement[];
  powerUps: PowerUp[];
  missions: any[];
  exams: any[];
  timetable: any[];
  createdAt: string;
  lastLoginDate: string;
  isOnboarded: boolean;
}

export interface TimetableSession {
  id: string;
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  day: string;
  userId: string;
}

// Create or update user profile
export const createUserProfile = async (user: User, username: string) => {
  try {
    console.log('=== CREATE USER PROFILE ===');
    console.log('⚠️ WARNING: Creating new user profile - this will overwrite existing data!');
    console.log('User:', user.email, 'UID:', user.uid);
    console.log('Firestore db:', !!db);
    
    if (!db) {
      console.error('❌ Firestore not initialized');
      return null;
    }
    
    console.log('✅ Firestore is initialized');
    const userRef = doc(db, 'users', user.uid);
    console.log('User document reference created');
    
    // Check if profile already exists
    const existingProfile = await getDoc(userRef);
    if (existingProfile.exists()) {
      console.log('⚠️ WARNING: Profile already exists! Not creating new profile.');
      console.log('Existing profile data:', existingProfile.data());
      return existingProfile.data() as UserProfile;
    }
    
    console.log('✅ No existing profile found, proceeding with creation...');
    
    // Default achievements
    const defaultAchievements: Achievement[] = [
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
    ];

    // Default powerUps
    const defaultPowerUps: PowerUp[] = [
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
    ];
    
    const userProfile: UserProfile = {
      uid: user.uid,
      username,
      email: user.email || '',
      displayName: user.displayName || username,
      xp: 0,
      level: 1,
      streak: 0,
      achievements: defaultAchievements,
      powerUps: defaultPowerUps,
      missions: [],
      exams: [],
      timetable: [],
      createdAt: new Date().toISOString(),
      lastLoginDate: new Date().toISOString(),
      isOnboarded: false
    };

    console.log('About to save user profile:', userProfile);
    await setDoc(userRef, userProfile);
    console.log('✅ User profile created successfully for:', user.email);
    return userProfile;
  } catch (error: any) {
    console.error('❌ Error creating user profile:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return null;
  }
};

// Get user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    console.log('=== GET USER PROFILE ===');
    console.log('UID:', uid);
    console.log('Firestore db:', !!db);
    
    if (!db) {
      console.error('❌ Firestore not initialized');
      return null;
    }
    
    console.log('✅ Firestore is initialized');
    const userRef = doc(db, 'users', uid);
    console.log('User document reference created');
    
    const userSnap = await getDoc(userRef);
    console.log('Document snapshot retrieved');

    if (userSnap.exists()) {
      const data = userSnap.data() as UserProfile;
      console.log('✅ User profile found for:', data.email);
      console.log('Profile data:', {
        xp: data.xp,
        level: data.level,
        missions: data.missions?.length || 0,
        achievements: data.achievements?.length || 0
      });
      return data;
    } else {
      console.log('❌ No user profile found for UID:', uid);
      return null;
    }
  } catch (error: any) {
    console.error('❌ Error getting user profile:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
  try {
    console.log('=== UPDATE USER PROFILE ===');
    console.log('UID:', uid);
    console.log('Updates:', updates);
    console.log('Firestore db:', !!db);
    
    if (!db) {
      console.error('❌ Firestore not initialized');
      return;
    }
    
    console.log('✅ Firestore is initialized');
    const userRef = doc(db, 'users', uid);
    console.log('User document reference created');
    
    const updateData = {
      ...updates,
      lastLoginDate: new Date().toISOString()
    };
    
    console.log('About to update with data:', updateData);
    console.log('Data being sent to Firebase:', JSON.stringify(updateData, null, 2));
    
    // Check if document exists before updating
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      console.log('✅ Document exists, proceeding with update');
    } else {
      console.log('❌ Document does not exist, cannot update');
      return;
    }
    
    await updateDoc(userRef, updateData);
    console.log('✅ User profile updated successfully for UID:', uid);
    
    // Verify the update by reading back the data
    console.log('Verifying update by reading back data...');
    const verifySnap = await getDoc(userRef);
    if (verifySnap.exists()) {
      const verifyData = verifySnap.data();
      console.log('✅ Verification successful - data in Firebase:', {
        xp: verifyData.xp,
        level: verifyData.level,
        missionsCount: verifyData.missions?.length || 0,
        achievementsCount: verifyData.achievements?.length || 0
      });
      console.log('Full verified data:', verifyData);
    } else {
      console.log('❌ Verification failed - document not found');
    }
  } catch (error: any) {
    console.error('❌ Error updating user profile:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
  }
};

// Check if username is available
export const isUsernameAvailable = async (username: string): Promise<boolean> => {
  try {
    if (!db) {
      console.error('Firestore not initialized');
      return true;
    }
    
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  } catch (error) {
    console.error('Error checking username availability:', error);
    return true;
  }
};

// Save timetable sessions
export const saveTimetableSessions = async (uid: string, sessions: TimetableSession[]) => {
  try {
    if (!db) {
      console.error('Firestore not initialized');
      return;
    }
    
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      timetable: sessions,
      lastLoginDate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving timetable sessions:', error);
  }
};

// Get timetable sessions
export const getTimetableSessions = async (uid: string): Promise<TimetableSession[]> => {
  try {
    const userProfile = await getUserProfile(uid);
    return userProfile?.timetable || [];
  } catch (error) {
    console.error('Error getting timetable sessions:', error);
    return [];
  }
};

// Verify user data separation
export const verifyUserDataSeparation = async (uid: string): Promise<boolean> => {
  try {
    const userProfile = await getUserProfile(uid);
    if (!userProfile) {
      console.log('No user profile found for verification');
      return false;
    }
    
    console.log('User data verification for:', userProfile.email);
    console.log('- UID:', userProfile.uid);
    console.log('- XP:', userProfile.xp);
    console.log('- Level:', userProfile.level);
    console.log('- Missions count:', userProfile.missions.length);
    console.log('- Achievements count:', userProfile.achievements.length);
    
    return true;
  } catch (error) {
    console.error('Error verifying user data:', error);
    return false;
  }
};

// Get all users for debugging
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    console.log('=== GET ALL USERS ===');
    console.log('Firestore db:', !!db);
    
    if (!db) {
      console.error('❌ Firestore not initialized');
      return [];
    }
    
    console.log('✅ Firestore is initialized');
    const usersRef = collection(db, 'users');
    console.log('Users collection reference created');
    
    const querySnapshot = await getDocs(usersRef);
    console.log('Query snapshot retrieved, docs count:', querySnapshot.size);
    
    const users: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as UserProfile;
      users.push(data);
      console.log('User found:', data.email, 'XP:', data.xp, 'Missions:', data.missions?.length || 0);
    });
    
    console.log('✅ Retrieved', users.length, 'users');
    return users;
  } catch (error: any) {
    console.error('❌ Error getting all users:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return [];
  }
};

// Delete user profile (for testing)
export const deleteUserProfile = async (uid: string): Promise<boolean> => {
  try {
    if (!db) {
      console.error('Firestore not initialized');
      return false;
    }
    
    const userRef = doc(db, 'users', uid);
    await deleteDoc(userRef);
    console.log('User profile deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting user profile:', error);
    return false;
  }
}; 

// Test Firebase connection and permissions
export const testFirebaseConnection = async (uid: string): Promise<boolean> => {
  try {
    console.log('=== TEST FIREBASE CONNECTION ===');
    console.log('Testing with UID:', uid);
    console.log('Firestore db:', !!db);
    
    if (!db) {
      console.error('❌ Firestore not initialized');
      return false;
    }
    
    console.log('✅ Firestore is initialized');
    
    // Try to read from users collection
    const usersRef = collection(db, 'users');
    console.log('Users collection reference created');
    
    // Try to get a document (this will test read permissions)
    const testDoc = doc(db, 'users', uid);
    const testSnap = await getDoc(testDoc);
    console.log('✅ Read test successful');
    
    // Try to write a test document (this will test write permissions)
    const testWriteRef = doc(db, 'test', 'connection-test');
    await setDoc(testWriteRef, {
      test: true,
      timestamp: new Date().toISOString(),
      uid: uid
    });
    console.log('✅ Write test successful');
    
    // Clean up test document
    await deleteDoc(testWriteRef);
    console.log('✅ Cleanup successful');
    
    console.log('✅ Firebase connection test passed');
    return true;
  } catch (error: any) {
    console.error('❌ Firebase connection test failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return false;
  }
}; 

// Simple test to verify Firestore write permissions
export const testFirestoreWrite = async (uid: string): Promise<boolean> => {
  try {
    console.log('=== TEST FIRESTORE WRITE ===');
    console.log('Testing write with UID:', uid);
    console.log('Firestore db:', !!db);
    
    if (!db) {
      console.error('❌ Firestore not initialized');
      return false;
    }
    
    console.log('✅ Firestore is initialized');
    
    // Try to write a test document
    const testRef = doc(db, 'test', uid);
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      uid: uid,
      message: 'This is a test write'
    };
    
    console.log('Writing test data:', testData);
    await setDoc(testRef, testData);
    console.log('✅ Write test successful');
    
    // Try to read it back
    const testSnap = await getDoc(testRef);
    if (testSnap.exists()) {
      console.log('✅ Read test successful');
      console.log('Read data:', testSnap.data());
    } else {
      console.log('❌ Read test failed - document not found');
    }
    
    // Clean up
    await deleteDoc(testRef);
    console.log('✅ Cleanup successful');
    
    console.log('✅ Firestore write test passed');
    return true;
  } catch (error: any) {
    console.error('❌ Firestore write test failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Check for specific error types
    if (error.code === 'permission-denied') {
      console.error('❌ Permission denied - check Firebase security rules');
    } else if (error.code === 'unavailable') {
      console.error('❌ Firestore unavailable - check network connection');
    }
    
    return false;
  }
}; 