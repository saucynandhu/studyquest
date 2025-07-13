'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Clock, Flame } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

export default function PowerUpsMenu() {
  const { powerUps, activatePowerUp } = useGameStore();
  const [selectedPowerUp, setSelectedPowerUp] = useState(null);

  const handleActivate = (powerUpId: string) => {
    activatePowerUp(powerUpId);
    
    // Play activation sound
    const audio = new Audio('/sounds/powerup.mp3');
    audio.play().catch(() => {});
  };

  const getPowerUpIcon = (name: string) => {
    switch (name) {
      case 'Streak Revival':
        return <Flame className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'XP Boost':
        return <Zap className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Time Freeze':
        return <Clock className="w-5 h-5 sm:w-6 sm:h-6" />;
      default:
        return <Zap className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/20">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
        Power-ups
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {powerUps.map((powerUp) => {
          const isUsed = powerUp.used;
          const isOneTimeUse = powerUp.oneTimeUse;

          return (
            <motion.div
              key={powerUp.id}
              whileHover={{ scale: 1.02 }}
              className={`p-3 sm:p-4 rounded-lg border transition-all duration-300 ${
                isUsed 
                  ? 'bg-gray-500/20 border-gray-400 opacity-50' 
                  : 'bg-white/10 border-white/20 hover:border-purple-400'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                {getPowerUpIcon(powerUp.name)}
                <h3 className="font-semibold text-white text-sm sm:text-base">{powerUp.name}</h3>
                {isOneTimeUse && (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-red-500">
                    One-time
                  </span>
                )}
              </div>
              
              <p className="text-gray-300 text-xs sm:text-sm mb-3">{powerUp.description}</p>
              
              <button
                onClick={() => handleActivate(powerUp.id)}
                disabled={isUsed}
                className={`w-full py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  isUsed
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {isUsed ? 'Used' : 'Activate'}
              </button>
            </motion.div>
          );
        })}
      </div>
      
      {powerUps.length === 0 && (
        <div className="text-center py-8">
          <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No power-ups available. Complete missions to earn more!</p>
        </div>
      )}
    </div>
  );
} 