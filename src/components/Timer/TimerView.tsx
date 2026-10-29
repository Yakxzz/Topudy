import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Play, Pause, RotateCcw, Maximize2, Minimize2, Flame, BarChart2, BookOpen, CheckCircle, Infinity as InfinityIcon, Timer as TimerIcon } from 'lucide-react';
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
  { label: '25m Pomodoro', minutes: 25 },
  { label: '45m Deep Study', minutes: 45 },
  { label: '60m PYQ Sprint', minutes: 60 },
  { label: '180m Board Mock', minutes: 180 },
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
    setCurrentSubjectTag,
    studentName
  } = useAppStore();
  
  // Mode: 'countdown' | 'infinite'
  const [timerType, setTimerType] = useState<'countdown' | 'infinite'>('countdown');

  // Countdown state
  const [timeLeft, setTimeLeft] = useState(defaultTimerDuration * 60);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState(defaultTimerDuration * 60);
  
  // Infinite / Stopwatch state (elapsed time in seconds)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Active status
  const [isActive, setIsActive] = useState(false);
  
  // Modals & Zen
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showGamification, setShowGamification] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completedDurationDisplay, setCompletedDurationDisplay] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Interaction Hover
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setIsTimerActive(isActive);
  }, [isActive, setIsTimerActive]);

  // Sync default duration changes when countdown is paused
  useEffect(() => {
    if (!isActive && timerType === 'countdown') {
      const secs = defaultTimerDuration * 60;
      setTimeLeft(secs);
      setTotalSessionSeconds(secs);
    }
  }, [defaultTimerDuration, isActive, timerType]);

  const handleCountdownComplete = useCallback(() => {
    sounds.playTimerComplete();
    recordStudySession(totalSessionSeconds, currentSubjectTag);
    const mins = Math.floor(totalSessionSeconds / 60);
    setCompletedDurationDisplay(`${mins} minutes`);
    setShowCompletion(true);
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  }, [totalSessionSeconds, currentSubjectTag, recordStudySession]);

  // Main Timer Interval
  useEffect(() => {
    let interval: number | null = null;
    
    if (isActive) {
      if (timerType === 'countdown') {
        if (timeLeft > 0) {
          interval = window.setInterval(() => {
            setTimeLeft((time) => time - 1);
          }, 1000);
        } else if (timeLeft === 0) {
          setIsActive(false);
          handleCountdownComplete();
        }
      } else {
        // Infinite timer counts up
        interval = window.setInterval(() => {
          setElapsedSeconds((sec) => sec + 1);
        }, 1000);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, timerType, handleCountdownComplete]);

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
    if (timerType === 'countdown') {
      setTimeLeft(totalSessionSeconds);
    } else {
      setElapsedSeconds(0);
    }
  };

  // Finish & log infinite study session
  const finishInfiniteSession = () => {
    if (elapsedSeconds < 30) {
      alert("Session was under 30 seconds. Study a bit longer to log it!");
      return;
    }
    sounds.playTimerComplete();
    setIsActive(false);
    recordStudySession(elapsedSeconds, currentSubjectTag);
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    setCompletedDurationDisplay(`${mins}m ${secs}s`);
    setShowCompletion(true);
    setElapsedSeconds(0);
  };

  const handleUserActivity = () => {
    setIsHovering(true);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = window.setTimeout(() => {
      setIsHovering(false);
    }, 4000);
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

    if (hrs > 0 || timerType === 'infinite') {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress ring math
  const progressRatio = timerType === 'countdown' 
    ? (totalSessionSeconds > 0 ? (totalSessionSeconds - timeLeft) / totalSessionSeconds : 0)
    : ((elapsedSeconds % 3600) / 3600); // Rotates every hour in infinite mode

  const strokeDashoffset = 100 - progressRatio * 100;

  // Font styling class
  const getFontClass = () => {
    if (timerFont === 'mono') return 'font-mono-timer font-bold tracking-tight';
    if (timerFont === 'serif') return 'font-serif font-semibold tracking-tighter';
    return 'font-sans font-bold tracking-tight';
  };

  return (
    <div 
      className="w-full min-h-[calc(100vh-140px)] flex flex-col items-center justify-between relative select-none overflow-x-hidden pt-2 pb-16"
      onMouseMove={handleUserActivity}
      onTouchStart={handleUserActivity}
    >
      
      {/* Top Bar: Analytics, Streak, and Mode Switcher */}
      <AnimatePresence>
        {(!isActive || isHovering) && (
          <motion.div 
            className="w-full max-w-4xl px-4 flex items-center justify-between z-30 mb-2"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            {/* Left buttons: Analytics & Streak */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowAnalytics(true)} 
                className="glass-panel p-2.5 rounded-full hover:scale-105 transition-transform text-[var(--accent)] border border-[var(--border)] shadow-sm"
                title="Board Analytics"
              >
                <BarChart2 size={18} />
              </button>
              <button 
                onClick={() => setShowGamification(true)} 
                className="glass-panel px-3 py-1.5 rounded-full hover:scale-105 transition-transform text-orange-500 flex items-center gap-1.5 border border-[var(--border)] shadow-sm"
                title="Current Streak"
              >
                <Flame size={16} fill="currentColor" />
                <span className="font-bold text-xs font-mono-timer">{currentStreak}d</span>
              </button>
            </div>

            {/* Center: Countdown vs Infinite Flow Switcher */}
            <div className="flex items-center p-1 bg-[var(--bg-secondary)] rounded-full border border-[var(--border)] shadow-inner">
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsActive(false);
                  setTimerType('countdown');
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  timerType === 'countdown'
                    ? 'bg-[var(--accent)] text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <TimerIcon size={13} />
                <span>Countdown</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setIsActive(false);
                  setTimerType('infinite');
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  timerType === 'infinite'
                    ? 'bg-[var(--accent)] text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <InfinityIcon size={13} />
                <span>Infinite Focus</span>
              </button>
            </div>

            {/* Right: Fullscreen Zen button */}
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-full glass-panel border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-sm hidden sm:flex"
              title={isFullscreen ? 'Exit Fullscreen' : 'Zen Fullscreen (F)'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subject Tag Selector for 10th CBSE */}
      <AnimatePresence>
        {(!isActive || isHovering) && (
          <motion.div 
            className="flex items-center gap-1.5 p-1 glass-panel rounded-full border border-[var(--border)] shadow-sm z-20 max-w-[94vw] overflow-x-auto hide-scrollbar my-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {CBSE_SUBJECTS.map((subj) => (
              <button
                key={subj.id}
                onClick={() => {
                  sounds.playClick();
                  setCurrentSubjectTag(subj.id);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  currentSubjectTag === subj.id 
                    ? 'bg-[var(--accent)] text-white shadow-sm' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>{subj.icon}</span>
                <span>{subj.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer Circular Ring & Display */}
      <div className="relative flex items-center justify-center my-auto py-4">
        {/* SVG Progress Ring */}
        <svg 
          className="w-[74vw] h-[74vw] max-w-[360px] max-h-[360px] sm:max-w-[420px] sm:max-h-[420px] -rotate-90 pointer-events-none"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="44"
            className="stroke-[var(--bg-secondary)]"
            strokeWidth="2.5"
            fill="transparent"
          />
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
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4">
          <motion.div 
            className={`leading-none text-[var(--accent)] select-none text-glow ${getFontClass()}`}
            animate={{ scale: isActive ? 1.04 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{ 
              fontSize: timerType === 'infinite' || (timerType === 'countdown' && timeLeft >= 3600)
                ? 'clamp(3rem, 10vw, 5.8rem)'
                : 'clamp(4rem, 14vw, 7.5rem)' 
            }}
          >
            {formatTime(timerType === 'countdown' ? timeLeft : elapsedSeconds)}
          </motion.div>

          {/* Current Subject & Mode Badge */}
          <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-secondary)] text-xs font-semibold text-[var(--text-secondary)] border border-[var(--border)]">
            <BookOpen size={12} className="text-[var(--accent)]" />
            <span>{currentSubjectTag}</span>
            <span className="text-[10px] opacity-60">
              • {timerType === 'countdown' ? `${Math.round(totalSessionSeconds / 60)}m` : 'Infinite Flow'}
            </span>
            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />}
          </div>
        </div>
      </div>

      {/* Motivational Quote during Zen Focus */}
      <AnimatePresence>
        {isActive && !isHovering && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.75, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="text-center text-xs sm:text-sm italic font-serif text-[var(--text-secondary)] max-w-md px-6 my-2"
          >
            "{MOTIVATIONAL_QUOTES[quoteIndex]}"
          </motion.p>
        )}
      </AnimatePresence>

      {/* Controls Bar */}
      <AnimatePresence>
        {(!isActive || isHovering) && (
          <motion.div 
            className="flex items-center gap-4 sm:gap-6 text-[var(--text-secondary)] z-30 my-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
          >
            {/* Settings (Countdown duration) */}
            {!isActive && timerType === 'countdown' && (
              <button 
                onClick={() => {
                  sounds.playClick();
                  setShowSettings(true);
                }} 
                className="p-3.5 rounded-full glass-panel border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors shadow-sm"
                title="Timer Duration & Font"
              >
                <Settings size={20} />
              </button>
            )}

            {/* Play / Pause Main Button */}
            <button 
              onClick={toggleTimer} 
              className={`rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:bg-[var(--accent-hover)] transition-all shadow-xl hover:scale-105 active:scale-95 ${
                isActive ? 'w-16 h-16 ring-4 ring-[var(--accent)]/30' : 'w-20 h-20'
              }`}
              title={isActive ? "Pause Focus (Space)" : "Start Focus (Space)"}
            >
              {isActive ? (
                <Pause size={26} fill="currentColor" />
              ) : (
                <Play size={32} fill="currentColor" className="ml-1.5" />
              )}
            </button>
            
            {/* Reset Button */}
            {(!isActive && (timerType === 'countdown' ? timeLeft !== totalSessionSeconds : elapsedSeconds > 0)) && (
              <button 
                onClick={resetTimer} 
                className="p-3.5 rounded-full glass-panel border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors shadow-sm" 
                title="Reset (R)"
              >
                <RotateCcw size={20} />
              </button>
            )}

            {/* In Infinite Mode: "Finish & Record Session" Button */}
            {timerType === 'infinite' && elapsedSeconds > 0 && (
              <button
                onClick={finishInfiniteSession}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-md flex items-center gap-1.5"
                title="Log this study session to your streak and hours"
              >
                <CheckCircle size={15} />
                <span>Finish & Record</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Presets Bar (Countdown mode only) */}
      <AnimatePresence>
        {!isActive && timerType === 'countdown' && (
          <motion.div 
            className="flex items-center gap-2 max-w-[94vw] overflow-x-auto hide-scrollbar z-20 my-2"
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
                className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
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

      {/* Homepage Watermark / Credit by Yaksh Verma */}
      <AnimatePresence>
        {(!isActive || isHovering) && (
          <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="mt-auto pt-4 flex flex-col items-center text-center text-[11px] text-[var(--text-secondary)] z-20"
          >
            <p className="flex items-center gap-1">
              Developed with 🤍 by <strong className="font-semibold text-[var(--text-primary)]">Yaksh Verma</strong>
            </p>
            <span className="text-[10px] opacity-60">
              Personal 10th CBSE Boards Study Web App • Topudy
            </span>
          </motion.footer>
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
              className="bg-[var(--bg-primary)] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[var(--border)] shadow-2xl text-center relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
                🌟
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-[var(--text-primary)] mb-2 font-bold">
                Session Logged, {studentName}!
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                You focused for <strong className="text-[var(--text-primary)]">{completedDurationDisplay}</strong> in <strong className="text-[var(--accent)]">{currentSubjectTag}</strong>. Your board preparation hours and daily streak have been updated!
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    sounds.playPop();
                    setShowCompletion(false); 
                    resetTimer(); 
                  }} 
                  className="flex-1 py-3.5 rounded-2xl bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-lg text-sm"
                >
                  Start Next Session
                </button>
                <button 
                  onClick={() => setShowCompletion(false)} 
                  className="px-5 py-3.5 rounded-2xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors text-sm"
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
        <h2 className="text-2xl font-serif mb-6 text-center text-[var(--text-primary)] font-bold">Timer Configuration</h2>
        
        <div className="space-y-5 mb-6">
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
              Default Countdown Duration (Minutes)
            </label>
            <input 
              type="number" 
              min="1"
              max="360"
              value={duration} 
              onChange={e => setDuration(Math.max(1, Number(e.target.value)))} 
              className="w-full p-3 text-center rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] outline-none focus:border-[var(--accent)] font-mono-timer font-bold text-lg" 
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
              Aesthetic Timer Font
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
          className="w-full py-3.5 rounded-xl bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors mb-2 shadow-md text-sm"
        >
          Save Settings
        </button>
        <button 
          onClick={onClose} 
          className="w-full py-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors text-xs"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
};
