import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckSquare, Clock, User, BadgeCheck } from 'lucide-react';
import { useAppStore } from '../store';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (t: string) => void;
  hideNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, hideNav = false }) => {
  const { theme, userName, isPremium, premiumType, trialTimeUsed, setShowPaywall } = useAppStore();
  const [isUIVisible, setIsUIVisible] = useState(true);
  const hideTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    document.body.className = theme === 'default' ? '' : `theme-${theme}`;
  }, [theme]);

  // Auto-hide UI logic (Zen Mode)
  useEffect(() => {
    if (hideNav) return; // If completely hidden by timer, don't worry about auto-hide

    const resetTimer = () => {
      setIsUIVisible(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = window.setTimeout(() => {
        setIsUIVisible(false);
      }, 3000); // Hide after 3 seconds of inactivity
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
    <div className="relative w-full h-full flex overflow-hidden">
      <div className="flex-1 w-full h-full overflow-y-auto hide-scrollbar z-0 transition-all duration-500">
        {children}
      </div>

      {/* Profile Icon Top Right */}
      <AnimatePresence>
        {isUIVisible && !hideNav && (
          <motion.div 
            onClick={() => !isPremium && setShowPaywall(true)}
            className="absolute top-4 sm:top-8 right-4 sm:right-8 z-50 flex items-center gap-3 bg-[var(--bg-secondary)] rounded-full p-2 pr-4 border border-[var(--border)] shadow-sm cursor-pointer hover:scale-105 transition-transform"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white shrink-0">
              <User size={16} />
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1">
                {userName || 'Student'}
                {isPremium && <BadgeCheck size={14} className="text-blue-500" fill="currentColor" />}
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                {isPremium ? `${premiumType} Premium` : 'Free Tier'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-hiding Navigation */}
      <AnimatePresence>
        {!hideNav && (
          <motion.nav
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 glass-panel rounded-full px-6 py-3 flex items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isUIVisible ? 1 : 0, y: isUIVisible ? 0 : 20 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <NavButton icon={<Clock />} label="Timer" active={activeTab === 'timer'} onClick={() => setActiveTab('timer')} />
            <NavButton icon={<CheckSquare />} label="Tasks" active={activeTab === 'tasks'} onClick={() => !(!isPremium && trialTimeUsed >= 600) && setActiveTab('tasks')} locked={!isPremium && trialTimeUsed >= 600} />
            <NavButton icon={<BookOpen />} label="Syllabus" active={activeTab === 'syllabus'} onClick={() => !(!isPremium && trialTimeUsed >= 600) && setActiveTab('syllabus')} locked={!isPremium && trialTimeUsed >= 600} />
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick, locked }: { icon: React.ReactElement<{ size?: number }>, label: string, active: boolean, onClick: () => void, locked?: boolean }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors duration-300 ${locked ? 'opacity-30 cursor-not-allowed' : active ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
  >
    {React.cloneElement(icon, { size: 20 })}
    <span className="text-[10px] uppercase tracking-wider font-semibold">{label}</span>
  </button>
);
