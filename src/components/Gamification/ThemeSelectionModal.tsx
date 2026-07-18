import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppStore, type Theme } from '../../store';

const THEMES = [
  { id: 'ocean', label: 'Ocean', color: '#e0f2fe' },
  { id: 'coffee', label: 'Coffee', color: '#fff8f0' },
  { id: 'lavender', label: 'Lavender', color: '#f3e8ff' },
  { id: 'mint', label: 'Mint Breeze', color: '#f0fff4' },
  { id: 'rosewater', label: 'Rosewater', color: '#fff0f3' },
  { id: 'default', label: 'Matcha Light', color: '#fdfbf7' },
  { id: 'cloud-white', label: 'Cloud White', color: '#ffffff' },
  { id: 'midnight', label: 'Midnight Dark', color: '#121212' },
] as const;

export const ThemeSelectionModal = ({ onClose }: { onClose: () => void }) => {
  const { theme, setTheme } = useAppStore();

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

        <div className="mb-6">
          <h2 className="text-3xl font-serif text-[var(--text-primary)] text-center">Aesthetics</h2>
          <p className="text-sm text-[var(--text-secondary)] text-center mt-2">Customize your study space. All themes are free!</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto hide-scrollbar p-1">
          {THEMES.map((t) => {
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as Theme)}
                className={`relative p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 cursor-pointer hover:scale-105
                  ${theme === t.id ? 'border-[var(--accent)] bg-[var(--bg-secondary)] shadow-md' : 'border-[var(--border)] glass-panel hover:bg-[var(--bg-secondary)]'}
                `}
              >
                <div className="w-10 h-10 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: t.color }} />
                <span className="text-xs font-bold text-[var(--text-primary)] text-center leading-tight">{t.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
