import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckSquare, Clock, Download, X } from 'lucide-react';
import { useAppStore } from '../store';
import { GamificationModal } from './Gamification/GamificationModal';
import { BoardCountdown } from './BoardCountdown';
import { AudioPlayer } from './Timer/AudioPlayer';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (t: string) => void;
  hideNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, hideNav = false }) => {
  const { theme, studentName, currentStreak } = useAppStore();
  const [isUIVisible, setIsUIVisible] = useState(true);
  const hideTimeoutRef = useRef<number | null>(null);
  const [showGamification, setShowGamification] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    document.body.className = theme === 'default' ? '' : `theme-${theme}`;
  }, [theme]);

  // PWA Install prompt listener
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  // Auto-hide UI logic (Zen Focus Mode)
  useEffect(() => {
    if (hideNav) return;

    const resetTimer = () => {
      setIsUIVisible(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = window.setTimeout(() => {
        setIsUIVisible(false);
      }, 4500); // 4.5 seconds of inactivity
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('touchstart', resetTimer);
    window.addEventListener('keydown', resetTimer);
    
    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [hideNav]);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Top Bar: CBSE Countdown on Left/Center, Install & Profile on Right */}
      <AnimatePresence>
        {isUIVisible && !hideNav && (
          <motion.header
            className="absolute top-3 sm:top-5 left-3 sm:left-6 right-3 sm:right-6 z-40 flex items-center justify-between pointer-events-none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Left: Board Exam Countdown Widget */}
            <div className="pointer-events-auto">
              <BoardCountdown />
            </div>

            {/* Right: Install App Button & Student Profile Pill */}
            <div className="pointer-events-auto flex items-center gap-2">
              {/* Install / Download Web App Pill */}
              <button
                onClick={handleInstallClick}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-all shadow-sm"
                title="Install Topudy on PC / Mobile"
              >
                <Download size={13} className="text-[var(--accent)]" />
                <span>Save App</span>
              </button>

              {/* Student Profile Pill */}
              <div 
                onClick={() => setShowGamification(true)}
                className="flex items-center gap-2 bg-[var(--bg-secondary)] rounded-full p-1.5 pr-3 sm:pr-4 border border-[var(--border)] shadow-sm cursor-pointer hover:scale-105 transition-transform"
                title="Student Profile & Honours"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white shrink-0 font-serif font-bold text-xs sm:text-sm shadow-sm">
                  {studentName.charAt(0) || 'S'}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[var(--text-primary)] truncate max-w-[100px] sm:max-w-[130px]">
                    {studentName}
                  </span>
                  <span className="text-[10px] text-orange-500 font-semibold uppercase tracking-wider font-mono-timer hidden sm:inline">
                    🔥 {currentStreak}d streak
                  </span>
                </div>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main Content Area - Native smooth vertical scroll */}
      <div className="flex-1 w-full h-full overflow-y-auto z-0 transition-all duration-300 pt-16 sm:pt-20 pb-28">
        {children}
      </div>

      {/* Ambient Audio Player */}
      <AudioPlayer />

      {/* Student Profile & Gamification Modal */}
      <AnimatePresence>
         {showGamification && <GamificationModal onClose={() => setShowGamification(false)} />}
      </AnimatePresence>

      {/* Install PWA Modal */}
      <AnimatePresence>
        {showInstallModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-[var(--bg-primary)] rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-[var(--border)] shadow-2xl relative text-center"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <button 
                onClick={() => setShowInstallModal(false)}
                className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1"
              >
                <X size={20} />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner border border-[var(--border)]">
                📲
              </div>

              <h3 className="text-xl font-serif text-[var(--text-primary)] font-bold mb-2">
                Download & Save Topudy
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mb-5 leading-relaxed">
                You can save Topudy as a native desktop or mobile app to study offline without opening a browser!
              </p>

              <div className="space-y-3 text-left text-xs bg-[var(--bg-secondary)]/60 p-4 rounded-2xl border border-[var(--border)] mb-6">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[var(--accent)]">•</span>
                  <span><strong>Chrome / Edge (PC):</strong> Click the install icon in the address bar or menu.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[var(--accent)]">•</span>
                  <span><strong>iPhone (Safari):</strong> Tap the <em>Share</em> button and choose <em>"Add to Home Screen"</em>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[var(--accent)]">•</span>
                  <span><strong>Android:</strong> Tap the 3-dots menu and select <em>"Install App"</em>.</span>
                </div>
              </div>

              <button
                onClick={() => setShowInstallModal(false)}
                className="w-full py-3 bg-[var(--accent)] text-white font-semibold text-xs rounded-xl hover:bg-[var(--accent-hover)] transition-colors shadow-md"
              >
                Got It!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <AnimatePresence>
        {!hideNav && (
          <motion.nav
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 glass-panel rounded-full px-7 py-2.5 sm:py-3 flex items-center gap-9 shadow-2xl border border-[var(--border)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isUIVisible ? 1 : 0, y: isUIVisible ? 0 : 20 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            <NavButton 
              icon={<Clock />} 
              label="Timer" 
              active={activeTab === 'timer'} 
              onClick={() => setActiveTab('timer')} 
            />
            <NavButton 
              icon={<CheckSquare />} 
              label="Targets" 
              active={activeTab === 'tasks'} 
              onClick={() => setActiveTab('tasks')} 
            />
            <NavButton 
              icon={<BookOpen />} 
              label="Syllabus" 
              active={activeTab === 'syllabus'} 
              onClick={() => setActiveTab('syllabus')} 
            />
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavButton = ({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ReactElement<{ size?: number }>, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-200 select-none ${
      active 
        ? 'text-[var(--accent)] scale-110 font-bold' 
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
    }`}
  >
    {React.cloneElement(icon, { size: 20 })}
    <span className="text-[10px] uppercase tracking-wider">{label}</span>
  </button>
);
