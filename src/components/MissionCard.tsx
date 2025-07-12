'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, Target, Play, Pause, AlertTriangle } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { Mission } from '@/types';
import { useState, useEffect } from 'react';

interface MissionCardProps {
  mission: Mission;
  index: number;
}

export default function MissionCard({ mission, index }: MissionCardProps) {
  const { completeMission, startTimer, stopTimer } = useGameStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for active timers
  useEffect(() => {
    if (mission.timerActive) {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
        
        // Auto-stop timer when it reaches zero
        const remaining = getTimeRemaining();
        if (remaining <= 0) {
          stopTimer(mission.id);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mission.timerActive, mission.id, stopTimer]);

  const handleComplete = () => {
    if (mission.timerActive) {
      stopTimer(mission.id);
    }
    completeMission(mission.id);
    
    // Play completion sound
    const audio = new Audio('/sounds/complete.mp3');
    audio.play().catch(() => {}); // Ignore if audio fails
  };

  const handleTimerToggle = () => {
    if (mission.timerActive) {
      stopTimer(mission.id);
    } else {
      startTimer(mission.id);
    }
  };

  const getTimeRemaining = () => {
    if (!mission.timerActive || !mission.timerStartTime) {
      // When paused, return minutes
      return (mission.timeRemaining || mission.duration) * 60;
    }
    
    const startTime = new Date(mission.timerStartTime);
    const elapsedSeconds = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000);
    const totalRemainingSeconds = Math.max(0, (mission.timeRemaining || mission.duration) * 60 - elapsedSeconds);
    return totalRemainingSeconds;
  };

  const formatTime = (totalSeconds: number, isActive: boolean = false) => {
    if (!isActive) {
      // When paused, show minutes only
      const minutes = Math.floor(totalSeconds / 60);
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      
      if (hours > 0) {
        return `${hours}h ${mins}m`;
      } else {
        return `${mins}m`;
      }
    }
    
    // When active, show HH:MM:SS
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${seconds}s`;
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Math': 'bg-blue-500',
      'Science': 'bg-green-500',
      'History': 'bg-yellow-500',
      'English': 'bg-purple-500',
      'Literature': 'bg-pink-500',
      'default': 'bg-gray-500'
    };
    return colors[subject as keyof typeof colors] || colors.default;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="quest-card rounded-lg p-3 sm:p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getSubjectColor(mission.subject)}`}>
              {mission.subject}
            </span>
            <span className="text-gray-400 text-xs sm:text-sm">
              {mission.duration} min
            </span>
          </div>
          
          <h3 className="text-white font-semibold mb-2 text-sm sm:text-base break-words">{mission.title}</h3>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">
                {mission.completed 
                  ? `Completed: ${mission.completedAt ? new Date(mission.completedAt).toLocaleDateString() : 'Unknown'}`
                  : `Due: ${new Date(mission.deadline).toLocaleDateString()}`
                }
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>{mission.xpValue} XP</span>
            </div>
            {!mission.completed && (
              <div className="flex items-center gap-1">
                <span className={`text-xs ${getTimeRemaining() <= 0 ? 'text-red-400 font-bold' : ''}`}>
                  {getTimeRemaining() <= 0 ? 'Time\'s up!' : `${formatTime(getTimeRemaining(), mission.timerActive)} remaining`}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {!mission.completed ? (
          <div className="flex items-center gap-2">
            {mission.overdue && (
              <div className="text-red-400 flex-shrink-0" title="Mission Overdue">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            )}
            <button
              onClick={handleTimerToggle}
              className={`p-1.5 sm:p-2 rounded-lg transition-all duration-300 transform hover:scale-110 flex-shrink-0 ${
                mission.timerActive 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              title={mission.timerActive ? 'Stop Timer' : 'Start Timer'}
            >
              {mission.timerActive ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
            <button
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white p-1.5 sm:p-2 rounded-lg transition-all duration-300 transform hover:scale-110 flex-shrink-0"
            >
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        ) : (
          <div className="text-green-400 flex-shrink-0">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>
    </motion.div>
  );
} 