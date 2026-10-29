import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import { sounds } from '../utils/soundEffects';

export const SplashScreen: React.FC = () => {
  const { hasSeenSplash, setHasSeenSplash } = useAppStore();
  const [showSplash, setShowSplash] = useState(!hasSeenSplash);

  useEffect(() => {
    if (hasSeenSplash) setShowSplash(false);
  }, [hasSeenSplash]);

  const handleEnter = async () => {
    sounds.playPop();
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      // ignore
    }
    setShowSplash(false);
    setTimeout(() => {
      setHasSeenSplash(true);
    }, 500);
  };

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fdfbf7] text-[#3d3b38] p-6 text-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-[#7a7671] font-semibold mb-3">
              Personal Study Companion
            </span>
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-serif tracking-widest mb-3 text-[#3d3b38]">
              Topudy
            </h1>
            <p className="text-sm font-sans text-[#7a7671] max-w-sm mb-12">
              Aesthetic 10th CBSE Boards Study Management & Revision Hub
            </p>
          </motion.div>
          
          <motion.button
            onClick={handleEnter}
            className="px-8 py-3.5 rounded-full border border-[#e6e2db] hover:bg-[#f4f0ea] transition-all duration-300 tracking-widest text-xs uppercase glass-panel font-semibold shadow-sm hover:scale-105 active:scale-95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Enter Zen Study Space
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
