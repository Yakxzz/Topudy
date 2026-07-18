import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store';

export const OnboardingModal = () => {
  const [name, setName] = useState('');
  const { userName, setUserName } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setUserName(name.trim());
    }
  };

  // If user already has a name, we don't render this modal
  if (userName) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-[var(--bg-primary)] rounded-3xl p-8 shadow-2xl border border-[var(--border)] w-[90%] max-w-md text-center"
          initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: -50, scale: 0.9 }}
        >
          <h2 className="text-3xl font-serif mb-4 text-[var(--text-primary)]">Welcome to Topudy</h2>
          <p className="text-[var(--text-secondary)] mb-6 text-sm">
            Please enter your name to begin.
            <br/>
            <span className="text-orange-500/80 font-medium italic mt-2 block">
              Note: This name will be used on your digital certificates.
            </span>
          </p>
          
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 mb-6 text-center rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all font-serif text-lg"
              required
              autoFocus
            />
            
            <button 
              type="submit" 
              disabled={!name.trim()}
              className="w-full py-4 rounded-xl bg-[var(--accent)] text-white font-bold tracking-widest uppercase hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
            >
              Confirm
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
