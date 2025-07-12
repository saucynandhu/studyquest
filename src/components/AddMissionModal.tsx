'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

interface AddMissionModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddMissionModal({ open, onClose }: AddMissionModalProps) {
  const { addMission } = useGameStore();
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    duration: 30,
    deadline: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const subjects = ['Math', 'Science', 'History', 'English', 'Literature', 'Other'];

  const calculateXP = (duration: number, priority: 'low' | 'medium' | 'high') => {
    const baseXP = duration * 2; // 2 XP per minute
    const priorityMultiplier = {
      'low': 0.8,
      'medium': 1.0,
      'high': 1.5
    };
    return Math.round(baseXP * priorityMultiplier[priority]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const xpValue = calculateXP(formData.duration, formData.priority);
    addMission({
      title: formData.title,
      subject: formData.subject,
      duration: formData.duration,
      deadline: formData.deadline,
      priority: formData.priority,
      completed: false
    });
    onClose();
    setFormData({
      title: '',
      subject: '',
      duration: 30,
      deadline: '',
      priority: 'medium'
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 w-full max-w-md border border-white/20 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                New Mission
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-white text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  Mission Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 text-sm"
                  placeholder="Enter mission title"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  Subject
                </label>
                <div className="relative">
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 text-sm appearance-none cursor-pointer backdrop-blur-sm"
                    required
                  >
                    <option value="" className="bg-gray-800 text-white">Select subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject} className="bg-gray-800 text-white">{subject}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  Duration (min)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 text-sm"
                  min="5"
                  max="480"
                  required
                />
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Estimated XP:</span>
                  <span className="text-purple-400 font-semibold">
                    {calculateXP(formData.duration, formData.priority)} XP
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Based on duration ({formData.duration} min) and priority ({formData.priority})
                </div>
              </div>

              <div>
                <label className="block text-white text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  Priority
                </label>
                <div className="relative">
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 text-sm appearance-none cursor-pointer backdrop-blur-sm"
                    required
                  >
                    <option value="low" className="bg-gray-800 text-white">Low</option>
                    <option value="medium" className="bg-gray-800 text-white">Medium</option>
                    <option value="high" className="bg-gray-800 text-white">High</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 px-3 sm:px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 sm:px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                >
                  Create Mission
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 