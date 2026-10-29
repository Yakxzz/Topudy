import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckSquare, Clock } from 'lucide-react';
import { useAppStore } from '../store';
import { GamificationModal } from './Gamification/GamificationModal';
import { BoardCountdown } from './BoardCountdown';
import { AudioPlayer } from './Timer/AudioPlayer';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (t: string) => void;
  hideNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, hideNav = false }) => {
  const { theme, studentName, currentStreak } = useAppStore();
  const [isUIVisible, setIsUIVisible] = useState(true);
  const hideTimeoutRef = useRef<number | null>(null);
  const [showGamification, setShowGamification] = useState(false);

  useEffect(() => {
    document.body.className = theme === 'default' ? '' : `theme-${theme}`;
  }, [theme]);

  // Auto-hide UI logic (Zen Focus Mode)
  useEffect(() => {
    if (hideNav) return;

    const resetTimer = () => {
      setIsUIVisible(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = window.setTimeout(() => {
        setIsUIVisible(false);
      }, 4000); // 4 seconds of inactivity
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('touchstart', resetTimer);
    window.addEventListener('keydown', resetTimer);
    
    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [hideNav]);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Top Bar: CBSE Countdown on Left/Center, Profile on Right */}
      <AnimatePresence>
        {isUIVisible && !hideNav && (
          <motion.header
            className="absolute top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 z-40 flex items-center justify-between pointer-events-none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Left: Board Exam Countdown Widget */}
            <div className="pointer-events-auto">
              <BoardCountdown />
            </div>

            {/* Right: Student Profile Pill */}
            <div className="pointer-events-auto">
              <div 
                onClick={() => setShowGamification(true)}
                className="flex items-center gap-2.5 bg-[var(--bg-secondary)] rounded-full p-1.5 pr-3.5 border border-[var(--border)] shadow-sm cursor-pointer hover:scale-105 transition-transform"
                title="Student Profile & Honours"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white shrink-0 font-serif font-bold text-xs sm:text-sm shadow-sm">
                  {studentName.charAt(0) || 'S'}
                </div>
                <div className="flex flex-col hidden sm:flex">
                  <span className="text-xs font-bold text-[var(--text-primary)] truncate max-w-[120px]">
                    {studentName}
                  </span>
                  <span className="text-[10px] text-orange-500 font-semibold uppercase tracking-wider font-mono-timer">
                    🔥 {currentStreak}d streak
                  </span>
                </div>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 w-full h-full overflow-y-auto hide-scrollbar z-0 transition-all duration-500 pt-16 sm:pt-20 pb-28">
        {children}
      </div>

      {/* Ambient Audio Player */}
      <AudioPlayer />

      {/* Student Profile & Gamification Modal */}
      <AnimatePresence>
         {showGamification && <GamificationModal onClose={() => setShowGamification(false)} />}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <AnimatePresence>
        {!hideNav && (
          <motion.nav
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 glass-panel rounded-full px-6 py-2.5 sm:py-3 flex items-center gap-8 shadow-xl border border-[var(--border)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isUIVisible ? 1 : 0, y: isUIVisible ? 0 : 20 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <NavButton 
              icon={<Clock />} 
              label="Timer" 
              active={activeTab === 'timer'} 
              onClick={() => setActiveTab('timer')} 
            />
            <NavButton 
              icon={<CheckSquare />} 
              label="Targets" 
              active={activeTab === 'tasks'} 
              onClick={() => setActiveTab('tasks')} 
            />
            <NavButton 
              icon={<BookOpen />} 
              label="Syllabus" 
              active={activeTab === 'syllabus'} 
              onClick={() => setActiveTab('syllabus')} 
            />
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavButton = ({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ReactElement<{ size?: number }>, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-200 ${
      active 
        ? 'text-[var(--accent)] scale-110' 
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
    }`}
  >
    {React.cloneElement(icon, { size: 20 })}
    <span className="text-[10px] uppercase tracking-wider font-bold">{label}</span>
  </button>
);
