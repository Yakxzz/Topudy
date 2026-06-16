import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store';

export const TasksView: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask, syllabus } = useAppStore();
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  const [showAdd, setShowAdd] = useState(false);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');

  const filteredTasks = tasks.filter(t => t.isDaily === (activeTab === 'daily'));

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim() || selectedSubtopic || selectedChapter || selectedSubject) {
      // If user selected from syllabus but didn't type title, auto-generate title
      let title = newTaskTitle.trim();
      if (!title) {
        if (selectedSubtopic) {
          const subject = syllabus.find(s => s.id === selectedSubject);
          const chapter = subject?.chapters.find(c => c.id === selectedChapter);
          const sub = chapter?.subtopics.find(st => st.id === selectedSubtopic);
          title = sub?.title || 'Untitled Task';
        } else if (selectedChapter) {
          const subject = syllabus.find(s => s.id === selectedSubject);
          const chapter = subject?.chapters.find(c => c.id === selectedChapter);
          title = chapter?.title || 'Untitled Task';
        } else if (selectedSubject) {
          const subject = syllabus.find(s => s.id === selectedSubject);
          title = subject?.title || 'Untitled Task';
        } else {
          return; // No title and no link
        }
      }

      addTask({
        title,
        isDaily: activeTab === 'daily',
        linkedSubjectId: selectedSubject || undefined,
        linkedChapterId: selectedChapter || undefined,
        linkedSubtopicId: selectedSubtopic || undefined
      });
      setNewTaskTitle('');
      setSelectedSubject('');
      setSelectedChapter('');
      setSelectedSubtopic('');
      setShowAdd(false);
    }
  };

  const playPopSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.warn("Audio not supported or disabled");
    }
  };

  const handleToggle = (id: string, completed: boolean) => {
    if (!completed) playPopSound();
    toggleTask(id);
  };

  const getSyllabusLinkText = (task: any) => {
    if (!task.linkedSubjectId) return null;
    const subject = syllabus.find(s => s.id === task.linkedSubjectId);
    let text = subject?.title || '';
    if (task.linkedChapterId) {
      const chapter = subject?.chapters.find(c => c.id === task.linkedChapterId);
      if (chapter) text += ` > ${chapter.title}`;
      if (task.linkedSubtopicId) {
        const sub = chapter?.subtopics.find((st: any) => st.id === task.linkedSubtopicId);
        if (sub) text += ` > ${sub.title}`;
      }
    }
    return text;
  };

  const currentSubject = syllabus.find(s => s.id === selectedSubject);
  const currentChapter = currentSubject?.chapters.find(c => c.id === selectedChapter);

  return (
    <div className="w-full max-w-3xl mx-auto pb-32">
      <h1 className="text-4xl font-serif text-[var(--text-primary)] mb-8">Tasks</h1>

      <div className="flex gap-8 mb-8 border-b border-[var(--border)] pb-2">
        <button 
          onClick={() => setActiveTab('daily')} 
          className={`text-lg font-medium transition-colors relative pb-2 ${activeTab === 'daily' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          Daily
          {activeTab === 'daily' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />}
        </button>
        <button 
          onClick={() => setActiveTab('monthly')} 
          className={`text-lg font-medium transition-colors relative pb-2 ${activeTab === 'monthly' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          Monthly
          {activeTab === 'monthly' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />}
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {filteredTasks.map(task => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-panel p-4 rounded-2xl flex items-center gap-4 group"
            >
              <button onClick={() => handleToggle(task.id, task.completed)} className={`transition-colors ${task.completed ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--accent-hover)]'}`}>
                {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
              <div className="flex-1 flex flex-col">
                <span className={`text-lg transition-all duration-300 ${task.completed ? 'text-[var(--text-secondary)] line-through opacity-70' : 'text-[var(--text-primary)]'}`}>
                  {task.title}
                </span>
                {task.linkedSubjectId && (
                  <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold mt-1">
                    {getSyllabusLinkText(task)}
                  </span>
                )}
              </div>
              <button onClick={() => deleteTask(task.id)} className="text-[var(--text-secondary)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {showAdd ? (
          <motion.form 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            onSubmit={handleAddTask}
            className="glass-panel p-4 rounded-2xl space-y-4"
          >
            <input 
              autoFocus
              type="text" 
              placeholder={`New ${activeTab} task (or leave empty to use syllabus title)...`}
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              className="w-full p-2 bg-transparent text-[var(--text-primary)] text-lg border-b border-[var(--border)] outline-none focus:border-[var(--accent)]"
            />
            
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Link to Syllabus (Optional)</span>
              <div className="flex gap-4 flex-wrap">
                <select 
                  value={selectedSubject} 
                  onChange={e => {
                    setSelectedSubject(e.target.value);
                    setSelectedChapter('');
                    setSelectedSubtopic('');
                  }}
                  className="p-2 text-sm rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none border-none focus:ring-1 focus:ring-[var(--accent)] max-w-[200px]"
                >
                  <option value="">No Subject Link</option>
                  {syllabus.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>

                {currentSubject && (
                  <select 
                    value={selectedChapter} 
                    onChange={e => {
                      setSelectedChapter(e.target.value);
                      setSelectedSubtopic('');
                    }}
                    className="p-2 text-sm rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none border-none focus:ring-1 focus:ring-[var(--accent)] max-w-[200px]"
                  >
                    <option value="">No Chapter Link</option>
                    {currentSubject.chapters.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                )}

                {currentChapter && (
                  <select 
                    value={selectedSubtopic} 
                    onChange={e => setSelectedSubtopic(e.target.value)}
                    className="p-2 text-sm rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none border-none focus:ring-1 focus:ring-[var(--accent)] max-w-[200px]"
                  >
                    <option value="">No Subtopic Link</option>
                    {currentChapter.subtopics.map(st => (
                      <option key={st.id} value={st.id}>{st.title}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-[var(--border)]">
              <div className="flex-1"></div>
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2 rounded-xl bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors">Add Task</button>
            </div>
          </motion.form>
        ) : (
          <button 
            onClick={() => setShowAdd(true)}
            className="w-full py-4 flex items-center justify-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-2 border-dashed border-[var(--border)] rounded-2xl hover:bg-[var(--bg-secondary)] transition-all mt-4"
          >
            <Plus size={20} /> Add New Task
          </button>
        )}
      </div>
    </div>
  );
};
