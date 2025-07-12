'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, Zap, Users, BookOpen, Award, Lock } from 'lucide-react';
import Layout from '@/components/Layout';
import { useGameStore } from '@/store/gameStore';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export default function AchievementsPage() {
  const { achievements } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const allAchievements: Achievement[] = [
    {
      id: 'first-mission',
      name: 'First Steps',
      description: 'Complete your first mission',
      icon: '🎯',
      category: 'missions',
      unlocked: achievements.find(a => a.id === 'first-mission')?.unlocked || false,
      unlockedAt: achievements.find(a => a.id === 'first-mission')?.unlockedAt
    },
    {
      id: 'streak-7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      category: 'streaks',
      unlocked: achievements.find(a => a.id === 'streak-7')?.unlocked || false,
      unlockedAt: achievements.find(a => a.id === 'streak-7')?.unlockedAt
    },
    {
      id: 'level-10',
      name: 'Scholar',
      description: 'Reach level 10',
      icon: '🎓',
      category: 'levels',
      unlocked: achievements.find(a => a.id === 'level-10')?.unlocked || false,
      unlockedAt: achievements.find(a => a.id === 'level-10')?.unlockedAt
    },
    {
      id: 'xp-1000',
      name: 'Knowledge Seeker',
      description: 'Earn 1000 XP',
      icon: '⭐',
      category: 'xp',
      unlocked: achievements.find(a => a.id === 'xp-1000')?.unlocked || false,
      unlockedAt: achievements.find(a => a.id === 'xp-1000')?.unlockedAt
    },
    {
      id: 'missions-10',
      name: 'Mission Master',
      description: 'Complete 10 missions',
      icon: '📋',
      category: 'missions',
      unlocked: false,
      progress: 2,
      maxProgress: 10
    },
    {
      id: 'powerups-5',
      name: 'Power Player',
      description: 'Use 5 power-ups',
      icon: '⚡',
      category: 'powerups',
      unlocked: false,
      progress: 1,
      maxProgress: 5
    },
    {
      id: 'subjects-5',
      name: 'Subject Explorer',
      description: 'Study 5 different subjects',
      icon: '📚',
      category: 'subjects',
      unlocked: false,
      progress: 2,
      maxProgress: 5
    },
    {
      id: 'perfect-week',
      name: 'Perfect Week',
      description: 'Complete all daily missions for 7 days',
      icon: '🌟',
      category: 'streaks',
      unlocked: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: Trophy },
    { id: 'missions', name: 'Missions', icon: Target },
    { id: 'streaks', name: 'Streaks', icon: Zap },
    { id: 'levels', name: 'Levels', icon: Star },
    { id: 'xp', name: 'XP', icon: Award },
    { id: 'powerups', name: 'Power-ups', icon: Users },
    { id: 'subjects', name: 'Subjects', icon: BookOpen }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? allAchievements 
    : allAchievements.filter(a => a.category === selectedCategory);

  const unlockedCount = allAchievements.filter(a => a.unlocked).length;
  const totalCount = allAchievements.length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Achievements
          </h1>
          <p className="text-gray-300">Unlock badges and track your progress</p>
        </motion.div>

        {/* Progress Overview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Progress</h2>
            <span className="text-purple-400 font-semibold">{unlockedCount}/{totalCount}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-gray-300 text-sm mt-2">
            {Math.round((unlockedCount / totalCount) * 100)}% Complete
          </p>
        </div>

        {/* Category Filter */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/10 backdrop-blur-sm rounded-lg p-6 border transition-all duration-300 ${
                achievement.unlocked
                  ? 'border-yellow-400/50 achievement-unlock'
                  : 'border-white/20 hover:border-gray-400'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </div>
                <h3 className={`font-bold text-lg mb-2 ${
                  achievement.unlocked ? 'text-white' : 'text-gray-400'
                }`}>
                  {achievement.name}
                </h3>
                <p className={`text-sm mb-4 ${
                  achievement.unlocked ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {achievement.description}
                </p>
                
                {achievement.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(achievement.progress / achievement.maxProgress!) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {achievement.unlocked && achievement.unlockedAt && (
                  <p className="text-xs text-yellow-400">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Achievement Stats</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.slice(1).map((category) => {
              const categoryAchievements = allAchievements.filter(a => a.category === category.id);
              const unlockedInCategory = categoryAchievements.filter(a => a.unlocked).length;
              const totalInCategory = categoryAchievements.length;
              
              return (
                <div key={category.id} className="text-center">
                  <category.icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">{category.name}</p>
                  <p className="text-gray-400 text-sm">{unlockedInCategory}/{totalInCategory}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
} 