'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Filter, Search, Calendar, Clock, CheckCircle, X } from 'lucide-react';
import Layout from '@/components/Layout';
import AddMissionModal from '@/components/AddMissionModal';
import { useGameStore } from '@/store/gameStore';

interface Mission {
  id: string;
  title: string;
  subject: string;
  duration: number;
  deadline: string;
  xpValue: number;
  completed: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export default function MissionsPage() {
  const { missions, completeMission, deleteMission } = useGameStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const subjects = ['Math', 'Science', 'History', 'English', 'Literature', 'Other'];
  const filters = [
    { id: 'all', name: 'All Missions', icon: Target },
    { id: 'pending', name: 'Pending', icon: Clock },
    { id: 'completed', name: 'Completed', icon: CheckCircle },
    { id: 'overdue', name: 'Overdue', icon: X }
  ];

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

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'bg-green-500',
      'medium': 'bg-yellow-500',
      'high': 'bg-red-500'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-500';
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const filteredMissions = missions.filter(mission => {
    const matchesSearch = mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mission.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'pending' && !mission.completed && !isOverdue(mission.deadline)) ||
                         (selectedFilter === 'completed' && mission.completed) ||
                         (selectedFilter === 'overdue' && !mission.completed && isOverdue(mission.deadline));
    
    const matchesSubject = selectedSubject === 'all' || mission.subject === selectedSubject;
    
    return matchesSearch && matchesFilter && matchesSubject;
  });

  const handleComplete = (missionId: string) => {
    completeMission(missionId);
  };

  const handleDelete = (missionId: string) => {
    deleteMission(missionId);
  };

  const stats = {
    total: missions.length,
    completed: missions.filter(m => m.completed).length,
    pending: missions.filter(m => !m.completed && !isOverdue(m.deadline)).length,
    overdue: missions.filter(m => !m.completed && isOverdue(m.deadline)).length
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
            <Target className="w-8 h-8 text-purple-400" />
            Missions
          </h1>
          <p className="text-gray-300">Manage your study tasks and track progress</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: stats.total, color: 'text-blue-400' },
            { label: 'Completed', value: stats.completed, color: 'text-green-400' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
            { label: 'Overdue', value: stats.overdue, color: 'text-red-400' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center"
            >
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-300 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search missions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
            </div>

                         {/* Filters */}
             <div className="flex gap-2">
               <div className="relative">
                 <select
                   value={selectedFilter}
                   onChange={(e) => setSelectedFilter(e.target.value)}
                   className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 appearance-none cursor-pointer backdrop-blur-sm pr-8"
                 >
                   {filters.map(filter => (
                     <option key={filter.id} value={filter.id} className="bg-gray-800 text-white">{filter.name}</option>
                   ))}
                 </select>
                 <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                   <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                 </div>
               </div>

               <div className="relative">
                 <select
                   value={selectedSubject}
                   onChange={(e) => setSelectedSubject(e.target.value)}
                   className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 appearance-none cursor-pointer backdrop-blur-sm pr-8"
                 >
                   <option value="all" className="bg-gray-800 text-white">All Subjects</option>
                   {subjects.map(subject => (
                     <option key={subject} value={subject} className="bg-gray-800 text-white">{subject}</option>
                   ))}
                 </select>
                 <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                   <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                 </div>
               </div>
             </div>

            {/* Add Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Mission
            </button>
          </div>
        </div>

        {/* Missions List */}
        <div className="space-y-4">
          {filteredMissions.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No missions found</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create Your First Mission
              </button>
            </div>
          ) : (
            filteredMissions.map((mission, index) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 border transition-all duration-300 ${
                  mission.completed 
                    ? 'border-green-400/50' 
                    : isOverdue(mission.deadline)
                      ? 'border-red-400/50'
                      : 'border-white/20 hover:border-purple-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getSubjectColor(mission.subject)}`}>
                        {mission.subject}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getPriorityColor(mission.priority)}`}>
                        {mission.priority}
                      </span>
                      {isOverdue(mission.deadline) && !mission.completed && (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-red-500">
                          Overdue
                        </span>
                      )}
                    </div>
                    
                    <h3 className={`font-semibold mb-2 ${mission.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                      {mission.title}
                    </h3>
                    
                                         <div className="flex items-center gap-4 text-sm text-gray-300">
                       <div className="flex items-center gap-1">
                         <Clock className="w-4 h-4" />
                         <span>{mission.duration} min</span>
                       </div>
                       <div className="flex items-center gap-1">
                         <Calendar className="w-4 h-4" />
                         <span>
                           {mission.completed 
                             ? `Completed: ${mission.completedAt ? new Date(mission.completedAt).toLocaleDateString() : 'Unknown'}`
                             : `Due: ${new Date(mission.deadline).toLocaleDateString()}`
                           }
                         </span>
                       </div>
                       <div className="flex items-center gap-1">
                         <Target className="w-4 h-4" />
                         <span>{mission.xpValue} XP</span>
                       </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!mission.completed ? (
                      <button
                        onClick={() => handleComplete(mission.id)}
                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-110"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    ) : (
                      <div className="text-green-400">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    )}
                    <button
                      onClick={() => handleDelete(mission.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <AddMissionModal open={showAddModal} onClose={() => setShowAddModal(false)} />
      </div>
    </Layout>
  );
} 