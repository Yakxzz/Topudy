import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Award, Clock, BookOpen } from 'lucide-react';
import { useAppStore } from '../../store';
import type { Theme } from '../../store';
import { CertificateModal } from '../Certificates/CertificateModal';

const THEMES = [
  { id: 'default', label: 'Matcha Light', color: '#fdfbf7', accent: '#a3b18a' },
  { id: 'cloud-white', label: 'Cloud White', color: '#ffffff', accent: '#a1c4fd' },
  { id: 'rosewater', label: 'Rosewater', color: '#fff0f3', accent: '#ff8fa3' },
  { id: 'midnight', label: 'Midnight Dark', color: '#121212', accent: '#bb86fc' },
] as const;

export const GamificationModal = ({ onClose }: { onClose: () => void }) => {
  const { currentStreak, theme, setTheme, certificates, studySessions, studentName } = useAppStore();
  const [showCertificates, setShowCertificates] = useState(false);

  const totalStudySeconds = studySessions.reduce((sum, s) => sum + s.durationSeconds, 0);
  const totalHours = Math.floor(totalStudySeconds / 3600);

  return (
    <>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-[var(--bg-primary)] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--border)] w-full max-w-md relative max-h-[88vh] overflow-y-auto hide-scrollbar"
          initial={{ y: 30, scale: 0.95 }} 
          animate={{ y: 0, scale: 1 }} 
          exit={{ y: 20, scale: 0.95 }}
        >
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1"
          >
            <X size={22} />
          </button>

          {/* Student Profile Header */}
          <div className="flex flex-col items-center justify-center mb-6 mt-2">
            <motion.div 
              className="w-20 h-20 rounded-full glass-panel flex items-center justify-center mb-3 text-orange-500 shadow-inner border border-orange-200"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
            >
              <Flame size={40} fill="currentColor" />
            </motion.div>
            
            <h2 className="text-3xl font-serif text-[var(--text-primary)] font-bold">
              {currentStreak} <span className="text-lg text-[var(--text-secondary)] font-sans font-normal">Day Streak</span>
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1 text-center">
              Scholar: <span className="font-semibold text-[var(--text-primary)]">{studentName}</span>
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="glass-panel p-3.5 rounded-2xl border border-[var(--border)] text-center">
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold flex items-center justify-center gap-1">
                <Clock size={12} className="text-[var(--accent)]" /> Total Hours
              </span>
              <p className="text-xl font-mono-timer font-bold text-[var(--accent)] mt-1">{totalHours}h</p>
            </div>

            <div className="glass-panel p-3.5 rounded-2xl border border-[var(--border)] text-center">
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold flex items-center justify-center gap-1">
                <BookOpen size={12} className="text-blue-500" /> Focus Sessions
              </span>
              <p className="text-xl font-mono-timer font-bold text-blue-500 mt-1">{studySessions.length}</p>
            </div>
          </div>

          {/* View Certificates Button */}
          <div className="mb-6">
             <button 
                onClick={() => setShowCertificates(true)}
                className="w-full py-3.5 px-4 flex items-center justify-between glass-panel rounded-2xl border border-[var(--border)] text-[var(--text-primary)] font-bold hover:bg-[var(--bg-secondary)] transition-all shadow-sm group"
             >
                <div className="flex items-center gap-2.5">
                  <Award size={22} className="text-yellow-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Board Honors & Certificates</span>
                </div>
                <span className="text-xs font-mono-timer bg-[var(--bg-secondary)] px-2.5 py-1 rounded-full text-[var(--accent)] font-bold">
                  {certificates.length}
                </span>
             </button>
          </div>

          {/* Aesthetics / Themes */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3">
              Study Themes (All Free)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as Theme)}
                  className={`relative p-3.5 rounded-2xl border transition-all duration-200 flex flex-col items-center gap-2 cursor-pointer hover:scale-[1.02]
                    ${theme === t.id 
                      ? 'border-[var(--accent)] bg-[var(--bg-secondary)] shadow-sm ring-1 ring-[var(--accent)]' 
                      : 'border-[var(--border)] glass-panel hover:border-[var(--accent)]/50'}
                  `}
                >
                  <div 
                    className="w-7 h-7 rounded-full border border-black/10 shadow-sm flex items-center justify-center" 
                    style={{ backgroundColor: t.color }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.accent }} />
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-primary)]">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Watermark in Profile Modal */}
          <div className="pt-3 border-t border-[var(--border)] text-center">
            <p className="text-xs text-[var(--text-secondary)]">
              Crafted with 🤍 by <strong className="font-semibold text-[var(--text-primary)]">Yaksh Verma</strong>
            </p>
            <span className="text-[10px] text-[var(--text-secondary)] opacity-60">
              For 10th CBSE Scholars • Topudy App
            </span>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
         {showCertificates && <CertificateModal onClose={() => setShowCertificates(false)} />}
      </AnimatePresence>
    </>
  );
};
