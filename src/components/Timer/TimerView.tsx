import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Play, Pause, SkipForward, Flame, BarChart2, Square, Clock, Hourglass } from 'lucide-react';
import { useAppStore } from '../../store';
import { GamificationModal } from '../Gamification/GamificationModal';
import { AnalyticsModal } from '../Analytics/AnalyticsModal';
import { AudioPlayer } from './AudioPlayer';

type PhaseMode = 'work' | 'shortBreak' | 'longBreak';

export const TimerView: React.FC<{
  setIsTimerActive: (active: boolean) => void
}> = ({ setIsTimerActive }) => {
  const { 
    workDuration, shortBreakDuration, longBreakDuration, 
    cyclesBeforeLongBreak, recordStudySession,
    currentStreak, timerMode, setTimerMode
  } = useAppStore();
  
  const [phase, setPhase] = useState<PhaseMode>('work');
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [studyTime, setStudyTime] = useState(0); // For stopwatch mode
  const [isActive, setIsActive] = useState(false);
  const lastRecordedTimeLeftRef = useRef(workDuration * 60);
  
  // Modals & Popups
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showGamification, setShowGamification] = useState(false);

  // Zen Mode Hover
  const [isHovering, setIsHovering] = useState(false);
  const [idleTimer, setIdleTimer] = useState<number | null>(null);

  const resetIdleTimer = () => {
    setIsHovering(true);
    if (idleTimer) window.clearTimeout(idleTimer);
    const timer = window.setTimeout(() => setIsHovering(false), 3000);
    setIdleTimer(timer);
  };

  useEffect(() => {
    return () => {
      if (idleTimer) window.clearTimeout(idleTimer);
    };
  }, [idleTimer]);

  // Intermission State
  const [intermission, setIntermission] = useState<{ active: boolean, nextMode: PhaseMode, timeLeft: number } | null>(null);

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
            startNextPhase(prev.nextMode);
            return null;
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
      return () => { if (interval) clearInterval(interval); };
    }

    // Timer Mode Logic (Countdown)
    if (timerMode === 'timer') {
      if (isActive && !intermission && timeLeft > 0) {
        interval = window.setInterval(() => {
          setTimeLeft((time) => time - 1);
        }, 1000);
      } else if (isActive && !intermission && timeLeft === 0) {
        setIsActive(false);
        handlePhaseComplete();
      }
    } 
    // Study Mode Logic (Stopwatch)
    else {
      if (isActive) {
        interval = window.setInterval(() => {
          setStudyTime(t => t + 1);
        }, 1000);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, intermission, timerMode]);

  const prevDurations = useRef({ workDuration, shortBreakDuration, longBreakDuration });

  useEffect(() => {
    if (timerMode === 'timer') {
      const changed = 
        prevDurations.current.workDuration !== workDuration ||
        prevDurations.current.shortBreakDuration !== shortBreakDuration ||
        prevDurations.current.longBreakDuration !== longBreakDuration;
        
      if (changed) {
        if (!isActive && !intermission) {
          if (phase === 'work') {
            setTimeLeft(workDuration * 60);
            lastRecordedTimeLeftRef.current = workDuration * 60;
          }
          else if (phase === 'shortBreak') setTimeLeft(shortBreakDuration * 60);
          else if (phase === 'longBreak') setTimeLeft(longBreakDuration * 60);
        }
        prevDurations.current = { workDuration, shortBreakDuration, longBreakDuration };
      }
    }
  }, [workDuration, shortBreakDuration, longBreakDuration, phase, isActive, intermission, timerMode]);

  const recordElapsedTimerMode = (currentTimeLeft: number) => {
    if (phase === 'work') {
      const elapsed = lastRecordedTimeLeftRef.current - currentTimeLeft;
      if (elapsed > 0) {
        recordStudySession(elapsed);
        lastRecordedTimeLeftRef.current = currentTimeLeft;
      }
    }
  };

  const handlePhaseComplete = () => {
    if (phase === 'work') {
      recordElapsedTimerMode(0);
      const isLongBreakNext = currentCycle % cyclesBeforeLongBreak === 0;
      setIntermission({
        active: true,
        nextMode: isLongBreakNext ? 'longBreak' : 'shortBreak',
        timeLeft: 10
      });
    } else {
      if (phase === 'longBreak') {
         setCurrentCycle(1);
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

  const startNextPhase = (nextMode: PhaseMode) => {
    setPhase(nextMode);
    let newTime = 0;
    if (nextMode === 'work') newTime = workDuration * 60;
    else if (nextMode === 'shortBreak') newTime = shortBreakDuration * 60;
    else if (nextMode === 'longBreak') newTime = longBreakDuration * 60;
    
    setTimeLeft(newTime);
    if (nextMode === 'work') {
      lastRecordedTimeLeftRef.current = newTime;
    }
    setIsActive(true);
    setIntermission(null);
  };

  const extendCurrentPhase = () => {
    const newTime = 5 * 60;
    setTimeLeft(newTime);
    if (phase === 'work') {
      lastRecordedTimeLeftRef.current = newTime;
    }
    setIsActive(true);
    setIntermission(null);
  };

  const togglePlay = () => {
    if (timerMode === 'timer') {
      if (isActive) {
        recordElapsedTimerMode(timeLeft); // Save partial progress if paused
      } else {
        lastRecordedTimeLeftRef.current = timeLeft; // Update ref to current time on resume
      }
    }
    setIsActive(!isActive);
  };

  const stopStudyMode = () => {
    setIsActive(false);
    if (studyTime > 0) {
      recordStudySession(studyTime);
      setStudyTime(0);
    }
  };

  const stopTimerMode = () => {
    setIsActive(false);
    if (phase === 'work') {
      recordElapsedTimerMode(timeLeft);
    }
    // Reset to current phase's full duration
    let newTime = 0;
    if (phase === 'work') newTime = workDuration * 60;
    else if (phase === 'shortBreak') newTime = shortBreakDuration * 60;
    else if (phase === 'longBreak') newTime = longBreakDuration * 60;
    setTimeLeft(newTime);
    lastRecordedTimeLeftRef.current = newTime;
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const changeMode = (mode: 'study' | 'timer') => {
    if (isActive) return; // Don't allow mode switch while running
    setTimerMode(mode);
    if (mode === 'timer') {
      setPhase('work');
      setTimeLeft(workDuration * 60);
      lastRecordedTimeLeftRef.current = workDuration * 60;
    } else {
      setStudyTime(0);
    }
  };

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      onMouseEnter={resetIdleTimer}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={resetIdleTimer}
      onMouseMove={resetIdleTimer}
    >
      <AudioPlayer />
      
      {/* Top Bar: Analytics & Gamification (Hidden when active) */}
      <AnimatePresence>
        {!isActive && !intermission && (
          <motion.div 
            className="absolute top-4 sm:top-8 left-4 sm:left-8 flex gap-2 sm:gap-4 z-40"
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

      {/* Mode Selector (Hidden when active) */}
      <AnimatePresence>
        {!isActive && !intermission && (
          <motion.div 
            className="absolute top-4 sm:top-8 right-4 sm:right-8 flex bg-[var(--bg-secondary)] rounded-full p-1 z-40 border border-[var(--border)]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <button 
              onClick={() => changeMode('timer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${timerMode === 'timer' ? 'bg-[var(--accent)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              <Hourglass size={16} /> Timer
            </button>
            <button 
              onClick={() => changeMode('study')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${timerMode === 'study' ? 'bg-[var(--accent)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              <Clock size={16} /> Study
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
              {phase === 'work' ? 'Study Session Complete!' : 'Break Over!'}
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-8">
              Autostarting in {intermission.timeLeft}s
            </p>
            <div className="flex gap-4">
              <button onClick={() => startNextPhase(intermission.nextMode)} className="px-8 py-3 rounded-full bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors shadow-lg">
                {phase === 'work' ? 'Start Break' : 'Start Next Study Session'}
              </button>
              <button onClick={extendCurrentPhase} className="px-8 py-3 rounded-full glass-panel text-[var(--text-primary)] font-medium hover:bg-[var(--bg-secondary)] transition-colors">
                {phase === 'work' ? 'Extend Study by 5 minutes' : 'Extend Break by 5 minutes'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Clock */}
      <motion.div 
        onClick={togglePlay}
        className={`font-serif leading-none tracking-tighter text-[var(--accent)] drop-shadow-sm select-none transition-all duration-700 cursor-pointer`}
        animate={{ 
          scale: isActive ? 1.05 : 1,
          y: isActive ? 0 : 0
        }}
        style={{ fontSize: isActive ? 'clamp(8rem, 18vw, 18rem)' : 'clamp(5rem, 12vw, 12rem)' }}
      >
        {timerMode === 'timer' ? formatTime(timeLeft) : formatTime(studyTime)}
      </motion.div>

      {/* Phase Indicator */}
      <AnimatePresence>
        {!isActive && !intermission && (
          <motion.div 
            className="mt-6 text-[var(--text-secondary)] font-medium tracking-widest uppercase text-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            {timerMode === 'timer' 
              ? (phase === 'work' ? 'Focus Session' : phase === 'shortBreak' ? 'Short Break' : 'Long Break')
              : 'Stopwatch Mode'
            }
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <AnimatePresence>
        {(!isActive || isHovering) && !intermission && (
          <motion.div 
            className="flex items-center gap-6 mt-16 text-[var(--text-secondary)] absolute bottom-32"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {!isActive && (
              <button onClick={() => setShowSettings(true)} className="p-4 rounded-full glass-panel hover:bg-[var(--bg-secondary)] transition-colors">
                <Settings size={24} />
              </button>
            )}
            
            <button 
              onClick={togglePlay} 
              className={`rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:bg-[var(--accent-hover)] shadow-lg transition-all duration-500 ${isActive ? 'w-16 h-16 opacity-50 hover:opacity-100 hover:scale-110' : 'w-20 h-20'}`}
            >
              {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-2" />}
            </button>
            
            {/* Stop/Finish Button */}
            {(isActive || (timerMode === 'study' && studyTime > 0) || (timerMode === 'timer' && timeLeft < workDuration * 60)) && (
              <button 
                onClick={timerMode === 'study' ? stopStudyMode : stopTimerMode} 
                className="p-4 rounded-full glass-panel hover:bg-[var(--bg-secondary)] transition-colors text-red-500 hover:text-red-600"
                title="Stop & Save"
              >
                <Square size={24} fill="currentColor" />
              </button>
            )}

            {!isActive && timerMode === 'timer' && (
              <button onClick={() => {
                if (phase === 'work') {
                  recordElapsedTimerMode(timeLeft);
                  const isLongBreakNext = currentCycle % cyclesBeforeLongBreak === 0;
                  startNextPhase(isLongBreakNext ? 'longBreak' : 'shortBreak');
                } else {
                  startNextPhase('work');
                }
              }} className="p-4 rounded-full glass-panel hover:bg-[var(--bg-secondary)] transition-colors">
                <SkipForward size={24} />
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
