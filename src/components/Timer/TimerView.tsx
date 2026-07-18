import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Play, Pause, Square, Clock, Hourglass, Flame, BarChart2, Award, Palette } from 'lucide-react';
import { useAppStore } from '../../store';
import { GamificationModal } from '../Gamification/GamificationModal';
import { ThemeSelectionModal } from '../Gamification/ThemeSelectionModal';
import { CertificatesGallery } from '../Gamification/CertificatesGallery';
import { AnalyticsModal } from '../Analytics/AnalyticsModal';
import { AudioPlayer } from './AudioPlayer';

export const TimerView: React.FC<{
  setIsTimerActive: (active: boolean) => void
}> = ({ setIsTimerActive }) => {
  const { 
    workDuration, recordStudySession,
    currentStreak, timerMode, setTimerMode,
    isPremium, trialTimeUsed
  } = useAppStore();
  
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [studyTime, setStudyTime] = useState(0); 
  const [isActive, setIsActive] = useState(false);
  const lastRecordedTimeLeftRef = useRef(workDuration * 60);
  
  // Modals & Popups
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showGamification, setShowGamification] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);

  // Zen Mode Hover
  const [isHovering, setIsHovering] = useState(false);
  const [idleTimer, setIdleTimer] = useState<number | null>(null);

  const isLocked = !isPremium && trialTimeUsed >= 600;

  useEffect(() => {
    // Force study mode if locked out
    if (isLocked && timerMode !== 'study') {
      setTimerMode('study');
    }
  }, [isLocked, timerMode, setTimerMode]);

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

  useEffect(() => {
    setIsTimerActive(isActive);
  }, [isActive, setIsTimerActive]);

  useEffect(() => {
    let interval: number | null = null;
    
    if (timerMode === 'timer') {
      if (isActive && timeLeft > 0) {
        interval = window.setInterval(() => {
          setTimeLeft((time) => time - 1);
        }, 1000);
      } else if (isActive && timeLeft === 0) {
        setIsActive(false);
        recordElapsedTimerMode(0);
        setTimeLeft(workDuration * 60); // Reset for next time
        lastRecordedTimeLeftRef.current = workDuration * 60;
      }
    } else {
      if (isActive) {
        interval = window.setInterval(() => {
          setStudyTime(t => t + 1);
        }, 1000);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, timerMode, workDuration]);

  const prevWorkDuration = useRef(workDuration);

  useEffect(() => {
    if (timerMode === 'timer' && prevWorkDuration.current !== workDuration) {
      if (!isActive) {
        setTimeLeft(workDuration * 60);
        lastRecordedTimeLeftRef.current = workDuration * 60;
      }
      prevWorkDuration.current = workDuration;
    }
  }, [workDuration, isActive, timerMode]);

  const recordElapsedTimerMode = (currentTimeLeft: number) => {
    const elapsed = lastRecordedTimeLeftRef.current - currentTimeLeft;
    if (elapsed > 0) {
      recordStudySession(elapsed);
      lastRecordedTimeLeftRef.current = currentTimeLeft;
    }
  };

  const togglePlay = () => {
    if (timerMode === 'timer') {
      if (isActive) {
        recordElapsedTimerMode(timeLeft); 
      } else {
        lastRecordedTimeLeftRef.current = timeLeft; 
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
    recordElapsedTimerMode(timeLeft);
    const newTime = workDuration * 60;
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
    if (isActive || isLocked) return; 
    setTimerMode(mode);
    if (mode === 'timer') {
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
      
      {/* Top Bar: Menus (Hidden when active) */}
      <AnimatePresence>
        {!isActive && (
          <motion.div 
            className="absolute top-4 sm:top-8 left-4 sm:left-8 flex flex-col sm:flex-row gap-2 sm:gap-4 z-40"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <button onClick={() => !isLocked && setShowAnalytics(true)} className={`glass-panel p-3 rounded-full transition-transform ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 text-[var(--accent)]'}`}>
              <BarChart2 size={24} />
            </button>
            <button onClick={() => !isLocked && setShowGamification(true)} className={`glass-panel p-3 rounded-full transition-transform flex items-center gap-2 ${isLocked ? 'opacity-50 cursor-not-allowed text-gray-500' : 'hover:scale-105 text-orange-500'}`}>
              <Flame size={24} fill={isLocked ? "none" : "currentColor"} />
              {!isLocked && <span className="font-bold text-sm hidden sm:inline">{currentStreak}</span>}
            </button>
            <button onClick={() => !isLocked && setShowThemes(true)} className={`glass-panel p-3 rounded-full transition-transform ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 text-[var(--text-secondary)]'}`}>
              <Palette size={24} />
            </button>
            <button onClick={() => !isLocked && setShowCertificates(true)} className={`glass-panel p-3 rounded-full transition-transform ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 text-[#c68a53]'}`}>
              <Award size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode Selector (Hidden when active) */}
      <AnimatePresence>
        {!isActive && !isLocked && (
          <motion.div 
            className="absolute top-24 left-1/2 -translate-x-1/2 flex bg-[var(--bg-secondary)] rounded-full p-1 z-40 border border-[var(--border)] shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <button 
              onClick={() => changeMode('study')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${timerMode === 'study' ? 'bg-[var(--accent)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              <Clock size={16} /> Study
            </button>
            <button 
              onClick={() => changeMode('timer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${timerMode === 'timer' ? 'bg-[var(--accent)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              <Hourglass size={16} /> Timer
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Clock */}
      <motion.div 
        onClick={togglePlay}
        className={`font-serif leading-none tracking-tighter text-[var(--accent)] drop-shadow-sm select-none transition-all duration-700 cursor-pointer w-[90%] text-center`}
        animate={{ 
          scale: isActive ? 1.05 : 1,
          y: isActive ? 0 : 0
        }}
        style={{ fontSize: isActive ? 'clamp(6rem, 20vw, 20rem)' : 'clamp(5rem, 15vw, 15rem)' }}
      >
        {timerMode === 'timer' ? formatTime(timeLeft) : formatTime(studyTime)}
      </motion.div>

      {/* Phase Indicator */}
      <AnimatePresence>
        {!isActive && (
          <motion.div 
            className="mt-6 text-[var(--text-secondary)] font-medium tracking-widest uppercase text-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            {timerMode === 'timer' ? 'Countdown Timer' : 'Stopwatch Mode'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <AnimatePresence>
        {(!isActive || isHovering) && (
          <motion.div 
            className="flex items-center gap-6 mt-16 text-[var(--text-secondary)] absolute bottom-32"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {!isActive && timerMode === 'timer' && (
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
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        {showAnalytics && <AnalyticsModal onClose={() => setShowAnalytics(false)} />}
        {showGamification && <GamificationModal onClose={() => setShowGamification(false)} />}
        {showThemes && <ThemeSelectionModal onClose={() => setShowThemes(false)} />}
        {showCertificates && <CertificatesGallery onClose={() => setShowCertificates(false)} />}
      </AnimatePresence>
    </div>
  );
};

const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  const { workDuration, setTimerSettings } = useAppStore();
  const [work, setWork] = useState(workDuration);

  const handleSave = () => {
    setTimerSettings(work);
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
            <span className="text-[var(--text-secondary)] font-medium">Countdown Duration (mins)</span>
            <input type="number" value={work} onChange={e => setWork(Number(e.target.value))} className="w-20 p-2 text-center rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border-none outline-none focus:ring-2 focus:ring-[var(--accent)]" />
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
