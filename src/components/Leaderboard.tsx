'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Star } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile } from '@/lib/firebase-utils';

interface LeaderboardEntry {
  uid: string;
  username: string;
  displayName: string;
  xp: number;
  level: number;
  streak: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('xp', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        
        const entries: LeaderboardEntry[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as UserProfile;
          entries.push({
            uid: data.uid,
            username: data.username,
            displayName: data.displayName,
            xp: data.xp,
            level: data.level,
            streak: data.streak,
          });
        });
        
        setLeaderboard(entries);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 2:
        return 'bg-gradient-to-r from-amber-500 to-amber-700';
      default:
        return 'bg-white/10';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No users found. Be the first to join!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-lg border border-white/20 ${getRankColor(index)}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getRankIcon(index)}
                  <span className="text-lg font-bold text-white">#{index + 1}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{entry.displayName}</h3>
                  <p className="text-sm text-gray-300">@{entry.username}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">{entry.xp} XP</span>
                  <span className="text-sm text-gray-300">Level {entry.level}</span>
                </div>
                <p className="text-xs text-gray-400">
                  {entry.streak} day{entry.streak !== 1 ? 's' : ''} streak
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 