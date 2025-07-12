'use client';

import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import Layout from '@/components/Layout';
import ExamCountdown from '@/components/ExamCountdown';

export default function ExamsPage() {
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
            <BookOpen className="w-8 h-8 text-purple-400" />
            Exam Countdown
          </h1>
          <p className="text-gray-300">Track your upcoming exams with real-time countdowns</p>
        </motion.div>

        {/* Exam Countdown Component */}
        <ExamCountdown />
      </div>
    </Layout>
  );
} 