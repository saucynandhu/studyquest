'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import Layout from '@/components/Layout';
import TimetableScheduler from '@/components/TimetableScheduler';

export default function TimetablePage() {
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
            <Calendar className="w-8 h-8 text-purple-400" />
            Study Timetable
          </h1>
          <p className="text-gray-300">Plan your study sessions with a visual schedule</p>
        </motion.div>

        {/* Timetable Scheduler */}
        <TimetableScheduler />
      </div>
    </Layout>
  );
} 