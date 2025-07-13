'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Target, Calendar, Zap, Star, TrendingUp, User, Loader2 } from 'lucide-react';
import MissionCard from './MissionCard';
import XPBar from './XPBar';
import PowerUpsMenu from './PowerUpsMenu';
import AddMissionModal from './AddMissionModal';
import TodaySchedule from './TodaySchedule';
import NextExamWidget from './NextExamWidget';

export default function Dashboard() {
  const { xp, level, streak, powerUps, missions, userId, isLoading, checkDeadlines } = useGameStore();
  const { user, userProfile } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  // Request notification permission and set up deadline checker
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Check deadlines every minute
    const interval = setInterval(() => {
      checkDeadlines();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkDeadlines]);

  const stats = [
    { icon: Trophy, label: 'Level', value: level, color: 'text-yellow-400' },
    { icon: Target, label: 'XP', value: xp, color: 'text-green-400' },
    { icon: Zap, label: 'Streak', value: streak, color: 'text-orange-400' },
    { icon: Star, label: 'Active Power-ups', value: powerUps.filter(p => p.active).length, color: 'text-purple-400' },
  ];



  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading your quest data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
          Welcome back, {userProfile?.username || user?.displayName || 'Scholar'}!
        </h1>
        <p className="text-gray-300 text-sm sm:text-base">Ready to conquer today's missions?</p>
        

      </motion.div>

      {/* XP Bar */}
      <XPBar />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20 hover:border-purple-400 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
              <span className={`text-lg sm:text-xl lg:text-2xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Today's Missions */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            Today's Quests
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
          >
            + New Mission
          </button>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          {missions.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-sm sm:text-base">No missions yet. Create your first quest!</p>
            </div>
          ) : (
            missions.map((mission, index) => (
              <MissionCard key={mission.id} mission={mission} index={index} />
            ))
          )}
        </div>
      </div>

      {/* Today's Schedule */}
      <TodaySchedule />

      {/* Next Exam Widget */}
      <NextExamWidget />

      {/* Power-ups */}
      <PowerUpsMenu />

      <AddMissionModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
} 