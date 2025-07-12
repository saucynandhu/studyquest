'use client';

import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'react-hot-toast';

export default function TestAuthPage() {
  const [loading, setLoading] = useState(false);

  const testGoogleAuth = async () => {
    setLoading(true);
    try {
      console.log('Testing Google authentication...');
      console.log('Auth object:', auth);
      console.log('Auth config:', auth?.config);
      
      const provider = new GoogleAuthProvider();
      console.log('Provider created:', provider);
      
      const result = await signInWithPopup(auth, provider);
      console.log('Success:', result);
      toast.success('Google auth test successful!');
    } catch (error: any) {
      console.error('Test failed:', error);
      toast.error(`Test failed: ${error.code} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-white/20">
        <h1 className="text-2xl font-bold text-white mb-6">Firebase Auth Test</h1>
        
        <div className="space-y-4 text-white">
          <p>This page helps debug Google authentication issues.</p>
          
          <button
            onClick={testGoogleAuth}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Google Auth'}
          </button>
          
          <div className="mt-6 p-4 bg-white/10 rounded-lg">
            <h3 className="font-semibold mb-2">To fix Google auth issues:</h3>
            <ol className="text-sm space-y-2">
              <li>1. Go to Firebase Console</li>
              <li>2. Select your project</li>
              <li>3. Go to Authentication → Sign-in method</li>
              <li>4. Enable Google provider</li>
              <li>5. Add your domain to authorized domains</li>
              <li>6. Configure OAuth consent screen if needed</li>
            </ol>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-500/20 rounded-lg">
            <h3 className="font-semibold mb-2 text-yellow-300">Common Issues:</h3>
            <ul className="text-sm space-y-1">
              <li>• Google provider not enabled in Firebase</li>
              <li>• Domain not authorized</li>
              <li>• OAuth consent screen not configured</li>
              <li>• Popup blockers enabled</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 