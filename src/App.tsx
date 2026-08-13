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
    checkStreakStatus();
    const interval = setInterval(() => checkStreakStatus(), 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [checkStreakStatus]);

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
    </div>
  );
}

export default App;
