import { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Layout } from './components/Layout';
import { TimerView } from './components/Timer/TimerView';
import { TasksView } from './components/Tasks/TasksView';
import { SyllabusView } from './components/Syllabus/SyllabusView';
import { OnboardingModal } from './components/Gamification/OnboardingModal';
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
    unlockCertificate
  } = useAppStore();

  useEffect(() => {
    // Check streak status on app load
    checkStreakStatus();
    
    // Periodically check (every hour) to see if a day rolled over while open
    const interval = setInterval(() => checkStreakStatus(), 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [checkStreakStatus]);

  // Certificate Unlocking Logic
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

  return (
    <>
      <SplashScreen />
      <OnboardingModal />
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} hideNav={isTimerActive}>
        {activeTab === 'timer' && <TimerView setIsTimerActive={setIsTimerActive} />}
        {activeTab === 'tasks' && <TasksView />}
        {activeTab === 'syllabus' && <SyllabusView />}
      </Layout>
    </>
  );
}

export default App;
