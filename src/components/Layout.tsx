import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckSquare, Clock } from 'lucide-react';
import { useAppStore } from '../store';

export const Layout: React.FC<{ children: React.ReactNode, activeTab: string, setActiveTab: (t: string) => void }> = ({ children, activeTab, setActiveTab }) => {
  const { theme, setTheme } = useAppStore();
  const [isUIVisible, setIsUIVisible] = useState(true);
  const hideTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Apply theme class to document body
    document.body.className = theme === 'default' ? '' : `theme-${theme}`;
  }, [theme]);

  // Auto-hide UI logic (Zen Mode)
  useEffect(() => {
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
    
    resetTimer(); // init

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const themes = [
    { id: 'default', label: 'Matcha Light' },
    { id: 'cloud-white', label: 'Cloud White' },
    { id: 'rosewater', label: 'Rosewater' },
    { id: 'midnight', label: 'Midnight Dark' },
  ] as const;

  return (
    <div className="relative w-full h-full flex overflow-hidden">
      {/* Background container for the active view */}
      <div className="flex-1 w-full h-full overflow-y-auto hide-scrollbar z-0 transition-all duration-500">
        {children}
      </div>

      {/* Auto-hiding Navigation */}
      <motion.nav
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 glass-panel rounded-full px-6 py-3 flex items-center gap-8"
        animate={{ opacity: isUIVisible ? 1 : 0, y: isUIVisible ? 0 : 20 }}
        transition={{ duration: 0.5 }}
      >
        <NavButton icon={<Clock />} label="Timer" active={activeTab === 'timer'} onClick={() => setActiveTab('timer')} />
        <NavButton icon={<CheckSquare />} label="Tasks" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
        <NavButton icon={<BookOpen />} label="Syllabus" active={activeTab === 'syllabus'} onClick={() => setActiveTab('syllabus')} />
      </motion.nav>

      {/* Auto-hiding Theme Switcher & Settings */}
      <motion.div
        className="fixed top-8 right-8 z-40 flex items-center gap-4"
        animate={{ opacity: isUIVisible ? 1 : 0, y: isUIVisible ? 0 : -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass-panel rounded-full p-2 flex gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`w-6 h-6 rounded-full border border-[var(--border)] transition-transform hover:scale-110 ${theme === t.id ? 'ring-2 ring-offset-2 ring-[var(--accent)]' : ''}`}
              title={t.label}
              style={{
                backgroundColor: 
                  t.id === 'default' ? '#fdfbf7' : 
                  t.id === 'cloud-white' ? '#ffffff' : 
                  t.id === 'rosewater' ? '#fff0f3' : '#121212'
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors duration-300 ${active ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
  >
    {React.cloneElement(icon as React.ReactElement, { size: 20 })}
    <span className="text-[10px] uppercase tracking-wider font-semibold">{label}</span>
  </button>
);
