import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { useAppStore } from '../../store';

export const SyllabusView: React.FC = () => {
  const { syllabus, addSubject } = useAppStore();
  const [newSubjectTitle, setNewSubjectTitle] = useState('');
  const [showAddSubject, setShowAddSubject] = useState(false);

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
            <SubjectAccordion key={subject.id} subject={subject} />
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
    </div>
  );
};

const SubjectAccordion = ({ subject }: { subject: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const { addChapter } = useAppStore();

  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChapterTitle.trim()) {
      addChapter(subject.id, newChapterTitle.trim());
      setNewChapterTitle('');
    }
  };

  return (
    <motion.div layout className="glass-panel rounded-3xl overflow-hidden border border-[var(--border)]">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full p-6 flex items-center justify-between bg-white/30 hover:bg-white/50 transition-colors"
      >
        <h2 className="text-xl font-medium text-[var(--text-primary)]">{subject.title}</h2>
        {isOpen ? <ChevronDown className="text-[var(--text-secondary)]" /> : <ChevronRight className="text-[var(--text-secondary)]" />}
      </button>

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
                <ChapterAccordion key={chapter.id} subjectId={subject.id} chapter={chapter} />
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

const ChapterAccordion = ({ subjectId, chapter }: { subjectId: string, chapter: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newSubtopic, setNewSubtopic] = useState('');
  const { addSubtopic, toggleSubtopic } = useAppStore();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtopic.trim()) {
      addSubtopic(subjectId, chapter.id, newSubtopic.trim());
      setNewSubtopic('');
    }
  };

  return (
    <div className="border-l-2 border-[var(--border)] pl-4 ml-2">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full py-3 flex items-center gap-2 text-left text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span className="font-medium">{chapter.title}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="pl-6 space-y-2 overflow-hidden"
          >
            {chapter.subtopics.map((sub: any) => (
              <div 
                key={sub.id} 
                onClick={() => toggleSubtopic(subjectId, chapter.id, sub.id)}
                className="flex items-center gap-3 py-2 cursor-pointer group"
              >
                <div className={`transition-colors ${sub.completed ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--accent-hover)]'}`}>
                  {sub.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </div>
                <span className={`text-sm transition-all duration-300 ${sub.completed ? 'text-[var(--text-secondary)] line-through opacity-70' : 'text-[var(--text-primary)]'}`}>
                  {sub.title}
                </span>
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
