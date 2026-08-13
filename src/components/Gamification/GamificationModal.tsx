import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Award } from 'lucide-react';
import { useAppStore } from '../../store';
import type { Theme } from '../../store';
import { CertificateModal } from '../Certificates/CertificateModal';

const THEMES = [
  { id: 'default', label: 'Matcha Light', color: '#fdfbf7' },
  { id: 'cloud-white', label: 'Cloud White', color: '#ffffff' },
  { id: 'rosewater', label: 'Rosewater', color: '#fff0f3' },
  { id: 'midnight', label: 'Midnight Dark', color: '#121212' },
] as const;

export const GamificationModal = ({ onClose }: { onClose: () => void }) => {
  const { currentStreak, theme, setTheme, certificates } = useAppStore();
  const [showCertificates, setShowCertificates] = useState(false);

  return (
    <>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-[var(--bg-primary)] rounded-3xl p-8 shadow-2xl border border-[var(--border)] w-[90%] max-w-md relative"
          initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <X size={24} />
          </button>

          {/* Streak Header */}
          <div className="flex flex-col items-center justify-center mb-10 mt-4">
            <motion.div 
              className="w-24 h-24 rounded-full glass-panel flex items-center justify-center mb-4 text-orange-500 shadow-inner"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Flame size={48} fill="currentColor" />
            </motion.div>
            <h2 className="text-4xl font-serif text-[var(--text-primary)]">{currentStreak} <span className="text-xl text-[var(--text-secondary)] font-sans">Days</span></h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2 text-center">Study 30+ mins daily to grow your streak!</p>
          </div>

          {/* View Certificates Button */}
          <div className="mb-8 flex justify-center">
             <button 
                onClick={() => setShowCertificates(true)}
                className="w-full py-4 flex items-center justify-center gap-3 glass-panel rounded-2xl border border-[var(--border)] text-[var(--text-primary)] font-bold hover:bg-[var(--bg-secondary)] transition-colors"
             >
                <Award size={24} className="text-yellow-500" />
                View Earned Certificates ({certificates.length})
             </button>
          </div>

          {/* Themes (All Free) */}
          <div>
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4">Aesthetics</h3>
            <div className="grid grid-cols-2 gap-4">
              {THEMES.map((t) => {
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as Theme)}
                    className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 cursor-pointer hover:scale-105
                      ${theme === t.id ? 'border-[var(--accent)] bg-[var(--bg-secondary)] shadow-sm' : 'border-[var(--border)] glass-panel'}
                    `}
                  >
                    <div className="w-8 h-8 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: t.color }} />
                    <span className="text-xs font-bold text-[var(--text-primary)]">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
         {showCertificates && <CertificateModal onClose={() => setShowCertificates(false)} />}
      </AnimatePresence>
    </>
  );
};
