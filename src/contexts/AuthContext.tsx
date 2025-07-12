'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile, createUserProfile, UserProfile } from '@/lib/firebase-utils';
import { useGameStore } from '@/store/gameStore';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { setUserId, resetUserData } = useGameStore();
  const authStateRef = useRef<boolean>(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    // Wait for Firebase to be initialized
    const checkAuth = async () => {
      if (!auth) {
        console.log('Firebase auth not initialized yet, retrying...');
        setTimeout(checkAuth, 500);
        return;
      }

      try {
        console.log('Setting up auth state listener...');
        const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
          console.log('=== AUTH STATE CHANGED ===');
          console.log('Previous auth state:', authStateRef.current);
          console.log('New user:', user ? `User logged in: ${user.uid}` : 'No user');
          
          // Prevent duplicate processing
          if (authStateRef.current && !user) {
            console.log('User already signed out, skipping...');
            return;
          }
          
          authStateRef.current = !!user;
          
          if (user) {
            try {
              console.log('=== AUTH CONTEXT: USER SIGNED IN ===');
              console.log('User:', user.email, 'UID:', user.uid);
              
              // Set user immediately to prevent UI flicker
              setUser(user);
              
              // Try to get existing profile
              console.log('🔍 Checking for existing profile for UID:', user.uid);
              let profile = await getUserProfile(user.uid);
              
              if (!profile) {
                console.log('❌ No existing profile found, creating new user profile...');
                // Create new user profile with username from email
                const username = user.email?.split('@')[0] || 'user';
                profile = await createUserProfile(user, username);
                console.log('✅ New user profile created:', profile);
              } else {
                console.log('✅ Existing user profile found:', profile);
                console.log('Profile data check:', {
                  xp: profile.xp,
                  level: profile.level,
                  missions: profile.missions?.length || 0,
                  achievements: profile.achievements?.length || 0,
                  streak: profile.streak
                });
                console.log('🔍 Profile object keys:', Object.keys(profile));
                console.log('🔍 Full profile data:', profile);
                // Don't create a new profile if one already exists!
              }
              
              setUserProfile(profile);
              
              // Set user ID and load game data
              console.log('Setting user ID and loading game data for:', user.uid);
              await setUserId(user.uid);
              console.log('User game data loaded successfully');
            } catch (error: any) {
              console.error('Error handling user sign in:', error);
              console.error('Error details:', {
                message: error.message,
                code: error.code,
                stack: error.stack
              });
              setUserProfile(null);
            }
          } else {
            // User signed out - reset all data
            console.log('User signed out, resetting data');
            setUser(null);
            setUserProfile(null);
            await setUserId(null);
          }
          
          setLoading(false);
        });

        return () => {
          console.log('Cleaning up auth listener');
          unsubscribe();
        };
      } catch (error) {
        console.error('Auth state change error:', error);
        setLoading(false);
      }
    };

    // Add a small delay to ensure Firebase is fully initialized
    setTimeout(checkAuth, 100);
  }, [setUserId]);

  const signOut = async () => {
    if (!auth) return;
    
    try {
      console.log('Signing out user...');
      await auth.signOut();
      setUser(null);
      setUserProfile(null);
      await setUserId(null);
      authStateRef.current = false;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 