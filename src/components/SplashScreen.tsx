import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';

export const SplashScreen: React.FC = () => {
  const { hasSeenSplash, setHasSeenSplash } = useAppStore();
  const [showSplash, setShowSplash] = useState(!hasSeenSplash);

  useEffect(() => {
    if (hasSeenSplash) setShowSplash(false);
  }, [hasSeenSplash]);

  const handleEnter = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen request failed", err);
    }
    setShowSplash(false);
    setTimeout(() => {
      setHasSeenSplash(true);
    }, 500); // Wait for exit animation
  };

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fdfbf7] text-[#3d3b38]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-serif tracking-widest mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Topudy
          </motion.h1>
          
          <motion.button
            onClick={handleEnter}
            className="px-8 py-3 rounded-full border border-[#e6e2db] hover:bg-[#f4f0ea] transition-colors duration-300 tracking-widest text-sm uppercase glass-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            Enter Workspace
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
