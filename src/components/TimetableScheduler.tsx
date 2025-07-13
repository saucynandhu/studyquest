'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { useAuth } from '@/contexts/AuthContext';

interface TimetableSession {
  id: string;
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  day: string;
  userId: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

export default function TimetableScheduler() {
  const { timetable, saveTimetableSessions } = useGameStore();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<TimetableSession[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSession, setEditingSession] = useState<TimetableSession | null>(null);

  useEffect(() => {
    setSessions(timetable || []);
  }, [timetable]);

  const handleSave = async (updatedSessions: TimetableSession[]) => {
    console.log('💾 Saving timetable sessions:', updatedSessions);
    try {
      await saveTimetableSessions(updatedSessions);
      console.log('✅ Timetable sessions saved successfully');
    } catch (error) {
      console.error('❌ Error saving timetable sessions:', error);
    }
  };

  const addSession = (session: Omit<TimetableSession, 'id' | 'userId'>) => {
    const newSession: TimetableSession = {
      ...session,
      id: Date.now().toString(),
      userId: user?.uid || 'unknown-user'
    };
    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    handleSave(updatedSessions);
  };

  const updateSession = (session: TimetableSession) => {
    const updatedSessions = sessions.map(s => s.id === session.id ? session : s);
    setSessions(updatedSessions);
    handleSave(updatedSessions);
  };

  const deleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    handleSave(updatedSessions);
  };

  const getSessionsForDayAndTime = (day: string, timeSlot: string) => {
    return sessions.filter(session => {
      const sessionStart = session.startTime;
      const sessionEnd = session.endTime;
      const slotStart = timeSlot;
      const slotEnd = getNextTimeSlot(timeSlot);
      
      return session.day === day && 
             sessionStart < slotEnd && 
             sessionEnd > slotStart;
    });
  };

  const getNextTimeSlot = (timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const nextHour = (hours + 1) % 24;
    return `${nextHour.toString().padStart(2, '0')}:00`;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          Today's Schedule
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="w-16 h-8"></div>
            {DAYS.map(day => (
              <div key={day} className="text-center text-sm font-semibold text-white p-2">
                {day.slice(0, 3)}
              </div>
            ))}
          </div>

          {/* Time slots */}
          {TIME_SLOTS.slice(6, 22).map(timeSlot => (
            <div key={timeSlot} className="grid grid-cols-8 gap-2 mb-1">
              <div className="w-16 h-8 text-xs text-gray-400 flex items-center justify-end pr-2">
                {formatTime(timeSlot)}
              </div>
              {DAYS.map(day => {
                const daySessions = getSessionsForDayAndTime(day, timeSlot);
                return (
                  <div key={day} className="h-8 border border-white/10 rounded relative">
                    {daySessions.map(session => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`absolute inset-1 rounded text-xs text-white p-1 cursor-pointer group ${getSubjectColor(session.subject)}`}
                        onClick={() => setEditingSession(session)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{session.title}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSession(session.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-200 hover:text-red-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Session List */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">All Sessions</h3>
        <div className="space-y-2">
          {sessions.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No sessions scheduled. Add your first session!</p>
          ) : (
            sessions.map(session => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getSubjectColor(session.subject)}`}></div>
                  <div>
                    <div className="text-white font-medium">{session.title}</div>
                    <div className="text-sm text-gray-400">
                      {session.day} • {formatTime(session.startTime)} - {formatTime(session.endTime)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingSession(session)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteSession(session.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Session Modal */}
      {(showAddModal || editingSession) && (
        <SessionModal
          session={editingSession}
          onClose={() => {
            setShowAddModal(false);
            setEditingSession(null);
          }}
          onSave={(sessionData) => {
            if (editingSession) {
              updateSession({ ...editingSession, ...sessionData });
            } else {
              addSession(sessionData);
            }
            setShowAddModal(false);
            setEditingSession(null);
          }}
        />
      )}
    </div>
  );
}

function SessionModal({ 
  session, 
  onClose, 
  onSave 
}: { 
  session: TimetableSession | null;
  onClose: () => void;
  onSave: (data: Omit<TimetableSession, 'id' | 'userId'>) => void;
}) {
  const [formData, setFormData] = useState({
    title: session?.title || '',
    subject: session?.subject || '',
    day: session?.day || 'Monday',
    startTime: session?.startTime || '09:00',
    endTime: session?.endTime || '10:00'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-xl rounded-lg p-6 w-full max-w-md border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">
          {session ? 'Edit Session' : 'Add New Session'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Session Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              placeholder="e.g., Mathematics Lecture"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
            <div className="relative">
              <select
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 appearance-none cursor-pointer"
              >
                <option value="" className="bg-gray-800 text-white">Select Subject</option>
                <option value="Math" className="bg-gray-800 text-white">Mathematics</option>
                <option value="Science" className="bg-gray-800 text-white">Science</option>
                <option value="History" className="bg-gray-800 text-white">History</option>
                <option value="English" className="bg-gray-800 text-white">English</option>
                <option value="Literature" className="bg-gray-800 text-white">Literature</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Day</label>
            <div className="relative">
              <select
                required
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 appearance-none cursor-pointer"
              >
                {DAYS.map(day => (
                  <option key={day} value={day} className="bg-gray-800 text-white">{day}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">End Time</label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
            >
              {session ? 'Update Session' : 'Add Session'}
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