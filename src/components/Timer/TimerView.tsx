import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Play, Pause, Flame, BarChart2, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../store';
import { GamificationModal } from '../Gamification/GamificationModal';
import { AnalyticsModal } from '../Analytics/AnalyticsModal';

export const TimerView: React.FC<{
  setIsTimerActive: (active: boolean) => void
}> = ({ setIsTimerActive }) => {
  const { 
    defaultTimerDuration, 
    recordStudySession, currentStreak
  } = useAppStore();
  
  const [timeLeft, setTimeLeft] = useState(defaultTimerDuration * 60);
  const [isActive, setIsActive] = useState(false);
  
  // Modals
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showGamification, setShowGamification] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  // Zen Mode Hover
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    setIsTimerActive(isActive);
  }, [isActive, setIsTimerActive]);

  useEffect(() => {
    let interval: number | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(defaultTimerDuration * 60);
    }
  }, [defaultTimerDuration, isActive]);

  const handleTimerComplete = () => {
    recordStudySession(defaultTimerDuration * 60);
    setShowCompletion(true);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(defaultTimerDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={() => setIsHovering(true)}
    >
      
      {/* Top Bar: Analytics & Gamification */}
      <AnimatePresence>
        {!isActive && (
          <motion.div 
            className="absolute top-8 left-8 flex gap-4 z-40"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <button onClick={() => setShowAnalytics(true)} className="glass-panel p-3 rounded-full hover:scale-105 transition-transform text-[var(--accent)]">
              <BarChart2 size={24} />
            </button>
            <button onClick={() => setShowGamification(true)} className="glass-panel p-3 rounded-full hover:scale-105 transition-transform text-orange-500 flex items-center gap-2">
              <Flame size={24} fill="currentColor" />
              <span className="font-bold text-sm">{currentStreak}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Overlay */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div 
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[var(--bg-primary)]/80 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <h2 className="text-4xl font-serif text-[var(--text-primary)] mb-4 text-center">
              Session Complete!
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-8">
              Great focus. Your time has been recorded.
            </p>
            <button onClick={() => { setShowCompletion(false); resetTimer(); }} className="px-8 py-3 rounded-full bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors shadow-lg">
              Start Another Session
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Clock */}
      <motion.div 
        className={`font-serif leading-none tracking-tighter text-[var(--accent)] drop-shadow-sm select-none transition-all duration-700`}
        animate={{ 
          scale: isActive ? 1.1 : 1,
          y: isActive ? 0 : 0
        }}
        style={{ fontSize: isActive ? 'clamp(6rem, 20vw, 18rem)' : 'clamp(5rem, 15vw, 12rem)' }}
      >
        {formatTime(timeLeft)}
      </motion.div>

      {/* Controls */}
      <AnimatePresence>
        {(!isActive || isHovering) && (
          <motion.div 
            className="flex items-center gap-4 sm:gap-8 mt-16 text-[var(--text-secondary)] absolute bottom-32"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {!isActive && (
              <button onClick={() => setShowSettings(true)} className="p-4 rounded-full hover:bg-[var(--bg-secondary)] transition-colors">
                <Settings size={28} />
              </button>
            )}
            
            <button 
              onClick={toggleTimer} 
              className={`rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:bg-[var(--accent-hover)] transition-colors shadow-lg ${isActive ? 'w-16 h-16 opacity-70 hover:opacity-100' : 'w-20 h-20'}`}
            >
              {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-2" />}
            </button>
            
            {!isActive && (
              <button onClick={resetTimer} className="p-4 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" title="Reset Timer">
                <RotateCcw size={28} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        {showAnalytics && <AnalyticsModal onClose={() => setShowAnalytics(false)} />}
        {showGamification && <GamificationModal onClose={() => setShowGamification(false)} />}
      </AnimatePresence>
    </div>
  );
};

const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  const { defaultTimerDuration, setDefaultTimerDuration } = useAppStore();
  const [duration, setDuration] = useState(defaultTimerDuration);

  const handleSave = () => {
    setDefaultTimerDuration(duration);
    onClose();
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-[var(--bg-primary)] rounded-3xl p-8 shadow-2xl border border-[var(--border)] w-[90%] max-w-sm"
        initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
      >
        <h2 className="text-2xl font-serif mb-6 text-center text-[var(--text-primary)]">Timer Settings</h2>
        
        <div className="space-y-6 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-secondary)] font-medium">Study Duration (mins)</span>
            <input 
              type="number" 
              value={duration} 
              onChange={e => setDuration(Math.max(1, Number(e.target.value)))} 
              className="w-20 p-2 text-center rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border-none outline-none focus:ring-2 focus:ring-[var(--accent)]" 
            />
          </div>
        </div>
        
        <button onClick={handleSave} className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors mb-4">
          Save Changes
        </button>
        <button onClick={onClose} className="w-full py-3 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
};
