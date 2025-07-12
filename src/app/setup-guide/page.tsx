'use client';

import { useState } from 'react';
import { testFirebaseConnection } from '@/lib/firebase';
import { toast } from 'react-hot-toast';

export default function SetupGuidePage() {
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    try {
      const result = await testFirebaseConnection();
      if (result) {
        toast.success('Firebase connection successful!');
      } else {
        toast.error('Firebase connection failed');
      }
    } catch (error) {
      toast.error('Test failed');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-6">Firebase Setup Guide</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Step 1 */}
            <div className="bg-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Step 1: Create Firebase Project</h2>
              <ol className="text-gray-300 space-y-2 text-sm">
                <li>1. Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Firebase Console</a></li>
                <li>2. Click "Create a project"</li>
                <li>3. Name it "studyquest" or "studyquest-3c886"</li>
                <li>4. Enable Google Analytics (optional)</li>
                <li>5. Click "Create project"</li>
              </ol>
            </div>

            {/* Step 2 */}
            <div className="bg-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Step 2: Add Web App</h2>
              <ol className="text-gray-300 space-y-2 text-sm">
                <li>1. In your project, click the web icon (&lt;/&gt;)</li>
                <li>2. Register app with nickname "StudyQuest"</li>
                <li>3. Copy the config object</li>
                <li>4. Replace the config in src/lib/firebase.ts</li>
              </ol>
            </div>

            {/* Step 3 */}
            <div className="bg-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Step 3: Enable Authentication</h2>
              <ol className="text-gray-300 space-y-2 text-sm">
                <li>1. Go to Authentication → Sign-in method</li>
                <li>2. Enable "Email/Password"</li>
                <li>3. Enable "Google" provider</li>
                <li>4. Add your support email</li>
                <li>5. Save changes</li>
              </ol>
            </div>

            {/* Step 4 */}
            <div className="bg-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Step 4: Add Authorized Domains</h2>
              <ol className="text-gray-300 space-y-2 text-sm">
                <li>1. Go to Authentication → Settings</li>
                <li>2. Scroll to "Authorized domains"</li>
                <li>3. Add: localhost</li>
                <li>4. Add your production domain when you deploy</li>
              </ol>
            </div>

            {/* Step 5 */}
            <div className="bg-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Step 5: Enable Firestore</h2>
              <ol className="text-gray-300 space-y-2 text-sm">
                <li>1. Go to Firestore Database</li>
                <li>2. Click "Create database"</li>
                <li>3. Choose "Start in test mode"</li>
                <li>4. Select a location (us-central1 recommended)</li>
                <li>5. Click "Done"</li>
              </ol>
            </div>

            {/* Test Connection */}
            <div className="bg-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Test Connection</h2>
              <button
                onClick={testConnection}
                disabled={testing}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
              >
                {testing ? 'Testing...' : 'Test Firebase Connection'}
              </button>
              <p className="text-gray-400 text-xs mt-2">Click to test if Firebase is properly configured</p>
            </div>
          </div>

          {/* Current Config */}
          <div className="mt-8 bg-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Current Configuration</h2>
            <div className="bg-black/20 rounded-lg p-4">
              <pre className="text-green-400 text-xs overflow-x-auto">
{`const firebaseConfig = {
  apiKey: "AIzaSyDtMQdvCR7AuMU9F3_ukSTz5st3SStZ4Iw",
  authDomain: "studyquest-3c886.firebaseapp.com",
  projectId: "studyquest-3c886",
  storageBucket: "studyquest-3c886.firebasestorage.app",
  messagingSenderId: "1005703393025",
  appId: "1:1005703393025:web:07bbe3913cabba546f3500"
};`}
              </pre>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              If this project doesn't exist, create a new one and replace this configuration.
            </p>
          </div>

          {/* Troubleshooting */}
          <div className="mt-8 bg-yellow-500/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-300 mb-4">Troubleshooting</h2>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• <strong>auth/configuration-not-found:</strong> Enable Authentication in Firebase Console</li>
              <li>• <strong>app/no-app:</strong> Check if project exists and config is correct</li>
              <li>• <strong>auth/unauthorized-domain:</strong> Add localhost to authorized domains</li>
              <li>• <strong>auth/operation-not-allowed:</strong> Enable Google provider in Authentication</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 