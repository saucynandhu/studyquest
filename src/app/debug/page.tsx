'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGameStore } from '@/store/gameStore';
import { getUserProfile, getAllUsers, testFirebaseConnection, testFirestoreWrite, saveTimetableSessions, saveExams } from '@/lib/firebase-utils';
import { User, Database, RefreshCw, Trash2, TestTube } from 'lucide-react';

export default function DebugPage() {
  const { user, userProfile } = useAuth();
  const { userId, xp, level, missions, loadUserData } = useGameStore();
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectionTest, setConnectionTest] = useState<boolean | null>(null);

  const loadAllUsers = async () => {
    setLoading(true);
    try {
      const users = await getAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.error('Error loading all users:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAllUsers();
  }, []);



  const handleLoadData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await loadUserData(userId);
      alert('Data loaded successfully!');
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading data');
    }
    setLoading(false);
  };

  const handleRefreshUsers = () => {
    loadAllUsers();
  };

  const handleTestConnection = async () => {
    if (!user?.uid) {
      alert('Please sign in first');
      return;
    }
    
    setLoading(true);
    try {
      const result = await testFirebaseConnection(user.uid);
      setConnectionTest(result);
      if (result) {
        alert('Firebase connection test passed!');
      } else {
        alert('Firebase connection test failed. Check console for details.');
      }
    } catch (error) {
      console.error('Connection test error:', error);
      setConnectionTest(false);
      alert('Connection test failed. Check console for details.');
    }
    setLoading(false);
  };

  const handleTestDataFlow = async () => {
    if (!userId) {
      alert('Please sign in first');
      return;
    }
    
    setLoading(true);
    try {
      console.log('🧪 Testing data flow...');
      
      // Add a test mission
      const { addMission } = useGameStore.getState();
      addMission({
        title: 'Test Mission',
        subject: 'Debug',
        duration: 30,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        completed: false
      });
      
      // Wait a bit for save to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      

      
      // Reload data
      await loadUserData(userId);
      
      alert('Data flow test completed! Check console for details.');
    } catch (error) {
      console.error('Data flow test error:', error);
      alert('Data flow test failed. Check console for details.');
    }
    setLoading(false);
  };

  const handleTestFirestoreWrite = async () => {
    if (!user?.uid) {
      alert('Please sign in first');
      return;
    }
    
    setLoading(true);
    try {
      const result = await testFirestoreWrite(user.uid);
      if (result) {
        alert('Firestore write test passed!');
      } else {
        alert('Firestore write test failed. Check console for details.');
      }
    } catch (error) {
      console.error('Firestore write test error:', error);
      alert('Firestore write test failed. Check console for details.');
    }
    setLoading(false);
  };

  const handleTestTimetableSave = async () => {
    if (!user?.uid) {
      alert('Please sign in first');
      return;
    }
    
    setLoading(true);
    try {
      const testSessions = [
        {
          id: 'test-1',
          title: 'Test Session',
          subject: 'Math',
          startTime: '09:00',
          endTime: '10:00',
          day: 'Monday',
          userId: user.uid
        }
      ];
      
      await saveTimetableSessions(user.uid, testSessions);
      alert('Timetable save test completed! Check console for details.');
    } catch (error) {
      console.error('Timetable save test error:', error);
      alert('Timetable save test failed. Check console for details.');
    }
    setLoading(false);
  };

  const handleTestExamSave = async () => {
    if (!user?.uid) {
      alert('Please sign in first');
      return;
    }
    
    setLoading(true);
    try {
      const testExams = [
        {
          id: 'test-exam-1',
          title: 'Test Exam',
          subject: 'Science',
          examDate: '2024-12-25',
          examTime: '14:00',
          location: 'Room 101',
          notes: 'Test exam notes',
          createdAt: new Date().toISOString()
        }
      ];
      
      await saveExams(user.uid, testExams);
      alert('Exam save test completed! Check console for details.');
    } catch (error) {
      console.error('Exam save test error:', error);
      alert('Exam save test failed. Check console for details.');
    }
    setLoading(false);
  };

  const handleForceReload = async () => {
    if (!userId) {
      alert('Please sign in first');
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔄 Force reloading user data...');
      await loadUserData(userId);
      alert('Force reload completed! Check console for details.');
    } catch (error) {
      console.error('Force reload error:', error);
      alert('Force reload failed. Check console for details.');
    }
    setLoading(false);
  };

  const handleShowCurrentState = () => {
    const currentState = useGameStore.getState();
    console.log('=== CURRENT GAME STORE STATE ===');
    console.log('User ID:', currentState.userId);
    console.log('XP:', currentState.xp);
    console.log('Level:', currentState.level);
    console.log('Streak:', currentState.streak);
    console.log('Missions count:', currentState.missions.length);
    console.log('Achievements count:', currentState.achievements.length);
    console.log('PowerUps count:', currentState.powerUps.length);
    console.log('Full missions:', currentState.missions);
    console.log('Full achievements:', currentState.achievements);
    alert('Current state logged to console!');
  };

  const handleCheckFirebaseData = async () => {
    if (!user?.uid) {
      alert('Please sign in first');
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔍 Checking raw Firebase data...');
      const userProfile = await getUserProfile(user.uid);
      if (userProfile) {
        console.log('=== RAW FIREBASE DATA ===');
        console.log('User profile from Firebase:', userProfile);
        console.log('Data breakdown:', {
          xp: userProfile.xp,
          level: userProfile.level,
          streak: userProfile.streak,
          missionsCount: userProfile.missions?.length || 0,
          achievementsCount: userProfile.achievements?.length || 0,
          powerUpsCount: userProfile.powerUps?.length || 0
        });
        console.log('Full missions from Firebase:', userProfile.missions);
        console.log('Full achievements from Firebase:', userProfile.achievements);
        alert('Firebase data check completed! Check console for details.');
      } else {
        console.log('❌ No user profile found in Firebase');
        alert('No user profile found in Firebase!');
      }
    } catch (error) {
      console.error('Firebase data check error:', error);
      alert('Firebase data check failed. Check console for details.');
    }
    setLoading(false);
  };

  const handleTestSave = async () => {
    if (!userId) {
      alert('Please sign in first');
      return;
    }
    
    setLoading(true);
    try {
      console.log('🧪 Testing save operation...');
      
      // Add a test mission
      const { addMission } = useGameStore.getState();
      addMission({
        title: 'Test Mission',
        subject: 'Debug',
        duration: 30,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        completed: false
      });
      
      // Wait a bit for save to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Test completed! Check console for details.');
    } catch (error) {
      console.error('Test save error:', error);
      alert('Test save failed. Check console for details.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h1 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Database className="w-6 h-6 text-purple-400" />
          Debug Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current User Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" />
              Current User
            </h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Firebase UID:</span>
                <span className="text-white font-mono">{user?.uid || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Store User ID:</span>
                <span className="text-white font-mono">{userId || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Email:</span>
                <span className="text-white">{user?.email || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Display Name:</span>
                <span className="text-white">{userProfile?.displayName || user?.displayName || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">XP:</span>
                <span className="text-white">{xp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Level:</span>
                <span className="text-white">{level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Missions:</span>
                <span className="text-white">{missions.length}</span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleLoadData}
                disabled={loading || !userId}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Load Data
              </button>
              <button
                onClick={handleTestConnection}
                disabled={loading || !user?.uid}
                className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm"
              >
                <TestTube className="w-4 h-4" />
                Test Firebase
              </button>
              <button
                onClick={handleTestFirestoreWrite}
                disabled={loading || !user?.uid}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm"
              >
                <TestTube className="w-4 h-4" />
                Test Firestore Write
              </button>
              <button
                onClick={handleTestDataFlow}
                disabled={loading || !userId}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm"
              >
                <TestTube className="w-4 h-4" />
                Test Data Flow
              </button>
              <button
                onClick={handleForceReload}
                disabled={loading || !userId}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Force Reload
              </button>
              <button
                onClick={handleShowCurrentState}
                disabled={loading || !userId}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm"
              >
                <TestTube className="w-4 h-4" />
                Show Current State
              </button>
              <button
                onClick={handleCheckFirebaseData}
                disabled={loading || !user?.uid}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm"
              >
                <TestTube className="w-4 h-4" />
                Check Firebase Data
              </button>
              <button
                onClick={handleTestTimetableSave}
                disabled={loading || !user?.uid}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm"
              >
                <TestTube className="w-4 h-4" />
                Test Timetable Save
              </button>
              <button
                onClick={handleTestExamSave}
                disabled={loading || !user?.uid}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm"
              >
                <TestTube className="w-4 h-4" />
                Test Exam Save
              </button>

            </div>

            {connectionTest !== null && (
              <div className={`p-2 rounded text-sm ${connectionTest ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                {connectionTest ? '✅ Firebase connection working' : '❌ Firebase connection failed'}
              </div>
            )}
          </div>

          {/* All Users */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">All Users in Database</h2>
              <button
                onClick={handleRefreshUsers}
                disabled={loading}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
            
            <div className="max-h-64 overflow-y-auto space-y-2">
              {allUsers.map((userData) => (
                <div
                  key={userData.uid}
                  className={`p-3 rounded border ${
                    userData.uid === userId 
                      ? 'border-purple-400 bg-purple-500/20' 
                      : 'border-white/20 bg-white/5'
                  }`}
                >
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Username:</span>
                      <span className="text-white font-medium">{userData.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Email:</span>
                      <span className="text-white">{userData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">XP:</span>
                      <span className="text-white">{userData.xp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Level:</span>
                      <span className="text-white">{userData.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Missions:</span>
                      <span className="text-white">{userData.missions?.length || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Debug Instructions:</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Sign in with different accounts to test user separation</li>
            <li>• Create missions and complete them to test data persistence</li>
            <li>• Use "Load Data" to manually reload from Firebase</li>
            <li>• Use "Test Firebase" to check connection and permissions</li>
            <li>• Check "All Users" to verify each user has separate data</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 