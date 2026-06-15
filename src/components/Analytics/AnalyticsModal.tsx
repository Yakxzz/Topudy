import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BarChart2 } from 'lucide-react';
import { useAppStore } from '../../store';

export const AnalyticsModal = ({ onClose }: { onClose: () => void }) => {
  const { studySessions } = useAppStore();
  const [tab, setTab] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  const getStats = () => {
    const now = new Date();
    now.setHours(0,0,0,0);
    
    let totalSeconds = 0;

    studySessions.forEach(session => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0,0,0,0);
      const diffDays = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (tab === 'daily' && diffDays === 0) totalSeconds += session.durationSeconds;
      else if (tab === 'weekly' && diffDays < 7) totalSeconds += session.durationSeconds;
      else if (tab === 'monthly' && diffDays < 30) totalSeconds += session.durationSeconds;
      else if (tab === 'yearly' && diffDays < 365) totalSeconds += session.durationSeconds;
    });

    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);

    return { hours, mins };
  };

  const stats = getStats();

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

        <div className="flex items-center gap-3 mb-8">
          <BarChart2 className="text-[var(--accent)]" size={32} />
          <h2 className="text-2xl font-serif text-[var(--text-primary)]">Progress</h2>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-[var(--bg-secondary)] p-1 rounded-xl">
          {(['daily', 'weekly', 'monthly', 'yearly'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${tab === t ? 'bg-[var(--bg-primary)] text-[var(--accent)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Stats Display */}
        <div className="flex flex-col items-center justify-center py-12 glass-panel rounded-2xl border border-[var(--border)]">
          <span className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4">Total Study Time</span>
          <div className="text-5xl font-serif text-[var(--accent)] mb-2">
            {stats.hours}<span className="text-2xl text-[var(--text-secondary)]">h</span> {stats.mins}<span className="text-2xl text-[var(--text-secondary)]">m</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] opacity-70">Excluding breaks</p>
        </div>
      </motion.div>
    </motion.div>
  );
};
