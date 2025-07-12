'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, BookOpen, Plus, X } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

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

export default function ExamCountdown() {
  const { exams, addExam, deleteExam } = useGameStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeUntilExam = (examDate: string, examTime: string) => {
    const examDateTime = new Date(`${examDate}T${examTime}`);
    const now = currentTime;
    const diff = examDateTime.getTime() - now.getTime();
    
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isOverdue: true };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds, isOverdue: false };
  };

  const formatCountdown = (time: { days: number; hours: number; minutes: number; seconds: number; isOverdue: boolean }) => {
    if (time.isOverdue) {
      return 'Exam time!';
    }
    
    if (time.days > 0) {
      return `${time.days}d ${time.hours}h ${time.minutes}m`;
    } else if (time.hours > 0) {
      return `${time.hours}h ${time.minutes}m`;
    } else if (time.minutes > 0) {
      return `${time.minutes}m ${time.seconds}s`;
    } else {
      return `${time.seconds}s`;
    }
  };

  const sortedExams = [...exams].sort((a, b) => {
    const aTime = new Date(`${a.examDate}T${a.examTime}`).getTime();
    const bTime = new Date(`${b.examDate}T${b.examTime}`).getTime();
    return aTime - bTime;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Exam Countdown
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {sortedExams.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No exams scheduled. Add your first exam!</p>
          </div>
        ) : (
          sortedExams.map((exam, index) => {
            const countdown = getTimeUntilExam(exam.examDate, exam.examTime);
            const examDateTime = new Date(`${exam.examDate}T${exam.examTime}`);
            
            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 border ${
                  countdown.isOverdue 
                    ? 'border-red-400 bg-red-500/10' 
                    : countdown.days === 0 && countdown.hours < 24
                    ? 'border-orange-400 bg-orange-500/10'
                    : 'border-white/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-purple-500">
                        {exam.subject}
                      </span>
                      {countdown.isOverdue && (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-red-500">
                          OVERDUE
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-white font-semibold mb-2">{exam.title}</h3>
                    
                    <div className="space-y-1 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{examDateTime.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{examDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {exam.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{exam.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      countdown.isOverdue ? 'text-red-400' : 
                      countdown.days === 0 && countdown.hours < 24 ? 'text-orange-400' : 'text-green-400'
                    }`}>
                      {formatCountdown(countdown)}
                    </div>
                    <button
                      onClick={() => deleteExam(exam.id)}
                      className="text-red-400 hover:text-red-300 mt-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {exam.notes && (
                  <div className="mt-3 p-2 bg-white/5 rounded text-sm text-gray-300">
                    {exam.notes}
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add Exam Modal */}
      {showAddModal && (
        <AddExamModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

function AddExamModal({ onClose }: { onClose: () => void }) {
  const { addExam } = useGameStore();
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    examDate: '',
    examTime: '',
    location: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExam(formData);
    setFormData({ title: '', subject: '', examDate: '', examTime: '', location: '', notes: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-xl rounded-lg p-6 w-full max-w-md border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Add New Exam</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Exam Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              placeholder="e.g., Final Mathematics Exam"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              placeholder="e.g., Mathematics"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.examDate}
                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
              <input
                type="time"
                required
                value={formData.examTime}
                onChange={(e) => setFormData({ ...formData, examTime: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Location (Optional)</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              placeholder="e.g., Room 101"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              placeholder="Any additional notes..."
              rows={3}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
            >
              Add Exam
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 