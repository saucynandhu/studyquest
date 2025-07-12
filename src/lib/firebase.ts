import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtMQdvCR7AuMU9F3_ukSTz5st3SStZ4Iw",
  authDomain: "studyquest-3c886.firebaseapp.com",
  projectId: "studyquest-3c886",
  storageBucket: "studyquest-3c886.firebasestorage.app",
  messagingSenderId: "1005703393025",
  appId: "1:1005703393025:web:07bbe3913cabba546f3500"
};

// Initialize Firebase only on client side
let app: any;
let auth: any;
let db: any;

if (typeof window !== 'undefined') {
  try {
    console.log('Initializing Firebase...');
    console.log('Config:', firebaseConfig);
    
    // Validate config
    if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
      throw new Error('Invalid Firebase configuration - missing required fields');
    }
    
    // Check if Firebase is already initialized
    if (!app) {
      app = initializeApp(firebaseConfig);
      console.log('Firebase app initialized');
    }
    
    // Initialize auth and firestore
    auth = getAuth(app);
    db = getFirestore(app);
    
    console.log('Firebase initialized successfully');
    console.log('Auth config:', auth.config);
    
    // Test if auth is working
    if (auth.config) {
      console.log('Auth domain:', auth.config.authDomain);
      console.log('API key exists:', !!auth.config.apiKey);
    }
    
  } catch (error: any) {
    console.error('Firebase initialization error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Show helpful error message
    if (error.code === 'app/no-app') {
      console.error('Firebase app not found. Please check your project configuration.');
    } else if (error.code === 'auth/configuration-not-found') {
      console.error('Firebase auth configuration not found. Please enable Authentication in Firebase Console.');
    }
  }
}

// Test function to verify Firebase setup
export const testFirebaseConnection = async () => {
  if (!auth) {
    console.error('Firebase auth not initialized');
    return false;
  }
  
  try {
    console.log('Testing Firebase connection...');
    console.log('Auth config:', auth.config);
    
    // Check if auth config is valid
    if (!auth.config || !auth.config.apiKey) {
      console.error('Invalid auth config');
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};

export { auth, db };
export default app; 