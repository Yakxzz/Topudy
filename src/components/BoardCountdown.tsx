import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Target, Edit3, X, Check } from 'lucide-react';
import { useAppStore } from '../store';

export const BoardCountdown: React.FC = () => {
  const { cbseExamDate, setCbseExamDate, dailyStudyGoalHours, setDailyStudyGoalHours, studySessions } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [inputDate, setInputDate] = useState(cbseExamDate);
  const [inputGoal, setInputGoal] = useState(dailyStudyGoalHours);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const examTime = new Date(cbseExamDate).getTime();
      const now = new Date().getTime();
      const diff = examTime - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        setTimeLeft({ days, hours, minutes });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [cbseExamDate]);

  // Today's studied hours
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySeconds = studySessions
    .filter(s => s.date === todayStr)
    .reduce((acc, s) => acc + s.durationSeconds, 0);
  const todayHours = (todaySeconds / 3600).toFixed(1);
  const goalProgress = Math.min(100, Math.round(((todaySeconds / 3600) / (dailyStudyGoalHours || 1)) * 100));

  const handleSave = () => {
    setCbseExamDate(inputDate);
    setDailyStudyGoalHours(Number(inputGoal) || 4);
    setShowModal(false);
  };

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="glass-panel px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[var(--border)] shadow-sm flex items-center gap-3 cursor-pointer hover:border-[var(--accent)] transition-all group shrink-0"
        title="CBSE Class 10 Board Exam Countdown & Goal"
      >
        <div className="flex items-center gap-1.5 text-xs text-[var(--accent)] font-semibold">
          <Calendar size={14} />
          <span className="font-mono-timer font-bold text-sm text-[var(--text-primary)]">{timeLeft.days}</span>
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">Days to Boards</span>
        </div>

        <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[var(--border)]">
          <Target size={13} className="text-orange-500" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[var(--text-secondary)] font-medium">
              Goal: {todayHours}/{dailyStudyGoalHours}h
            </span>
          </div>
          <div className="w-12 h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: `${goalProgress}%` }} />
          </div>
        </div>

        <Edit3 size={12} className="text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-[var(--bg-primary)] rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-[var(--border)] shadow-2xl relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X size={20} />
              </button>

              <h3 className="text-xl font-serif text-[var(--text-primary)] mb-1">Board Prep Target</h3>
              <p className="text-xs text-[var(--text-secondary)] mb-6">Customize your 10th CBSE target countdown & daily goal.</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1.5">
                    CBSE Board Exam Date
                  </label>
                  <input 
                    type="date" 
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1.5">
                    Daily Study Target (Hours)
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    max="16"
                    step="0.5"
                    value={inputGoal}
                    onChange={(e) => setInputGoal(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleSave}
                  className="flex-1 py-3 bg-[var(--accent)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Check size={16} /> Save Target
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
