'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Calendar, Trophy, Target, Users, LogOut, Settings, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Timetable', href: '/timetable', icon: Calendar },
  { name: 'Exams', href: '/exams', icon: BookOpen },
  { name: 'Missions', href: '/missions', icon: Target },
  { name: 'Achievements', href: '/achievements', icon: Trophy },
  { name: 'Leaderboard', href: '/leaderboard', icon: Users },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-xl border-r border-white/20 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SQ</span>
                  </div>
                  <h1 className="text-xl font-bold text-white">StudyQuest</h1>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="flex flex-col justify-center items-center w-8 h-8 text-white hover:text-gray-300 transition-colors"
                >
                  <div className="w-5 h-0.5 bg-current mb-1 rounded-full rotate-45 transition-all duration-300"></div>
                  <div className="w-5 h-0.5 bg-current -mt-1 rounded-full -rotate-45 transition-all duration-300"></div>
                </button>
              </div>
              
              {/* Navigation */}
              <nav className="px-6 py-6 flex-1">
                <div className="space-y-2">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-white/20 text-white shadow-lg'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>
                          <item.icon size={20} />
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>
              
              {/* Footer */}
              <div className="px-6 pb-6 border-t border-white/20 pt-4">
                <button
                  onClick={signOut}
                  className="flex items-center space-x-4 px-4 py-4 rounded-xl w-full text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all duration-200"
                >
                  <div className="p-2 rounded-lg bg-red-400/10">
                    <LogOut size={20} />
                  </div>
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <AnimatePresence>
        {desktopSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:block hidden"
          >
            <div className="fixed inset-0 bg-black/50" onClick={() => setDesktopSidebarOpen(false)} />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-xl border-r border-white/20 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SQ</span>
                  </div>
                  <h1 className="text-xl font-bold text-white">StudyQuest</h1>
                </div>
                <button
                  onClick={() => setDesktopSidebarOpen(false)}
                  className="flex flex-col justify-center items-center w-8 h-8 text-white hover:text-gray-300 transition-colors"
                >
                  <div className="w-5 h-0.5 bg-current mb-1 rounded-full rotate-45 transition-all duration-300"></div>
                  <div className="w-5 h-0.5 bg-current -mt-1 rounded-full -rotate-45 transition-all duration-300"></div>
                </button>
              </div>
              
              {/* Navigation */}
              <nav className="px-6 py-6 flex-1">
                <div className="space-y-2">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setDesktopSidebarOpen(false)}
                        className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-white/20 text-white shadow-lg'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>
                          <item.icon size={20} />
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>
              
              {/* Footer */}
              <div className="px-6 pb-6 border-t border-white/20 pt-4">
                <button
                  onClick={signOut}
                  className="flex items-center space-x-4 px-4 py-4 rounded-xl w-full text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all duration-200"
                >
                  <div className="p-2 rounded-lg bg-red-400/10">
                    <LogOut size={20} />
                  </div>
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="lg:pl-0">
        {/* Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/10 bg-white/10 backdrop-blur-xl px-4 sm:gap-x-6 sm:px-6">
          <button
            type="button"
            className="flex flex-col justify-center items-center w-8 h-8 text-white hover:text-gray-300 transition-colors"
            onClick={() => {
              if (window.innerWidth >= 1024) {
                setDesktopSidebarOpen(true);
              } else {
                setSidebarOpen(true);
              }
            }}
          >
            <div className="w-6 h-0.5 bg-current mb-1.5 rounded-full transition-all duration-300"></div>
            <div className="w-6 h-0.5 bg-current mb-1.5 rounded-full transition-all duration-300"></div>
            <div className="w-6 h-0.5 bg-current rounded-full transition-all duration-300"></div>
          </button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            {user && (
              <div className="flex items-center gap-2">
                <button
                  onClick={signOut}
                  className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400/10 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 