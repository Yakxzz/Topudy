import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SplashScreen } from './components/SplashScreen';
import { Layout } from './components/Layout';
import { TimerView } from './components/Timer/TimerView';
import { TasksView } from './components/Tasks/TasksView';
import { SyllabusView } from './components/Syllabus/SyllabusView';
import { OnboardingModal } from './components/Gamification/OnboardingModal';
import { PaywallModal } from './components/Gamification/PaywallModal';
import { CERTIFICATES } from './components/Gamification/certificatesData';
import { useAppStore } from './store';

function App() {
  const [activeTab, setActiveTab] = useState('timer');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const { 
    checkStreakStatus,
    studySessions,
    currentStreak,
    tasks,
    syllabus,
    unlockedCertificates,
    unlockCertificate,
    isPremium,
    trialTimeUsed,
    incrementTrialTime,
    showPaywall,
    setShowPaywall,
    userName,
    hasSeenSplash
  } = useAppStore();

  const [hasShownPaywallThisSession, setHasShownPaywallThisSession] = useState(false);

  useEffect(() => {
    checkStreakStatus();
    
    const interval = setInterval(() => checkStreakStatus(), 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [checkStreakStatus]);

  useEffect(() => {
    let interval: number | null = null;
    if (!isPremium && trialTimeUsed < 600) {
      interval = window.setInterval(() => {
        incrementTrialTime();
      }, 1000);
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isPremium, trialTimeUsed, incrementTrialTime]);

  useEffect(() => {
    if (!isPremium && trialTimeUsed >= 600 && !hasShownPaywallThisSession) {
      setShowPaywall(true);
      setHasShownPaywallThisSession(true);
    }
  }, [isPremium, trialTimeUsed, hasShownPaywallThisSession]);

  useEffect(() => {
    const totalSeconds = studySessions.reduce((acc, s) => acc + s.durationSeconds, 0);
    const totalHours = totalSeconds / 3600;
    const completedTasks = tasks.filter(t => t.completed).length;
    
    let completedSubtopics = 0;
    syllabus.forEach(sub => {
      sub.chapters.forEach(chap => {
        chap.subtopics.forEach(st => {
          if (st.completed) completedSubtopics++;
        });
      });
    });

    CERTIFICATES.forEach(cert => {
      if (unlockedCertificates.includes(cert.id)) return;

      let shouldUnlock = false;
      if (cert.type === 'hours' && totalHours >= cert.threshold) shouldUnlock = true;
      if (cert.type === 'streak' && currentStreak >= cert.threshold) shouldUnlock = true;
      if (cert.type === 'tasks' && completedTasks >= cert.threshold) shouldUnlock = true;
      if (cert.type === 'syllabus' && completedSubtopics >= cert.threshold) shouldUnlock = true;

      if (shouldUnlock) {
        unlockCertificate(cert.id);
      }
    });
  }, [studySessions, currentStreak, tasks, syllabus, unlockedCertificates, unlockCertificate]);

  const renderContent = () => {
    switch(activeTab) {
      case 'timer': return <TimerView setIsTimerActive={setIsTimerActive} />;
      case 'tasks': return <TasksView />;
      case 'syllabus': return <SyllabusView />;
      default: return <TimerView setIsTimerActive={setIsTimerActive} />;
    }
  };

  return (
    <div className="h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden">
      <SplashScreen />
      
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} hideNav={isTimerActive}>
        <main className="h-full relative overflow-hidden">
          {renderContent()}
        </main>
      </Layout>

      <AnimatePresence>
        {!userName && (
          <OnboardingModal />
        )}
        {showPaywall && (
          <PaywallModal onClose={() => setShowPaywall(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
