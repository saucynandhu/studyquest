'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

interface TimetableSession {
  id: string;
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  day: string;
  userId: string;
}

export default function TodaySchedule() {
  const { timetable } = useGameStore();
  const [todaySessions, setTodaySessions] = useState<TimetableSession[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      // Get today's day name
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const today = days[now.getDay()];
      
      // Filter sessions for today
      const todaySessions = (timetable || []).filter((session: TimetableSession) => 
        session.day === today
      );
      
      // Sort by start time
      todaySessions.sort((a, b) => a.startTime.localeCompare(b.startTime));
      setTodaySessions(todaySessions);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [timetable]);

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

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  const getSessionStatus = (session: TimetableSession) => {
    const now = currentTime;
    const sessionStart = new Date();
    const [startHours, startMinutes] = session.startTime.split(':').map(Number);
    sessionStart.setHours(startHours, startMinutes, 0, 0);
    
    const sessionEnd = new Date();
    const [endHours, endMinutes] = session.endTime.split(':').map(Number);
    sessionEnd.setHours(endHours, endMinutes, 0, 0);
    
    if (now < sessionStart) {
      const diff = sessionStart.getTime() - now.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      if (minutes < 60) {
        return { status: 'upcoming', text: `in ${minutes}m` };
      } else {
        const hours = Math.floor(minutes / 60);
        return { status: 'upcoming', text: `in ${hours}h ${minutes % 60}m` };
      }
    } else if (now >= sessionStart && now <= sessionEnd) {
      return { status: 'ongoing', text: 'Now' };
    } else {
      return { status: 'completed', text: 'Completed' };
    }
  };

  if (todaySessions.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Today's Schedule
          </h2>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No sessions scheduled for today</p>
          <p className="text-gray-500 text-sm mt-2">Add sessions in the Timetable page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          Today's Schedule
        </h2>
        <span className="text-sm text-gray-400">
          {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div className="space-y-3">
        {todaySessions.map((session, index) => {
          const status = getSessionStatus(session);
          
          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 border ${
                status.status === 'ongoing' 
                  ? 'border-green-400 bg-green-500/10' 
                  : status.status === 'upcoming'
                  ? 'border-blue-400 bg-blue-500/10'
                  : 'border-white/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getSubjectColor(session.subject)}`}>
                      {session.subject}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
                      status.status === 'ongoing' ? 'bg-green-500' :
                      status.status === 'upcoming' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`}>
                      {status.text}
                    </span>
                  </div>
                  
                  <h3 className="text-white font-semibold mb-2">{session.title}</h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
} 