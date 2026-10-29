import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import { sounds } from '../utils/soundEffects';
import { ArrowRight, Sparkles, User, Edit2 } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { studentName, setStudentName } = useAppStore();
  
  // Show splash screen every time user opens or reloads the web app
  const [showSplash, setShowSplash] = useState(true);
  const isDefaultName = !studentName || studentName === 'Class 10 CBSE Scholar';
  
  const [inputName, setInputName] = useState(isDefaultName ? '' : studentName);
  const [isEditingName, setIsEditingName] = useState(isDefaultName);

  const handleEnter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sounds.playPop();

    if (inputName.trim()) {
      setStudentName(inputName.trim());
    } else if (isDefaultName) {
      setStudentName('CBSE Scholar');
    }

    try {
      if (document.documentElement.requestFullscreen && window.innerWidth < 768) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (err) {
      // ignore
    }

    setShowSplash(false);
  };

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[var(--bg-primary)] text-[var(--text-primary)] p-6 sm:p-10 text-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Top subtle badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-[var(--border)] text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)] shadow-sm"
          >
            <Sparkles size={12} className="text-yellow-500" />
            <span>Class 10 CBSE Board Companion</span>
          </motion.div>

          {/* Center: Unique Brand Logo + Name Input or Greeting */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col items-center max-w-md w-full my-auto py-6"
          >
            {/* Unique Topudy Logo */}
            <motion.div 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 bg-gradient-to-tr from-[#3a5a40] via-[#588157] to-[#a3b18a] shadow-xl flex items-center justify-center mb-6"
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <div className="w-full h-full rounded-[22px] bg-[#283618] flex items-center justify-center relative overflow-hidden border border-white/20">
                <span className="text-4xl sm:text-5xl select-none">📖</span>
                <span className="absolute top-2 right-2 text-base select-none">✨</span>
              </div>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl font-serif tracking-widest mb-2 text-[var(--text-primary)] font-bold">
              Topudy
            </h1>
            <p className="text-xs sm:text-sm font-sans text-[var(--text-secondary)] max-w-xs mb-8">
              Aesthetic study sanctuary & 10th CBSE Board revision management
            </p>

            {/* Name Form if default / editing */}
            {isEditingName ? (
              <form onSubmit={handleEnter} className="w-full space-y-4">
                <div className="text-left">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-2 text-center">
                    What is your name, Scholar?
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-secondary)]">
                      <User size={18} />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Enter your name (e.g. Aryan, Ananya)..." 
                      value={inputName}
                      onChange={e => setInputName(e.target.value)}
                      autoFocus
                      required
                      className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] outline-none focus:border-[var(--accent)] text-sm shadow-inner text-center font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-[var(--accent)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>Begin My 10th Board Journey</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <div className="w-full space-y-5">
                <div className="p-4 rounded-2xl glass-panel border border-[var(--border)] shadow-sm">
                  <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                    Welcome Back, Scholar
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-2xl font-serif font-bold text-[var(--text-primary)]">
                      {studentName}
                    </h2>
                    <button 
                      onClick={() => setIsEditingName(true)}
                      className="p-1 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                      title="Change Name"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleEnter()}
                  className="w-full py-4 rounded-2xl bg-[var(--accent)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>Enter Zen Study Space</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
          
          {/* Bottom Watermark */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center gap-1 text-center"
          >
            <p className="text-xs text-[var(--text-secondary)] font-medium">
              Developed with 🤍 for 10th CBSE Scholars by <strong className="text-[var(--text-primary)] font-semibold">Yaksh Verma</strong>
            </p>
            <span className="text-[10px] text-[var(--text-secondary)] opacity-60">
              Personal Web App • 100% Free & Open Study Tracker
            </span>
          </motion.footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
