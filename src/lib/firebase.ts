import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
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