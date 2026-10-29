import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BarChart2, Award, Clock, BookOpen } from 'lucide-react';
import { useAppStore } from '../../store';

export const AnalyticsModal = ({ onClose }: { onClose: () => void }) => {
  const { studySessions, syllabus, currentStreak } = useAppStore();
  const [tab, setTab] = useState<'daily' | 'weekly' | 'monthly' | 'board'>('daily');

  // Filter study sessions by tab
  const getStats = () => {
    const now = new Date();
    now.setHours(0,0,0,0);
    
    let totalSeconds = 0;
    const subjectMap: Record<string, number> = {};

    studySessions.forEach(session => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0,0,0,0);
      const diffDays = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

      let match = false;
      if (tab === 'daily' && diffDays === 0) match = true;
      else if (tab === 'weekly' && diffDays < 7) match = true;
      else if (tab === 'monthly' && diffDays < 30) match = true;
      else if (tab === 'board') match = true; // All time

      if (match) {
        totalSeconds += session.durationSeconds;
        const tag = session.subjectTag || 'General Focus';
        subjectMap[tag] = (subjectMap[tag] || 0) + session.durationSeconds;
      }
    });

    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);

    return { hours, mins, totalSeconds, subjectMap };
  };

  const stats = getStats();

  // 7-Day Bar Chart calculation
  const getLast7DaysData = () => {
    const result = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = days[d.getDay()];

      const seconds = studySessions
        .filter(s => s.date === dateStr)
        .reduce((sum, s) => sum + s.durationSeconds, 0);

      result.push({
        dayName,
        dateStr,
        hours: Math.round((seconds / 3600) * 10) / 10
      });
    }

    const maxHours = Math.max(1, ...result.map(r => r.hours));
    return { data: result, maxHours };
  };

  const chart = getLast7DaysData();

  // Calculate CBSE 10th Board Readiness Index (0 - 100%)
  let totalSyllabusItems = 0;
  let completedSyllabusItems = 0;
  let totalPyqs = 0;
  let completedPyqs = 0;

  syllabus.forEach(subject => {
    subject.chapters.forEach(chapter => {
      if (chapter.subtopics.length === 0) {
        totalSyllabusItems++;
        if (chapter.completed) completedSyllabusItems++;
      } else {
        chapter.subtopics.forEach(sub => {
          totalSyllabusItems++;
          if (sub.completed) completedSyllabusItems++;
          totalPyqs++;
          if (sub.pyqDone) completedPyqs++;
        });
      }
    });
  });

  const syllabusRatio = totalSyllabusItems > 0 ? (completedSyllabusItems / totalSyllabusItems) : 0;
  const pyqRatio = totalPyqs > 0 ? (completedPyqs / totalPyqs) : 0;
  const totalStudyHours = Math.floor(studySessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 3600);
  const hoursScore = Math.min(1, totalStudyHours / 100);
  const streakScore = Math.min(1, currentStreak / 30);

  // Weighted board readiness score
  const readinessScore = Math.min(100, Math.round(
    (syllabusRatio * 45) + (pyqRatio * 30) + (hoursScore * 15) + (streakScore * 10)
  ));

  const getReadinessTitle = (score: number) => {
    if (score >= 90) return { label: 'Distinction Master (95%+ Target)', color: 'text-emerald-600 bg-emerald-50' };
    if (score >= 70) return { label: 'Strong Board Foundation', color: 'text-blue-600 bg-blue-50' };
    if (score >= 40) return { label: 'Steady Progress', color: 'text-amber-600 bg-amber-50' };
    return { label: 'Aspirant Starting Out', color: 'text-purple-600 bg-purple-50' };
  };

  const readinessInfo = getReadinessTitle(readinessScore);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-[var(--bg-primary)] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--border)] w-full max-w-xl relative max-h-[88vh] overflow-y-auto hide-scrollbar"
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

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--accent)] border border-[var(--border)]">
            <BarChart2 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-serif text-[var(--text-primary)]">Board Analytics</h2>
            <p className="text-xs text-[var(--text-secondary)]">Class 10 CBSE study metrics & readiness</p>
          </div>
        </div>

        {/* Board Readiness Score Card */}
        <div className="mb-6 glass-panel p-5 rounded-2xl border border-[var(--border)] shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold flex items-center gap-1.5">
              <Award size={14} className="text-yellow-500" /> CBSE Board Readiness Index
            </span>
            <span className="text-2xl font-serif font-bold text-[var(--accent)] font-mono-timer">{readinessScore}%</span>
          </div>

          <div className="w-full h-2.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden mb-3">
            <motion.div 
              className="h-full bg-gradient-to-r from-[var(--accent)] to-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${readinessScore}%` }}
              transition={{ duration: 1 }}
            />
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${readinessInfo.color}`}>
              {readinessInfo.label}
            </span>
            <span className="text-[var(--text-secondary)]">
              {completedSyllabusItems}/{totalSyllabusItems} concepts done
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-[var(--bg-secondary)] p-1 rounded-2xl">
          {[
            { id: 'daily', label: 'Today' },
            { id: 'weekly', label: 'Past 7d' },
            { id: 'monthly', label: '30 Days' },
            { id: 'board', label: 'All Time' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                tab === t.id 
                  ? 'bg-[var(--bg-primary)] text-[var(--accent)] shadow-sm' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Primary Stat Display */}
        <div className="flex flex-col items-center justify-center py-6 glass-panel rounded-2xl border border-[var(--border)] mb-6 text-center">
          <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Clock size={14} className="text-[var(--accent)]" /> Focused Study Time
          </span>
          <div className="text-4xl sm:text-5xl font-mono-timer font-bold text-[var(--accent)] mb-1">
            {stats.hours}<span className="text-xl sm:text-2xl text-[var(--text-secondary)] font-normal ml-0.5 mr-2">h</span> 
            {stats.mins}<span className="text-xl sm:text-2xl text-[var(--text-secondary)] font-normal ml-0.5">m</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] opacity-70">
            Dedicated board prep hours (excluding breaks)
          </p>
        </div>

        {/* 7-Day Activity Bar Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-[var(--border)] mb-6">
          <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-4">
            Last 7 Days Study Trend
          </span>

          <div className="flex items-end justify-between gap-2 h-36 pt-4 px-2">
            {chart.data.map((bar, idx) => {
              const heightPercent = chart.maxHours > 0 ? (bar.hours / chart.maxHours) * 100 : 0;
              const isToday = idx === chart.data.length - 1;

              return (
                <div key={bar.dateStr} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] text-[var(--text-secondary)] font-mono-timer">
                    {bar.hours > 0 ? `${bar.hours}h` : ''}
                  </span>
                  <div className="w-full bg-[var(--bg-secondary)] rounded-t-lg h-24 flex items-end overflow-hidden">
                    <motion.div 
                      className={`w-full rounded-t-lg ${isToday ? 'bg-[var(--accent)]' : 'bg-[var(--accent)]/60'}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(4, heightPercent)}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                    />
                  </div>
                  <span className={`text-[10px] font-semibold ${isToday ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-secondary)]'}`}>
                    {bar.dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject-Wise Study Distribution */}
        {Object.keys(stats.subjectMap).length > 0 && (
          <div className="glass-panel p-5 rounded-2xl border border-[var(--border)]">
            <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-3 flex items-center gap-1.5">
              <BookOpen size={14} className="text-[var(--accent)]" /> Subject Breakdown
            </span>

            <div className="space-y-2.5">
              {Object.entries(stats.subjectMap).map(([subj, seconds]) => {
                const hours = Math.round((seconds / 3600) * 10) / 10;
                const percent = stats.totalSeconds > 0 ? Math.round((seconds / stats.totalSeconds) * 100) : 0;

                return (
                  <div key={subj}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-[var(--text-primary)]">{subj}</span>
                      <span className="text-[var(--text-secondary)] font-mono-timer">{hours}h ({percent}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
