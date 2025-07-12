'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Clock, RefreshCw, Info, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { useGameStore } from '@/store/gameStore';

interface PowerUp {
  id: string;
  name: string;
  description: string;
  effect: string;
  cooldown: number;
  lastUsed: string | null;
  active: boolean;
  icon: any;
  color: string;
}

export default function PowerUpsPage() {
  const { powerUps, activatePowerUp } = useGameStore();
  const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUp | null>(null);

  const enhancedPowerUps: PowerUp[] = [
    {
      id: 'focus-shield',
      name: 'Focus Shield',
      description: 'Blocks all notifications and distractions for 25 minutes, creating a distraction-free study environment.',
      effect: 'Pomodoro-style focus session with notification blocking',
      cooldown: 24,
      lastUsed: powerUps.find(p => p.id === 'focus-shield')?.lastUsed || null,
      active: powerUps.find(p => p.id === 'focus-shield')?.active || false,
      icon: Shield,
      color: 'bg-blue-500'
    },
    {
      id: 'xp-boost',
      name: 'XP Boost',
      description: 'Doubles XP earned from the next 3 missions, accelerating your level progression.',
      effect: '2x XP for next 3 missions',
      cooldown: 12,
      lastUsed: powerUps.find(p => p.id === 'xp-boost')?.lastUsed || null,
      active: powerUps.find(p => p.id === 'xp-boost')?.active || false,
      icon: Zap,
      color: 'bg-yellow-500'
    },
    {
      id: 'time-freeze',
      name: 'Time Freeze',
      description: 'Extends the deadline of any mission by 24 hours, giving you extra time to complete tasks.',
      effect: 'Extend mission deadline by 24 hours',
      cooldown: 48,
      lastUsed: powerUps.find(p => p.id === 'time-freeze')?.lastUsed || null,
      active: powerUps.find(p => p.id === 'time-freeze')?.active || false,
      icon: Clock,
      color: 'bg-purple-500'
    },
    {
      id: 'mission-reset',
      name: 'Mission Reset',
      description: 'Resets a failed mission, allowing you to try again without losing progress.',
      effect: 'Reset failed mission for retry',
      cooldown: 72,
      lastUsed: powerUps.find(p => p.id === 'mission-reset')?.lastUsed || null,
      active: powerUps.find(p => p.id === 'mission-reset')?.active || false,
      icon: RefreshCw,
      color: 'bg-green-500'
    }
  ];

  const handleActivate = (powerUpId: string) => {
    activatePowerUp(powerUpId);
    
    // Play activation sound
    const audio = new Audio('/sounds/powerup.mp3');
    audio.play().catch(() => {});
  };

  const canUse = (powerUp: PowerUp) => {
    if (powerUp.active) return false;
    if (!powerUp.lastUsed) return true;
    
    const timeSinceLastUse = new Date().getTime() - new Date(powerUp.lastUsed).getTime();
    const cooldownMs = powerUp.cooldown * 60 * 60 * 1000; // Convert hours to milliseconds
    return timeSinceLastUse > cooldownMs;
  };

  const getTimeRemaining = (powerUp: PowerUp) => {
    if (!powerUp.lastUsed) return 0;
    
    const timeSinceLastUse = new Date().getTime() - new Date(powerUp.lastUsed).getTime();
    const cooldownMs = powerUp.cooldown * 60 * 60 * 1000;
    const remaining = cooldownMs - timeSinceLastUse;
    
    return Math.max(0, remaining);
  };

  const formatTimeRemaining = (ms: number) => {
    if (ms === 0) return 'Ready';
    
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

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
            <Zap className="w-8 h-8 text-yellow-400" />
            Power-ups
          </h1>
          <p className="text-gray-300">Enhance your study sessions with special abilities</p>
        </motion.div>

        {/* Power-ups Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {enhancedPowerUps.map((powerUp, index) => {
            const isActive = powerUp.active;
            const canUsePowerUp = canUse(powerUp);
            const timeRemaining = getTimeRemaining(powerUp);

            return (
              <motion.div
                key={powerUp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/10 backdrop-blur-sm rounded-lg p-6 border transition-all duration-300 ${
                  isActive 
                    ? 'border-green-400/50 power-up-active' 
                    : canUsePowerUp
                      ? 'border-white/20 hover:border-purple-400'
                      : 'border-gray-500/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${powerUp.color} text-white`}>
                    <powerUp.icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white text-lg">{powerUp.name}</h3>
                      {isActive && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-3">{powerUp.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Info className="w-3 h-3" />
                        <span>{powerUp.effect}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>Cooldown: {powerUp.cooldown}h</span>
                      </div>
                      
                      {!canUsePowerUp && !isActive && (
                        <div className="text-xs text-orange-400">
                          Ready in: {formatTimeRemaining(timeRemaining)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    onClick={() => handleActivate(powerUp.id)}
                    disabled={!canUsePowerUp}
                    className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : canUsePowerUp
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isActive ? 'Active' : canUsePowerUp ? 'Activate' : 'Cooldown'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Power-up Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Power-up Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {enhancedPowerUps.filter(p => p.active).length}
              </div>
              <p className="text-gray-300 text-sm">Active Power-ups</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {enhancedPowerUps.filter(p => p.lastUsed).length}
              </div>
              <p className="text-gray-300 text-sm">Times Used</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {enhancedPowerUps.length}
              </div>
              <p className="text-gray-300 text-sm">Total Power-ups</p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Power-up Tips</h3>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p>Use Focus Shield during important study sessions to eliminate distractions.</p>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p>Save XP Boost for high-value missions to maximize your gains.</p>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p>Time Freeze is perfect for urgent deadlines that need extension.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 