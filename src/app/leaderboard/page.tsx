'use client';

import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import Layout from '@/components/Layout';
import Leaderboard from '@/components/Leaderboard';

export default function LeaderboardPage() {
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
            Leaderboard
          </h1>
          <p className="text-gray-300">Compete with other students and track your progress</p>
        </motion.div>

        {/* Real Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
        >
          <Leaderboard />
        </motion.div>
      </div>
    </Layout>
  );
} 