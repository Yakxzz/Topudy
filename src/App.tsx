import { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Layout } from './components/Layout';
import { TimerView } from './components/Timer/TimerView';
import { TasksView } from './components/Tasks/TasksView';
import { SyllabusView } from './components/Syllabus/SyllabusView';
import { useAppStore } from './store';

function App() {
  const [activeTab, setActiveTab] = useState('timer');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const { checkStreakStatus } = useAppStore();

  useEffect(() => {
    // Check streak status on app load
    checkStreakStatus();
    
    // Periodically check (every hour) to see if a day rolled over while open
    const interval = setInterval(() => checkStreakStatus(), 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [checkStreakStatus]);

  return (
    <>
      <SplashScreen />
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} hideNav={isTimerActive}>
        {activeTab === 'timer' && <TimerView setIsTimerActive={setIsTimerActive} />}
        {activeTab === 'tasks' && <TasksView />}
        {activeTab === 'syllabus' && <SyllabusView />}
      </Layout>
    </>
  );
}

export default App;
