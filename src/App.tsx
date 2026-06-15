import React, { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Layout } from './components/Layout';
import { TimerView } from './components/Timer/TimerView';
import { TasksView } from './components/Tasks/TasksView';
import { SyllabusView } from './components/Syllabus/SyllabusView';

function App() {
  const [activeTab, setActiveTab] = useState('timer');

  return (
    <>
      <SplashScreen />
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'timer' && <TimerView />}
        {activeTab === 'tasks' && <TasksView />}
        {activeTab === 'syllabus' && <SyllabusView />}
      </Layout>
    </>
  );
}

export default App;
