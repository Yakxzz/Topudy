import { motion } from 'framer-motion';
import { X, Flame, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../../store';

export const GamificationModal = ({ onClose }: { onClose: () => void }) => {
  const { currentStreak, previousStreakToRestore, streakRestoresAvailable, restoreStreak } = useAppStore();

  return (
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
        <div className="flex flex-col items-center justify-center mb-6 mt-4">
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

        {/* Restore Mechanic */}
        {previousStreakToRestore > 0 && streakRestoresAvailable > 0 && (
          <div className="p-4 border border-orange-200 bg-orange-50 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-orange-500" size={24} />
              <div>
                <p className="text-sm font-bold text-orange-800">Streak Broken!</p>
                <p className="text-xs text-orange-600">Restore your {previousStreakToRestore}-day streak?</p>
              </div>
            </div>
            <button onClick={restoreStreak} className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors">
              Restore (1 Left)
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
