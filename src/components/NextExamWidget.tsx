'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Calendar } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import Link from 'next/link';

interface Exam {
  id: string;
  title: string;
  subject: string;
  examDate: string;
  examTime: string;
  location?: string;
  notes?: string;
  createdAt: string;
}

export default function NextExamWidget() {
  const { exams } = useGameStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextExam, setNextExam] = useState<Exam | null>(null);
  const [timeUntil, setTimeUntil] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      // Find the next upcoming exam
      const upcomingExams = exams.filter(exam => {
        const examDateTime = new Date(`${exam.examDate}T${exam.examTime}`);
        return examDateTime > now;
      });
      
      if (upcomingExams.length > 0) {
        const next = upcomingExams.sort((a, b) => {
          const aTime = new Date(`${a.examDate}T${a.examTime}`).getTime();
          const bTime = new Date(`${b.examDate}T${b.examTime}`).getTime();
          return aTime - bTime;
        })[0];
        
        setNextExam(next);
        
        // Calculate time until exam
        const examDateTime = new Date(`${next.examDate}T${next.examTime}`);
        const diff = examDateTime.getTime() - now.getTime();
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          setTimeUntil({ days, hours, minutes, seconds });
        }
      } else {
        setNextExam(null);
        setTimeUntil(null);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [exams]);

  if (!nextExam) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            Next Exam
          </h2>
          <Link 
            href="/exams"
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            View All
          </Link>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No upcoming exams</p>
          <Link 
            href="/exams"
            className="mt-3 inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add Exam
          </Link>
        </div>
      </div>
    );
  }

  const examDateTime = new Date(`${nextExam.examDate}T${nextExam.examTime}`);
  const isToday = examDateTime.toDateString() === currentTime.toDateString();
  const isTomorrow = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000).toDateString() === examDateTime.toDateString();

  const formatCountdown = () => {
    if (!timeUntil) return '';
    
    if (timeUntil.days > 0) {
      return `${timeUntil.days}d ${timeUntil.hours}h ${timeUntil.minutes}m`;
    } else if (timeUntil.hours > 0) {
      return `${timeUntil.hours}h ${timeUntil.minutes}m`;
    } else if (timeUntil.minutes > 0) {
      return `${timeUntil.minutes}m ${timeUntil.seconds}s`;
    } else {
      return `${timeUntil.seconds}s`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Next Exam
        </h2>
        <Link 
          href="/exams"
          className="text-purple-400 hover:text-purple-300 text-sm"
        >
          View All
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 border ${
          isToday ? 'border-red-400 bg-red-500/10' :
          isTomorrow ? 'border-orange-400 bg-orange-500/10' :
          'border-white/20'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-purple-500">
                {nextExam.subject}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
                isToday ? 'bg-red-500' :
                isTomorrow ? 'bg-orange-500' :
                'bg-blue-500'
              }`}>
                {isToday ? 'TODAY' : isTomorrow ? 'TOMORROW' : 'UPCOMING'}
              </span>
            </div>
            
            <h3 className="text-white font-semibold mb-2">{nextExam.title}</h3>
            
            <div className="space-y-1 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{examDateTime.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{examDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              {nextExam.location && (
                <div className="flex items-center gap-2">
                  <span className="text-xs">📍 {nextExam.location}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-lg font-bold ${
              isToday ? 'text-red-400' : 
              isTomorrow ? 'text-orange-400' : 'text-green-400'
            }`}>
              {formatCountdown()}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 