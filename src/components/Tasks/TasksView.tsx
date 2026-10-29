import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, Circle, Trash2, Clock, Sparkles, BookOpen } from 'lucide-react';
import { useAppStore } from '../../store';
import { sounds } from '../../utils/soundEffects';

export const TasksView: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask, syllabus } = useAppStore();
  const [activeTab, setActiveTab] = useState<'daily' | 'priority' | 'monthly'>('daily');
  const [showAdd, setShowAdd] = useState(false);

  // Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [category, setCategory] = useState<'ncert' | 'pyq' | 'revision' | 'sample_paper' | 'general'>('ncert');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);

  // Syllabus Link State
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');

  const filteredTasks = tasks.filter(t => {
    if (activeTab === 'priority') return t.priority === 'high' && !t.completed;
    if (activeTab === 'monthly') return !t.isDaily;
    return t.isDaily;
  });

  const completedTodayCount = tasks.filter(t => t.isDaily && t.completed).length;
  const totalTodayCount = tasks.filter(t => t.isDaily).length;
  const todayProgress = totalTodayCount === 0 ? 0 : Math.round((completedTodayCount / totalTodayCount) * 100);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim() || selectedSubtopic || selectedChapter || selectedSubject) {
      let title = newTaskTitle.trim();
      if (!title) {
        if (selectedSubtopic) {
          const subject = syllabus.find(s => s.id === selectedSubject);
          const chapter = subject?.chapters.find(c => c.id === selectedChapter);
          const sub = chapter?.subtopics.find(st => st.id === selectedSubtopic);
          title = sub?.title || 'Untitled Target';
        } else if (selectedChapter) {
          const subject = syllabus.find(s => s.id === selectedSubject);
          const chapter = subject?.chapters.find(c => c.id === selectedChapter);
          title = chapter?.title || 'Untitled Target';
        } else if (selectedSubject) {
          const subject = syllabus.find(s => s.id === selectedSubject);
          title = subject?.title || 'Untitled Target';
        } else {
          return;
        }
      }

      sounds.playPop();
      addTask({
        title,
        isDaily: activeTab !== 'monthly',
        priority,
        category,
        estimatedMinutes: Number(estimatedMinutes) || 30,
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

  const handleToggle = (id: string, completed: boolean) => {
    if (!completed) sounds.playPop();
    toggleTask(id);
  };

  const getSyllabusLinkText = (task: any) => {
    if (!task.linkedSubjectId) return null;
    const subject = syllabus.find(s => s.id === task.linkedSubjectId);
    let text = subject?.title || '';
    if (task.linkedChapterId) {
      const chapter = subject?.chapters.find(c => c.id === task.linkedChapterId);
      if (chapter) text += ` • ${chapter.title.split(':')[0]}`;
      if (task.linkedSubtopicId) {
        const sub = chapter?.subtopics.find((st: any) => st.id === task.linkedSubtopicId);
        if (sub) text += ` • ${sub.title}`;
      }
    }
    return text;
  };

  const currentSubject = syllabus.find(s => s.id === selectedSubject);
  const currentChapter = currentSubject?.chapters.find(c => c.id === selectedChapter);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 pt-4 sm:pt-6 pb-36 sm:pb-44">
      {/* Title & Today's Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)]">Board Targets</h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Organize daily NCERT exercises, PYQs, and revision blocks.
          </p>
        </div>

        {totalTodayCount > 0 && (
          <div className="glass-panel px-4 py-2.5 rounded-2xl border border-[var(--border)] shadow-sm flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-secondary)]">Today's Goals</span>
              <span className="text-xs font-bold text-[var(--text-primary)]">{completedTodayCount} of {totalTodayCount} done</span>
            </div>
            <div className="w-16 h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--accent)] rounded-full transition-all duration-500" style={{ width: `${todayProgress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-6 mb-6 border-b border-[var(--border)] pb-2 text-sm font-medium">
        <button 
          onClick={() => setActiveTab('daily')} 
          className={`transition-colors relative pb-2 ${activeTab === 'daily' ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          Daily Focus
          {activeTab === 'daily' && <motion.div layoutId="task-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />}
        </button>
        <button 
          onClick={() => setActiveTab('priority')} 
          className={`transition-colors relative pb-2 flex items-center gap-1.5 ${activeTab === 'priority' ? 'text-orange-500 font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <span>🔥 Board Priority</span>
          {activeTab === 'priority' && <motion.div layoutId="task-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
        </button>
        <button 
          onClick={() => setActiveTab('monthly')} 
          className={`transition-colors relative pb-2 ${activeTab === 'monthly' ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          Monthly Milestones
          {activeTab === 'monthly' && <motion.div layoutId="task-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />}
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredTasks.map(task => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-panel p-4 rounded-2xl flex items-center gap-3.5 group border border-[var(--border)] shadow-sm hover:border-[var(--accent)] transition-all"
            >
              <button 
                onClick={() => handleToggle(task.id, task.completed)} 
                className={`transition-colors shrink-0 ${task.completed ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'}`}
              >
                {task.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
              </button>

              <div className="flex-1 flex flex-col min-w-0 pr-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm sm:text-base font-medium transition-all ${task.completed ? 'text-[var(--text-secondary)] line-through opacity-70' : 'text-[var(--text-primary)]'}`}>
                    {task.title}
                  </span>

                  {/* Priority Tag */}
                  {task.priority === 'high' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700 border border-red-200">
                      High Priority
                    </span>
                  )}

                  {/* Category Tag */}
                  {task.category && task.category !== 'general' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                      {task.category === 'ncert' ? 'NCERT' : task.category === 'pyq' ? 'PYQ' : task.category === 'revision' ? 'Revision' : 'Mock Paper'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-1 text-[11px] text-[var(--text-secondary)]">
                  {task.estimatedMinutes && (
                    <span className="flex items-center gap-1 font-mono-timer">
                      <Clock size={11} /> {task.estimatedMinutes}m
                    </span>
                  )}

                  {task.linkedSubjectId && (
                    <span className="truncate flex items-center gap-1 text-[var(--accent)] font-semibold">
                      <BookOpen size={11} /> {getSyllabusLinkText(task)}
                    </span>
                  )}
                </div>
              </div>

              <button 
                onClick={() => {
                  sounds.playPop();
                  deleteTask(task.id);
                }} 
                className="text-[var(--text-secondary)] hover:text-red-400 opacity-0 group-hover:opacity-100 p-2 transition-all shrink-0"
                title="Delete Target"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <div className="glass-panel p-8 rounded-3xl border border-[var(--border)] text-center my-4">
            <Sparkles size={32} className="mx-auto text-[var(--accent)] opacity-40 mb-2" />
            <p className="text-sm font-medium text-[var(--text-primary)]">No targets in this view</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Add a new board study goal or practice task below.</p>
          </div>
        )}

        {/* Add Task Toggle Button */}
        {!showAdd && (
          <button 
            onClick={() => setShowAdd(true)}
            className="w-full py-3.5 flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-2 border-dashed border-[var(--border)] rounded-2xl hover:bg-[var(--bg-secondary)] transition-all mt-4"
          >
            <Plus size={16} /> Add Board Target
          </button>
        )}

        {/* Add Task Form Modal / Expansion */}
        <AnimatePresence>
          {showAdd && (
            <motion.form 
              onSubmit={handleAddTask}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="glass-panel p-5 rounded-3xl border border-[var(--border)] shadow-md space-y-4 mt-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
                <span className="text-xs uppercase font-bold tracking-wider text-[var(--text-secondary)]">Create New Study Target</span>
                <button 
                  type="button" 
                  onClick={() => setShowAdd(false)}
                  className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </button>
              </div>

              <input 
                autoFocus
                type="text" 
                placeholder="Target title (e.g. Solve Science Ch 1 Exemplar Q1-10)..." 
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] border border-[var(--border)] outline-none focus:border-[var(--accent)]"
              />

              {/* Priority & Category Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                    Priority
                  </label>
                  <select 
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs text-[var(--text-primary)] outline-none"
                  >
                    <option value="high">🔥 High (Board Exam Critical)</option>
                    <option value="medium">⚡ Medium (Standard Target)</option>
                    <option value="low">🟢 Low (Quick Review)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                    Type
                  </label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs text-[var(--text-primary)] outline-none"
                  >
                    <option value="ncert">📘 NCERT Concept / Exercise</option>
                    <option value="pyq">📝 Previous Year Questions (PYQs)</option>
                    <option value="revision">🔄 Revision Cycle</option>
                    <option value="sample_paper">✍️ Sample / Mock Paper</option>
                    <option value="general">🎯 General Target</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                    Est. Minutes
                  </label>
                  <input 
                    type="number"
                    min="5"
                    max="240"
                    step="5"
                    value={estimatedMinutes}
                    onChange={e => setEstimatedMinutes(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs text-[var(--text-primary)] outline-none font-mono-timer"
                  />
                </div>
              </div>

              {/* Link to Syllabus */}
              {syllabus.length > 0 && (
                <div className="p-3 rounded-2xl bg-[var(--bg-secondary)]/50 border border-[var(--border)] space-y-2">
                  <span className="text-[11px] uppercase font-semibold text-[var(--text-secondary)] block">
                    Link to CBSE Syllabus Topic (Optional)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select 
                      value={selectedSubject} 
                      onChange={e => {
                        setSelectedSubject(e.target.value);
                        setSelectedChapter('');
                        setSelectedSubtopic('');
                      }}
                      className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-[var(--text-primary)] outline-none"
                    >
                      <option value="">Select Subject...</option>
                      {syllabus.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>

                    <select 
                      value={selectedChapter} 
                      disabled={!selectedSubject}
                      onChange={e => {
                        setSelectedChapter(e.target.value);
                        setSelectedSubtopic('');
                      }}
                      className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-[var(--text-primary)] outline-none disabled:opacity-50"
                    >
                      <option value="">Select Chapter...</option>
                      {currentSubject?.chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>

                    <select 
                      value={selectedSubtopic} 
                      disabled={!selectedChapter}
                      onChange={e => setSelectedSubtopic(e.target.value)}
                      className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-[var(--text-primary)] outline-none disabled:opacity-50"
                    >
                      <option value="">Select Subtopic...</option>
                      {currentChapter?.subtopics.map(st => <option key={st.id} value={st.id}>{st.title}</option>)}
                    </select>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-md"
                >
                  Save Target
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
