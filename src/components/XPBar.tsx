'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export default function XPBar() {
  const { xp, level } = useGameStore();
  const xpForNextLevel = level * 100;
  const xpProgress = (xp % 100) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <span className="text-white font-semibold text-sm sm:text-base">Level {level}</span>
        <span className="text-gray-300 text-xs sm:text-sm">{xp} / {xpForNextLevel} XP</span>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${xpProgress * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      
      {xpProgress > 0.9 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-2"
        >
          <span className="text-yellow-400 text-xs sm:text-sm font-semibold">
            ⚡ Almost there! Keep going!
          </span>
        </motion.div>
      )}
    </motion.div>
  );
} 