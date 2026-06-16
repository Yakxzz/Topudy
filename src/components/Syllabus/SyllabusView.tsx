import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, ChevronRight, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store';
import { ConfirmModal } from './ConfirmModal';

export const SyllabusView: React.FC = () => {
  const { syllabus, addSubject } = useAppStore();
  const [newSubjectTitle, setNewSubjectTitle] = useState('');
  const [showAddSubject, setShowAddSubject] = useState(false);

  const [confirmState, setConfirmState] = useState<{isOpen: boolean, title: string, message: string, onConfirm: () => void}>({isOpen: false, title: '', message: '', onConfirm: () => {}});

  const confirmAction = (title: string, message: string, onConfirm: () => void) => {
    setConfirmState({ isOpen: true, title, message, onConfirm });
  };

  // Progress calculation
  let totalSubtopics = 0;
  let completedSubtopics = 0;

  syllabus.forEach(subject => {
    subject.chapters.forEach(chapter => {
      chapter.subtopics.forEach(sub => {
        totalSubtopics++;
        if (sub.completed) completedSubtopics++;
      });
    });
  });

  const progress = totalSubtopics === 0 ? 0 : Math.round((completedSubtopics / totalSubtopics) * 100);

  const handleAddSubject = () => {
    if (newSubjectTitle.trim()) {
      addSubject(newSubjectTitle.trim());
      setNewSubjectTitle('');
      setShowAddSubject(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-32">
      <h1 className="text-4xl font-serif text-[var(--text-primary)] mb-8">Syllabus Tracker</h1>

      {/* Progress Bar */}
      <div className="mb-12 glass-panel p-6 rounded-3xl border border-[var(--border)]">
        <div className="flex justify-between items-end mb-4">
          <span className="text-sm uppercase tracking-wider text-[var(--text-secondary)] font-semibold">Overall Progress</span>
          <span className="text-3xl font-serif text-[var(--accent)] leading-none">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[var(--accent)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Subjects List */}
      <div className="space-y-6">
        <AnimatePresence>
          {syllabus.map(subject => (
            <SubjectAccordion key={subject.id} subject={subject} confirmAction={confirmAction} />
          ))}
        </AnimatePresence>

        {showAddSubject ? (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex gap-2"
          >
            <input 
              autoFocus
              type="text" 
              placeholder="Subject Name..." 
              value={newSubjectTitle}
              onChange={e => setNewSubjectTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddSubject()}
              className="flex-1 p-4 rounded-2xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border-none outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            <button onClick={handleAddSubject} className="px-6 rounded-2xl bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors">Add</button>
            <button onClick={() => setShowAddSubject(false)} className="px-6 rounded-2xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">Cancel</button>
          </motion.div>
        ) : (
          <button 
            onClick={() => setShowAddSubject(true)}
            className="w-full py-4 flex items-center justify-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-2 border-dashed border-[var(--border)] rounded-2xl hover:bg-[var(--bg-secondary)] transition-all"
          >
            <Plus size={20} /> Add New Subject
          </button>
        )}
      </div>

      <ConfirmModal 
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

const SubjectAccordion = ({ subject, confirmAction }: { subject: any, confirmAction: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const { addChapter, deleteSubject, toggleSubject } = useAppStore();

  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChapterTitle.trim()) {
      addChapter(subject.id, newChapterTitle.trim());
      setNewChapterTitle('');
    }
  };

  const totalSubtopics = subject.chapters.reduce((acc: number, c: any) => acc + c.subtopics.length, 0);
  const completedSubtopics = subject.chapters.reduce((acc: number, c: any) => acc + c.subtopics.filter((st: any) => st.completed).length, 0);
  const isCompleted = totalSubtopics > 0 && totalSubtopics === completedSubtopics;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const actionWord = isCompleted ? 'uncheck' : 'check';
    confirmAction(`Confirm Action`, `Are you sure you want to ${actionWord} the entire subject "${subject.title}"?`, () => {
      toggleSubject(subject.id, !isCompleted);
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    confirmAction(`Delete Subject`, `Are you sure you want to permanently delete "${subject.title}" and all its contents?`, () => {
      deleteSubject(subject.id);
    });
  };

  return (
    <motion.div layout className="glass-panel rounded-3xl overflow-hidden border border-[var(--border)]">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full p-6 flex items-center justify-between bg-white/30 hover:bg-white/50 transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          <button onClick={handleToggle} className={`transition-colors ${isCompleted ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--accent-hover)]'}`}>
            {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
          </button>
          <h2 className={`text-xl font-medium transition-colors ${isCompleted ? 'text-[var(--text-secondary)] opacity-70' : 'text-[var(--text-primary)]'}`}>
            {subject.title}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleDelete} className="text-[var(--text-secondary)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
            <Trash2 size={20} />
          </button>
          {isOpen ? <ChevronDown className="text-[var(--text-secondary)]" /> : <ChevronRight className="text-[var(--text-secondary)]" />}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-6"
          >
            <div className="space-y-4 mt-4">
              {subject.chapters.map((chapter: any) => (
                <ChapterAccordion key={chapter.id} subjectId={subject.id} chapter={chapter} confirmAction={confirmAction} />
              ))}

              <form onSubmit={handleAddChapter} className="mt-4 flex gap-2 pl-4">
                <input 
                  type="text" 
                  placeholder="Add Chapter..." 
                  value={newChapterTitle}
                  onChange={e => setNewChapterTitle(e.target.value)}
                  className="flex-1 p-3 text-sm rounded-xl bg-[var(--bg-secondary)] border-none outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
                <button type="submit" className="p-3 rounded-xl bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"><Plus size={18} /></button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ChapterAccordion = ({ subjectId, chapter, confirmAction }: { subjectId: string, chapter: any, confirmAction: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newSubtopic, setNewSubtopic] = useState('');
  const { addSubtopic, toggleSubtopic, toggleChapter, deleteChapter, deleteSubtopic } = useAppStore();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtopic.trim()) {
      addSubtopic(subjectId, chapter.id, newSubtopic.trim());
      setNewSubtopic('');
    }
  };

  const totalSubtopics = chapter.subtopics.length;
  const completedSubtopics = chapter.subtopics.filter((st: any) => st.completed).length;
  const isCompleted = totalSubtopics > 0 && totalSubtopics === completedSubtopics;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const actionWord = isCompleted ? 'uncheck' : 'check';
    confirmAction(`Confirm Action`, `Are you sure you want to ${actionWord} the entire chapter "${chapter.title}"?`, () => {
      toggleChapter(subjectId, chapter.id, !isCompleted);
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    confirmAction(`Delete Chapter`, `Are you sure you want to permanently delete "${chapter.title}"?`, () => {
      deleteChapter(subjectId, chapter.id);
    });
  };

  const handleToggleSubtopic = (sub: any) => {
    toggleSubtopic(subjectId, chapter.id, sub.id, !sub.completed);
  };

  const handleDeleteSubtopic = (e: React.MouseEvent, sub: any) => {
    e.stopPropagation();
    confirmAction(`Delete Subtopic`, `Are you sure you want to permanently delete "${sub.title}"?`, () => {
      deleteSubtopic(subjectId, chapter.id, sub.id);
    });
  };

  return (
    <div className="border-l-2 border-[var(--border)] pl-4 ml-2">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full py-3 flex items-center justify-between text-left cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <button onClick={handleToggle} className={`transition-colors ${isCompleted ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--accent-hover)]'}`}>
            {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
          </button>
          <span className={`font-medium transition-colors ${isCompleted ? 'text-[var(--text-secondary)] opacity-70' : 'text-[var(--text-primary)] hover:text-[var(--accent)]'}`}>
            {chapter.title}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleDelete} className="text-[var(--text-secondary)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
            <Trash2 size={16} />
          </button>
          {isOpen ? <ChevronDown size={16} className="text-[var(--text-secondary)]" /> : <ChevronRight size={16} className="text-[var(--text-secondary)]" />}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="pl-8 space-y-2 overflow-hidden"
          >
            {chapter.subtopics.map((sub: any) => (
              <div 
                key={sub.id} 
                className="flex items-center justify-between py-2 group"
              >
                <div onClick={() => handleToggleSubtopic(sub)} className="flex items-center gap-3 cursor-pointer flex-1">
                  <div className={`transition-colors ${sub.completed ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--accent-hover)]'}`}>
                    {sub.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </div>
                  <span className={`text-sm transition-all duration-300 ${sub.completed ? 'text-[var(--text-secondary)] line-through opacity-70' : 'text-[var(--text-primary)]'}`}>
                    {sub.title}
                  </span>
                </div>
                <button onClick={(e) => handleDeleteSubtopic(e, sub)} className="text-[var(--text-secondary)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <form onSubmit={handleAdd} className="flex gap-2 pt-2">
              <input 
                type="text" 
                placeholder="Add subtopic..." 
                value={newSubtopic}
                onChange={e => setNewSubtopic(e.target.value)}
                className="flex-1 p-2 text-sm rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] outline-none focus:border-[var(--accent)]"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
