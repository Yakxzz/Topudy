import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Play, Pause, SkipForward, Flame, BarChart2 } from 'lucide-react';
import { useAppStore } from '../../store';
import { GamificationModal } from '../Gamification/GamificationModal';
import { AnalyticsModal } from '../Analytics/AnalyticsModal';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export const TimerView: React.FC<{
  setIsTimerActive: (active: boolean) => void
}> = ({ setIsTimerActive }) => {
  const { 
    workDuration, shortBreakDuration, longBreakDuration, 
    cyclesBeforeLongBreak, recordStudySession 
  } = useAppStore();
  
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  
  // Modals
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showGamification, setShowGamification] = useState(false);

  // Zen Mode Hover
  const [isHovering, setIsHovering] = useState(false);
  
  // Intermission State
  const [intermission, setIntermission] = useState<{ active: boolean, nextMode: TimerMode, timeLeft: number } | null>(null);

  // Cycle Tracking
  const [currentCycle, setCurrentCycle] = useState(1);

  useEffect(() => {
    setIsTimerActive(isActive);
  }, [isActive, setIsTimerActive]);

  useEffect(() => {
    let interval: number | null = null;
    
    // Intermission logic
    if (intermission && intermission.active) {
      interval = window.setInterval(() => {
        setIntermission(prev => {
          if (!prev) return null;
          if (prev.timeLeft <= 1) {
            // Auto start next mode if intermission expires
            startNextPhase(prev.nextMode);
            return null;
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
      return () => { if (interval) clearInterval(interval); };
    }

    // Normal Timer Logic
    if (isActive && !intermission && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && !intermission && timeLeft === 0) {
      setIsActive(false);
      handlePhaseComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, intermission]);

  useEffect(() => {
    // Reset timer when mode or durations change (if not active)
    if (!isActive && !intermission) {
      if (mode === 'work') setTimeLeft(workDuration * 60);
      else if (mode === 'shortBreak') setTimeLeft(shortBreakDuration * 60);
      else if (mode === 'longBreak') setTimeLeft(longBreakDuration * 60);
    }
  }, [workDuration, shortBreakDuration, longBreakDuration, mode, isActive, intermission]);

  const handlePhaseComplete = () => {
    if (mode === 'work') {
      // Record session!
      recordStudySession(workDuration * 60);
      
      const isLongBreakNext = currentCycle % cyclesBeforeLongBreak === 0;
      setIntermission({
        active: true,
        nextMode: isLongBreakNext ? 'longBreak' : 'shortBreak',
        timeLeft: 10
      });
    } else {
      // Break is over, next is work
      if (mode === 'longBreak') {
         setCurrentCycle(1); // Reset cycles after long break
      } else {
         setCurrentCycle(prev => prev + 1);
      }
      setIntermission({
        active: true,
        nextMode: 'work',
        timeLeft: 10
      });
    }
  };

  const startNextPhase = (nextMode: TimerMode) => {
    setMode(nextMode);
    if (nextMode === 'work') setTimeLeft(workDuration * 60);
    else if (nextMode === 'shortBreak') setTimeLeft(shortBreakDuration * 60);
    else if (nextMode === 'longBreak') setTimeLeft(longBreakDuration * 60);
    setIsActive(true);
    setIntermission(null);
  };

  const extendCurrentPhase = () => {
    // Extend by 5 minutes
    setTimeLeft(5 * 60);
    setIsActive(true);
    setIntermission(null);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setIntermission(null);
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
      
      {/* Top Bar: Analytics & Gamification (Hidden when active) */}
      <AnimatePresence>
        {!isActive && !intermission && (
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
              <span className="font-bold text-sm">{useAppStore(s => s.currentStreak)}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intermission Overlay */}
      <AnimatePresence>
        {intermission && (
          <motion.div 
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[var(--bg-primary)]/80 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <h2 className="text-3xl font-serif text-[var(--text-primary)] mb-4">
              {mode === 'work' ? 'Study Session Complete!' : 'Break Over!'}
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-8">
              Starting {intermission.nextMode === 'work' ? 'Next Study Session' : 'Break'} in {intermission.timeLeft}s
            </p>
            <div className="flex gap-4">
              <button onClick={() => startNextPhase(intermission.nextMode)} className="px-8 py-3 rounded-full bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors shadow-lg">
                Start Now
              </button>
              <button onClick={extendCurrentPhase} className="px-8 py-3 rounded-full glass-panel text-[var(--text-primary)] font-medium hover:bg-[var(--bg-secondary)] transition-colors">
                +5 Mins
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode Selector (Hidden when active) */}
      <AnimatePresence>
        {!isActive && !intermission && (
          <motion.div 
            className="flex gap-4 mb-12"
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          >
            <ModeButton active={mode === 'work'} onClick={() => switchMode('work')}>Work</ModeButton>
            <ModeButton active={mode === 'shortBreak'} onClick={() => switchMode('shortBreak')}>Short Break</ModeButton>
            <ModeButton active={mode === 'longBreak'} onClick={() => switchMode('longBreak')}>Long Break</ModeButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Clock */}
      <motion.div 
        className={`font-serif leading-none tracking-tighter text-[var(--accent)] drop-shadow-sm select-none transition-all duration-700`}
        animate={{ 
          scale: isActive ? 1.2 : 1,
          y: isActive ? 0 : 0
        }}
        style={{ fontSize: isActive ? 'clamp(12rem, 25vw, 25rem)' : 'clamp(8rem, 18vw, 18rem)' }}
      >
        {formatTime(timeLeft)}
      </motion.div>

      {/* Controls (Hidden when active unless hovering) */}
      <AnimatePresence>
        {(!isActive || isHovering) && !intermission && (
          <motion.div 
            className="flex items-center gap-8 mt-16 text-[var(--text-secondary)] absolute bottom-32"
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
              <button onClick={() => switchMode('shortBreak')} className="p-4 rounded-full hover:bg-[var(--bg-secondary)] transition-colors">
                <SkipForward size={28} />
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

const ModeButton = ({ active, children, onClick }: { active: boolean, children: React.ReactNode, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${active ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}
  >
    {children}
  </button>
);

const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  const { workDuration, shortBreakDuration, longBreakDuration, cyclesBeforeLongBreak, setTimerSettings } = useAppStore();
  const [work, setWork] = useState(workDuration);
  const [short, setShort] = useState(shortBreakDuration);
  const [long, setLong] = useState(longBreakDuration);
  const [cycles, setCycles] = useState(cyclesBeforeLongBreak);

  const handleSave = () => {
    setTimerSettings(work, short, long, cycles);
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
            <span className="text-[var(--text-secondary)] font-medium">Work (mins)</span>
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
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-secondary)] font-medium">Cycles before Long Break</span>
            <input type="number" value={cycles} onChange={e => setCycles(Number(e.target.value))} className="w-20 p-2 text-center rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border-none outline-none focus:ring-2 focus:ring-[var(--accent)]" />
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
