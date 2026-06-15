import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Play, Pause, SkipForward } from 'lucide-react';
import { useAppStore } from '../../store';

export const TimerView: React.FC = () => {
  const { workDuration, shortBreakDuration, longBreakDuration, setTimerSettings } = useAppStore();
  
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Automatically switch modes or play sound here
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    // Reset timer when mode or durations change (if not active)
    if (!isActive) {
      if (mode === 'work') setTimeLeft(workDuration * 60);
      else if (mode === 'shortBreak') setTimeLeft(shortBreakDuration * 60);
      else if (mode === 'longBreak') setTimeLeft(longBreakDuration * 60);
    }
  }, [workDuration, shortBreakDuration, longBreakDuration, mode, isActive]);

  const toggleTimer = () => setIsActive(!isActive);

  const switchMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      
      {/* Mode Selector */}
      <div className="flex gap-4 mb-12">
        <ModeButton active={mode === 'work'} onClick={() => switchMode('work')}>Work</ModeButton>
        <ModeButton active={mode === 'shortBreak'} onClick={() => switchMode('shortBreak')}>Short Break</ModeButton>
        <ModeButton active={mode === 'longBreak'} onClick={() => switchMode('longBreak')}>Long Break</ModeButton>
      </div>

      {/* The Clock */}
      <motion.div 
        className="text-[12rem] md:text-[18rem] font-serif leading-none tracking-tighter text-[var(--accent)] drop-shadow-sm select-none"
        animate={{ scale: isActive ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {formatTime(timeLeft)}
      </motion.div>

      {/* Controls */}
      <div className="flex items-center gap-8 mt-16 text-[var(--text-secondary)]">
        <button onClick={() => setShowSettings(true)} className="p-4 rounded-full hover:bg-[var(--bg-secondary)] transition-colors">
          <Settings size={28} />
        </button>
        
        <button 
          onClick={toggleTimer} 
          className="w-20 h-20 rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:bg-[var(--accent-hover)] transition-colors shadow-lg"
        >
          {isActive ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-2" />}
        </button>
        
        <button onClick={() => switchMode('shortBreak')} className="p-4 rounded-full hover:bg-[var(--bg-secondary)] transition-colors">
          <SkipForward size={28} />
        </button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const ModeButton = ({ active, children, onClick }: { active: boolean, children: React.ReactNode, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${active ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}
  >
    {children}
  </button>
);

const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  const { workDuration, shortBreakDuration, longBreakDuration, setTimerSettings } = useAppStore();
  const [work, setWork] = useState(workDuration);
  const [short, setShort] = useState(shortBreakDuration);
  const [long, setLong] = useState(longBreakDuration);

  const handleSave = () => {
    setTimerSettings(work, short, long);
    onClose();
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-[var(--bg-primary)] rounded-3xl p-8 shadow-2xl border border-[var(--border)] w-[90%] max-w-md"
        initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
      >
        <h2 className="text-2xl font-serif mb-6 text-center text-[var(--text-primary)]">Timer Settings</h2>
        
        <div className="space-y-6 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-secondary)] font-medium">Work</span>
            <input type="number" value={work} onChange={e => setWork(Number(e.target.value))} className="w-20 p-2 text-center rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border-none outline-none focus:ring-2 focus:ring-[var(--accent)]" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-secondary)] font-medium">Short Break</span>
            <input type="number" value={short} onChange={e => setShort(Number(e.target.value))} className="w-20 p-2 text-center rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border-none outline-none focus:ring-2 focus:ring-[var(--accent)]" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-secondary)] font-medium">Long Break</span>
            <input type="number" value={long} onChange={e => setLong(Number(e.target.value))} className="w-20 p-2 text-center rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border-none outline-none focus:ring-2 focus:ring-[var(--accent)]" />
          </div>
        </div>
        
        <button onClick={handleSave} className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors mb-4">
          Save Changes
        </button>
        <button onClick={onClose} className="w-full py-3 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
          Cancel
        </button>

        <p className="mt-8 text-center text-xs text-[var(--text-secondary)] opacity-50 tracking-widest uppercase">Created by xyz</p>
      </motion.div>
    </motion.div>
  );
};
