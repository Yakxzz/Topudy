import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Play, Pause, RotateCcw, Maximize2, Minimize2, Flame, BarChart2, BookOpen } from 'lucide-react';
import { useAppStore } from '../../store';
import { GamificationModal } from '../Gamification/GamificationModal';
import { AnalyticsModal } from '../Analytics/AnalyticsModal';
import { sounds } from '../../utils/soundEffects';

const CBSE_SUBJECTS = [
  { id: 'Mathematics', label: 'Maths', icon: '📐' },
  { id: 'Science', label: 'Science', icon: '🔬' },
  { id: 'Social Science', label: 'SST', icon: '🌍' },
  { id: 'English', label: 'English', icon: '📖' },
  { id: 'General Focus', label: 'Revision', icon: '⚡' },
];

const PRESETS = [
  { label: '25m Pomodoro', minutes: 25, badge: 'Standard' },
  { label: '45m Deep Study', minutes: 45, badge: 'Recommended' },
  { label: '60m PYQ Sprint', minutes: 60, badge: 'Intense' },
  { label: '180m Board Mock', minutes: 180, badge: 'Full Exam' },
];

const MOTIVATIONAL_QUOTES = [
  "Master NCERT concepts today; thank yourself on results day.",
  "Success in 10th CBSE boards is the sum of small daily focus sessions.",
  "Focus on the step in front of you, not the whole mountain.",
  "Your dedication today builds tomorrow's 95%+ marksheet.",
  "One theorem at a time. One formula at a time. Keep going."
];

export const TimerView: React.FC<{
  setIsTimerActive: (active: boolean) => void;
}> = ({ setIsTimerActive }) => {
  const { 
    defaultTimerDuration,
    recordStudySession, 
    currentStreak,
    timerFont,
    currentSubjectTag,
    setCurrentSubjectTag
  } = useAppStore();
  
  const [timeLeft, setTimeLeft] = useState(defaultTimerDuration * 60);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState(defaultTimerDuration * 60);
  const [isActive, setIsActive] = useState(false);
  
  // Modals & Zen
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showGamification, setShowGamification] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Interaction Hover
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setIsTimerActive(isActive);
  }, [isActive, setIsTimerActive]);

  // Sync default duration changes when paused
  useEffect(() => {
    if (!isActive) {
      const secs = defaultTimerDuration * 60;
      setTimeLeft(secs);
      setTotalSessionSeconds(secs);
    }
  }, [defaultTimerDuration, isActive]);

  const handleTimerComplete = useCallback(() => {
    sounds.playTimerComplete();
    recordStudySession(totalSessionSeconds, currentSubjectTag);
    setShowCompletion(true);
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  }, [totalSessionSeconds, currentSubjectTag, recordStudySession]);

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
  }, [isActive, timeLeft, handleTimerComplete]);

  // Keyboard shortcuts (Space to start/pause, R to reset, F for fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        toggleTimer();
      } else if (e.code === 'KeyR' && !isActive) {
        resetTimer();
      } else if (e.code === 'KeyF') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const toggleTimer = () => {
    sounds.playClick();
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    sounds.playClick();
    setIsActive(false);
    setTimeLeft(totalSessionSeconds);
  };

  const handleUserActivity = () => {
    setIsHovering(true);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = window.setTimeout(() => {
      setIsHovering(false);
    }, 3500);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress ring math
  const progressRatio = totalSessionSeconds > 0 ? (totalSessionSeconds - timeLeft) / totalSessionSeconds : 0;
  const strokeDashoffset = 100 - progressRatio * 100;

  // Font styling class
  const getFontClass = () => {
    if (timerFont === 'mono') return 'font-mono-timer font-bold tracking-tight';
    if (timerFont === 'serif') return 'font-serif font-semibold tracking-tighter';
    return 'font-sans font-bold tracking-tight';
  };

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center relative select-none overflow-hidden"
      onMouseMove={handleUserActivity}
      onTouchStart={handleUserActivity}
    >
      
      {/* Top Controls: Analytics & Gamification */}
      <AnimatePresence>
        {(!isActive || isHovering) && (
          <motion.div 
            className="absolute top-4 sm:top-8 left-4 sm:left-8 flex items-center gap-3 z-40"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <button 
              onClick={() => setShowAnalytics(true)} 
              className="glass-panel p-2.5 sm:p-3 rounded-full hover:scale-105 transition-transform text-[var(--accent)] border border-[var(--border)] shadow-sm"
              title="Board Study Analytics"
            >
              <BarChart2 size={20} />
            </button>
            <button 
              onClick={() => setShowGamification(true)} 
              className="glass-panel px-3.5 py-2 rounded-full hover:scale-105 transition-transform text-orange-500 flex items-center gap-2 border border-[var(--border)] shadow-sm"
              title="Current Streak & Milestones"
            >
              <Flame size={18} fill="currentColor" />
              <span className="font-bold text-xs sm:text-sm font-mono-timer">{currentStreak}d</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Center: Subject Tag Selector for 10th CBSE */}
      <AnimatePresence>
        {(!isActive || isHovering) && (
          <motion.div 
            className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1 glass-panel rounded-full border border-[var(--border)] shadow-sm z-30 max-w-[92vw] overflow-x-auto hide-scrollbar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {CBSE_SUBJECTS.map((subj) => (
              <button
                key={subj.id}
                onClick={() => {
                  sounds.playClick();
                  setCurrentSubjectTag(subj.id);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  currentSubjectTag === subj.id 
                    ? 'bg-[var(--accent)] text-white shadow-sm' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <span>{subj.icon}</span>
                <span>{subj.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Zen button top-right when hovering */}
      <AnimatePresence>
        {isHovering && (
          <motion.button
            onClick={toggleFullscreen}
            className="absolute top-4 sm:top-8 right-20 sm:right-28 p-2.5 rounded-full glass-panel border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-sm z-40 hidden sm:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Zen Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Timer Circular Ring & Display */}
      <div className="relative flex items-center justify-center">
        {/* Subtle SVG Progress Ring */}
        <svg 
          className="absolute w-[80vw] h-[80vw] max-w-[420px] max-h-[420px] sm:max-w-[480px] sm:max-h-[480px] -rotate-90 pointer-events-none"
          viewBox="0 0 100 100"
        >
          {/* Background circle track */}
          <circle
            cx="50"
            cy="50"
            r="44"
            className="stroke-[var(--bg-secondary)]"
            strokeWidth="2.5"
            fill="transparent"
          />
          {/* Active progress circle */}
          <circle
            cx="50"
            cy="50"
            r="44"
            className="stroke-[var(--accent)] transition-all duration-1000 ease-linear"
            strokeWidth="3.2"
            strokeDasharray="276.46"
            strokeDashoffset={(strokeDashoffset * 2.7646).toString()}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Timer Digits */}
        <div className="flex flex-col items-center justify-center z-10 text-center px-4">
          <motion.div 
            className={`leading-none text-[var(--accent)] select-none text-glow ${getFontClass()}`}
            animate={{ 
              scale: isActive ? 1.05 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{ 
              fontSize: isActive 
                ? 'clamp(4.2rem, 15vw, 9.5rem)' 
                : 'clamp(3.8rem, 13vw, 8rem)' 
            }}
          >
            {formatTime(timeLeft)}
          </motion.div>

          {/* Current Subject Badge */}
          <motion.div 
            className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-secondary)] text-xs font-semibold text-[var(--text-secondary)] border border-[var(--border)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <BookOpen size={12} className="text-[var(--accent)]" />
            <span>{currentSubjectTag}</span>
            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />}
          </motion.div>
        </div>
      </div>

      {/* Motivational Quote at Bottom during Zen Focus */}
      <AnimatePresence>
        {isActive && !isHovering && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.7, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-28 text-center text-xs sm:text-sm italic font-serif text-[var(--text-secondary)] max-w-md px-6"
          >
            "{MOTIVATIONAL_QUOTES[quoteIndex]}"
          </motion.p>
        )}
      </AnimatePresence>

      {/* Controls Bar */}
      <AnimatePresence>
        {(!isActive || isHovering) && (
          <motion.div 
            className="flex items-center gap-4 sm:gap-8 mt-12 sm:mt-16 text-[var(--text-secondary)] absolute bottom-28 z-30"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
          >
            {!isActive && (
              <button 
                onClick={() => {
                  sounds.playClick();
                  setShowSettings(true);
                }} 
                className="p-3.5 sm:p-4 rounded-full glass-panel border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors shadow-sm"
                title="Timer Settings & Presets"
              >
                <Settings size={22} />
              </button>
            )}
            
            <button 
              onClick={toggleTimer} 
              className={`rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:bg-[var(--accent-hover)] transition-all shadow-xl hover:scale-105 active:scale-95 ${
                isActive ? 'w-16 h-16 opacity-80 hover:opacity-100 ring-4 ring-[var(--accent)]/30' : 'w-20 h-20'
              }`}
              title={isActive ? "Pause Focus (Space)" : "Start Focus (Space)"}
            >
              {isActive ? (
                <Pause size={26} fill="currentColor" />
              ) : (
                <Play size={32} fill="currentColor" className="ml-1.5" />
              )}
            </button>
            
            {!isActive && (
              <button 
                onClick={resetTimer} 
                className="p-3.5 sm:p-4 rounded-full glass-panel border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors shadow-sm" 
                title="Reset Timer (R)"
              >
                <RotateCcw size={22} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Presets Bar below main controls when paused */}
      <AnimatePresence>
        {!isActive && (
          <motion.div 
            className="absolute bottom-12 flex items-center gap-2 max-w-[94vw] overflow-x-auto hide-scrollbar z-20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {PRESETS.map((preset) => (
              <button
                key={preset.minutes}
                onClick={() => {
                  sounds.playClick();
                  useAppStore.getState().setDefaultTimerDuration(preset.minutes);
                  setTotalSessionSeconds(preset.minutes * 60);
                  setTimeLeft(preset.minutes * 60);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  defaultTimerDuration === preset.minutes
                    ? 'bg-[var(--bg-secondary)] border-[var(--accent)] text-[var(--accent)] shadow-sm'
                    : 'glass-panel border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-[var(--bg-primary)] rounded-3xl p-8 max-w-md w-full border border-[var(--border)] shadow-2xl text-center relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-inner">
                <span className="text-4xl">🌟</span>
              </div>
              <h2 className="text-3xl font-serif text-[var(--text-primary)] mb-2">
                Study Session Conquered!
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Awesome focus in <span className="font-semibold text-[var(--text-primary)]">{currentSubjectTag}</span>! Your session time has been added to your Board Prep hours and daily streak.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    sounds.playPop();
                    setShowCompletion(false); 
                    resetTimer(); 
                  }} 
                  className="flex-1 py-3.5 rounded-2xl bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-lg"
                >
                  Start Next Session
                </button>
                <button 
                  onClick={() => setShowCompletion(false)} 
                  className="px-5 py-3.5 rounded-2xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && <TimerSettingsModal onClose={() => setShowSettings(false)} />}
        {showAnalytics && <AnalyticsModal onClose={() => setShowAnalytics(false)} />}
        {showGamification && <GamificationModal onClose={() => setShowGamification(false)} />}
      </AnimatePresence>
    </div>
  );
};

const TimerSettingsModal = ({ onClose }: { onClose: () => void }) => {
  const { 
    defaultTimerDuration, 
    setDefaultTimerDuration, 
    timerFont, 
    setTimerFont 
  } = useAppStore();
  const [duration, setDuration] = useState(defaultTimerDuration);

  const handleSave = () => {
    setDefaultTimerDuration(duration);
    onClose();
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-[var(--bg-primary)] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--border)] w-full max-w-sm"
        initial={{ y: 30, scale: 0.95 }} 
        animate={{ y: 0, scale: 1 }} 
        exit={{ y: 20, scale: 0.95 }}
      >
        <h2 className="text-2xl font-serif mb-6 text-center text-[var(--text-primary)]">Timer Configuration</h2>
        
        <div className="space-y-6 mb-8">
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
              Study Duration (Minutes)
            </label>
            <div className="flex gap-2">
              <input 
                type="number" 
                min="1"
                max="360"
                value={duration} 
                onChange={e => setDuration(Math.max(1, Number(e.target.value)))} 
                className="flex-1 p-3 text-center rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] outline-none focus:border-[var(--accent)] font-mono-timer font-bold" 
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
              Timer Font Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'mono', label: 'JetBrains', font: 'font-mono' },
                { id: 'serif', label: 'Playfair', font: 'font-serif' },
                { id: 'clean', label: 'Jakarta', font: 'font-sans' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setTimerFont(f.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    timerFont === f.id
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm'
                      : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)]'
                  } ${f.font}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleSave} 
          className="w-full py-3.5 rounded-xl bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors mb-2 shadow-md"
        >
          Save Changes
        </button>
        <button 
          onClick={onClose} 
          className="w-full py-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors text-sm"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
};
