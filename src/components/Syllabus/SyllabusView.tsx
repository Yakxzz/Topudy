import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, ChevronRight, CheckCircle2, Circle, Trash2, Download, BookCheck, FileText, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../store';
import type { SyllabusSubject } from '../../store';
import { ConfirmModal } from './ConfirmModal';
import { sounds } from '../../utils/soundEffects';

export const SyllabusView: React.FC = () => {
  const { 
    syllabus, 
    addSubject, 
    loadCbseSyllabusTemplate 
  } = useAppStore();

  const [activeSubjectTab, setActiveSubjectTab] = useState<string>('all');
  const [newSubjectTitle, setNewSubjectTitle] = useState('');
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const confirmAction = (title: string, message: string, onConfirm: () => void) => {
    setConfirmState({ isOpen: true, title, message, onConfirm });
  };

  // Overall & Subject-wise Progress calculation
  let totalItems = 0;
  let completedItems = 0;
  let totalPyqs = 0;
  let completedPyqs = 0;

  syllabus.forEach(subject => {
    subject.chapters.forEach(chapter => {
      if (chapter.subtopics.length === 0) {
        totalItems++;
        if (chapter.completed) completedItems++;
      } else {
        chapter.subtopics.forEach(sub => {
          totalItems++;
          if (sub.completed) completedItems++;
          totalPyqs++;
          if (sub.pyqDone) completedPyqs++;
        });
      }
    });
  });

  const overallProgress = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
  const pyqProgress = totalPyqs === 0 ? 0 : Math.round((completedPyqs / totalPyqs) * 100);

  const handleAddSubject = () => {
    if (newSubjectTitle.trim()) {
      addSubject(newSubjectTitle.trim());
      setNewSubjectTitle('');
      setShowAddSubject(false);
      sounds.playPop();
    }
  };

  const filteredSyllabus = activeSubjectTab === 'all' 
    ? syllabus 
    : syllabus.filter(s => s.id === activeSubjectTab || s.title.toLowerCase().includes(activeSubjectTab.toLowerCase()));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 pt-8 pb-32">
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)]">Syllabus Tracker</h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">Track NCERT concepts, PYQs & 3-cycle revision for 10th CBSE Boards.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="px-4 py-2.5 rounded-2xl glass-panel border border-[var(--border)] text-xs font-semibold text-[var(--accent)] hover:bg-[var(--bg-secondary)] transition-all flex items-center gap-2 shadow-sm"
          >
            <Download size={15} />
            <span>Load 10th CBSE Syllabus</span>
          </button>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* Overall Syllabus Card */}
        <div className="glass-panel p-5 rounded-3xl border border-[var(--border)] shadow-sm">
          <div className="flex justify-between items-end mb-3">
            <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold flex items-center gap-1.5">
              <BookCheck size={14} className="text-[var(--accent)]" /> Syllabus Mastered
            </span>
            <span className="text-2xl font-serif font-bold text-[var(--accent)] leading-none font-mono-timer">{overallProgress}%</span>
          </div>
          <div className="w-full h-2.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[var(--accent)] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <span className="text-[11px] text-[var(--text-secondary)] mt-2 block">
            {completedItems} of {totalItems} topics checked
          </span>
        </div>

        {/* Board PYQ Card */}
        <div className="glass-panel p-5 rounded-3xl border border-[var(--border)] shadow-sm">
          <div className="flex justify-between items-end mb-3">
            <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold flex items-center gap-1.5">
              <FileText size={14} className="text-orange-500" /> Past Year Questions (PYQs)
            </span>
            <span className="text-2xl font-serif font-bold text-orange-500 leading-none font-mono-timer">{pyqProgress}%</span>
          </div>
          <div className="w-full h-2.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-orange-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${pyqProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <span className="text-[11px] text-[var(--text-secondary)] mt-2 block">
            {completedPyqs} of {totalPyqs} subtopic PYQs solved
          </span>
        </div>
      </div>

      {/* Subject Filter Tabs */}
      {syllabus.length > 0 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
          <button
            onClick={() => setActiveSubjectTab('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeSubjectTab === 'all'
                ? 'bg-[var(--accent)] text-white shadow-md'
                : 'glass-panel border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            All Subjects ({syllabus.length})
          </button>
          {syllabus.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSubjectTab(s.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeSubjectTab === s.id
                  ? 'bg-[var(--accent)] text-white shadow-md'
                  : 'glass-panel border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {s.title.split(' ')[0]} {s.title.includes('Math') ? '📐' : s.title.includes('Science') ? '🔬' : s.title.includes('Social') ? '🌍' : s.title.includes('English') ? '📖' : ''}
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {syllabus.length === 0 && (
        <div className="glass-panel p-10 rounded-3xl border border-[var(--border)] text-center my-6">
          <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-4 text-3xl">
            📚
          </div>
          <h3 className="text-xl font-serif text-[var(--text-primary)] mb-2">No Syllabus Added Yet</h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-6">
            Get started instantly with the official Class 10 CBSE syllabus covering Maths, Science, SST, and English.
          </p>
          <button
            onClick={() => loadCbseSyllabusTemplate(true)}
            className="px-6 py-3 rounded-2xl bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-all shadow-md inline-flex items-center gap-2"
          >
            <Download size={16} /> Load Complete 10th CBSE Syllabus
          </button>
        </div>
      )}

      {/* Subjects Accordion List */}
      <div className="space-y-5">
        <AnimatePresence>
          {filteredSyllabus.map(subject => (
            <SubjectAccordion key={subject.id} subject={subject} confirmAction={confirmAction} />
          ))}
        </AnimatePresence>

        {/* Add Subject form / button */}
        {showAddSubject ? (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2"
          >
            <input 
              autoFocus
              type="text" 
              placeholder="Subject Name (e.g. Hindi, Computer Applications)..." 
              value={newSubjectTitle}
              onChange={e => setNewSubjectTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddSubject()}
              className="flex-1 p-3.5 rounded-2xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] outline-none focus:border-[var(--accent)] text-sm"
            />
            <button onClick={handleAddSubject} className="px-5 rounded-2xl bg-[var(--accent)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors">Add</button>
            <button onClick={() => setShowAddSubject(false)} className="px-5 rounded-2xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors text-sm">Cancel</button>
          </motion.div>
        ) : (
          <button 
            onClick={() => setShowAddSubject(true)}
            className="w-full py-4 flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-2 border-dashed border-[var(--border)] rounded-3xl hover:bg-[var(--bg-secondary)] transition-all"
          >
            <Plus size={18} /> Add Custom Subject
          </button>
        )}
      </div>

      {/* Load Template Modal */}
      <AnimatePresence>
        {showTemplateModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[var(--bg-primary)] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[var(--border)] shadow-2xl relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 text-2xl">
                📖
              </div>
              <h3 className="text-2xl font-serif text-[var(--text-primary)] mb-2">Class 10 CBSE Syllabus</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                This will import the complete 2026-27 CBSE Board syllabus for Mathematics (Standard/Basic), Science, Social Science (History, Civics, Geo, Eco), and English.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    loadCbseSyllabusTemplate(false);
                    setShowTemplateModal(false);
                    sounds.playPop();
                  }}
                  className="w-full py-3.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-2xl hover:bg-[var(--accent-hover)] transition-colors shadow-md text-left px-5 flex justify-between items-center"
                >
                  <span>Append to My Existing Syllabus</span>
                  <ChevronRight size={18} />
                </button>

                <button
                  onClick={() => {
                    loadCbseSyllabusTemplate(true);
                    setShowTemplateModal(false);
                    sounds.playPop();
                  }}
                  className="w-full py-3.5 bg-[var(--bg-secondary)] hover:bg-red-50 text-red-500 text-sm font-semibold rounded-2xl transition-colors text-left px-5 flex justify-between items-center border border-[var(--border)]"
                >
                  <span>Replace Entire Syllabus with CBSE 10</span>
                  <ChevronRight size={18} />
                </button>

                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="w-full py-2.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-center block mt-2"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

const SubjectAccordion = ({ subject, confirmAction }: { subject: SyllabusSubject, confirmAction: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const { addChapter, deleteSubject, toggleSubject } = useAppStore();

  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChapterTitle.trim()) {
      addChapter(subject.id, newChapterTitle.trim());
      setNewChapterTitle('');
      sounds.playPop();
    }
  };

  const totalSubtopics = subject.chapters.reduce((acc: number, c) => acc + (c.subtopics.length > 0 ? c.subtopics.length : 1), 0);
  const completedSubtopics = subject.chapters.reduce((acc: number, c) => {
    if (c.subtopics.length === 0) return acc + (c.completed ? 1 : 0);
    return acc + c.subtopics.filter(st => st.completed).length;
  }, 0);
  const isCompleted = totalSubtopics > 0 && totalSubtopics === completedSubtopics;
  const progressPercent = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const actionWord = isCompleted ? 'unmark' : 'mark completed';
    confirmAction(`Confirm Action`, `Are you sure you want to ${actionWord} the entire subject "${subject.title}"?`, () => {
      sounds.playPop();
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
    <motion.div layout className="glass-panel rounded-3xl overflow-hidden border border-[var(--border)] shadow-sm">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-[var(--bg-secondary)]/50 transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-2">
          <button 
            onClick={handleToggle} 
            className={`transition-colors shrink-0 ${isCompleted ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'}`}
          >
            {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className={`text-base sm:text-lg font-semibold truncate transition-colors ${isCompleted ? 'text-[var(--text-secondary)] line-through opacity-70' : 'text-[var(--text-primary)]'}`}>
                {subject.title}
              </h2>
              {subject.code && (
                <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded-full shrink-0">
                  Code {subject.code}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-[var(--text-secondary)]">
                {completedSubtopics}/{totalSubtopics} topics ({progressPercent}%)
              </span>
              <div className="w-20 sm:w-28 h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={handleDelete} 
            className="text-[var(--text-secondary)] hover:text-red-400 opacity-0 group-hover:opacity-100 p-2 transition-all"
            title="Delete Subject"
          >
            <Trash2 size={18} />
          </button>
          <div className="p-2 text-[var(--text-secondary)]">
            {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="px-4 sm:px-6 pb-6 pt-2 border-t border-[var(--border)]"
          >
            <div className="space-y-3 mt-2">
              {subject.chapters.map(chapter => (
                <ChapterAccordion 
                  key={chapter.id} 
                  subjectId={subject.id} 
                  chapter={chapter} 
                  confirmAction={confirmAction} 
                />
              ))}

              <form onSubmit={handleAddChapter} className="mt-4 flex gap-2 pl-3">
                <input 
                  type="text" 
                  placeholder="Add Chapter (e.g. Ch 15: Our Environment)..." 
                  value={newChapterTitle}
                  onChange={e => setNewChapterTitle(e.target.value)}
                  className="flex-1 p-2.5 text-xs sm:text-sm rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] outline-none focus:border-[var(--accent)]"
                />
                <button type="submit" className="p-2.5 px-4 rounded-xl bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors text-xs font-semibold flex items-center gap-1">
                  <Plus size={16} /> Add Chapter
                </button>
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
  const { 
    addSubtopic, 
    toggleSubtopic, 
    toggleChapter, 
    deleteChapter, 
    deleteSubtopic,
    cycleSubtopicRevision,
    toggleSubtopicPyq,
    toggleSubtopicNotes
  } = useAppStore();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtopic.trim()) {
      addSubtopic(subjectId, chapter.id, newSubtopic.trim());
      setNewSubtopic('');
      sounds.playPop();
    }
  };

  const totalSubtopics = chapter.subtopics.length;
  const completedSubtopics = chapter.subtopics.filter((st: any) => st.completed).length;
  const isCompleted = totalSubtopics > 0 ? totalSubtopics === completedSubtopics : !!chapter.completed;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const actionWord = isCompleted ? 'unmark' : 'mark complete';
    confirmAction(`Confirm Action`, `Are you sure you want to ${actionWord} the entire chapter "${chapter.title}"?`, () => {
      sounds.playPop();
      toggleChapter(subjectId, chapter.id, !isCompleted);
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    confirmAction(`Delete Chapter`, `Are you sure you want to permanently delete "${chapter.title}"?`, () => {
      deleteChapter(subjectId, chapter.id);
    });
  };

  return (
    <div className="rounded-2xl bg-[var(--bg-secondary)]/40 border border-[var(--border)]/60 overflow-hidden">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer group hover:bg-[var(--bg-secondary)]/80 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
          <button 
            onClick={handleToggle} 
            className={`transition-colors shrink-0 ${isCompleted ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'}`}
          >
            {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
          </button>
          <span className={`text-sm font-semibold truncate transition-colors ${isCompleted ? 'text-[var(--text-secondary)] line-through opacity-70' : 'text-[var(--text-primary)]'}`}>
            {chapter.title}
          </span>
          {totalSubtopics > 0 && (
            <span className="text-[10px] text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded-full shrink-0 font-medium">
              {completedSubtopics}/{totalSubtopics}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={handleDelete} 
            className="text-[var(--text-secondary)] hover:text-red-400 opacity-0 group-hover:opacity-100 p-1.5 transition-all"
            title="Delete Chapter"
          >
            <Trash2 size={15} />
          </button>
          <div className="text-[var(--text-secondary)]">
            {isOpen ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="px-3.5 pb-4 pt-1 space-y-2 border-t border-[var(--border)]/40"
          >
            {chapter.subtopics.map((sub: any) => (
              <div 
                key={sub.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl hover:bg-[var(--bg-secondary)]/70 transition-colors gap-2 group/sub border border-transparent hover:border-[var(--border)]"
              >
                {/* Checkbox and Subtopic Title */}
                <div 
                  onClick={() => {
                    sounds.playPop();
                    toggleSubtopic(subjectId, chapter.id, sub.id, !sub.completed);
                  }} 
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                  <div className={`transition-colors shrink-0 ${sub.completed ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] group-hover/sub:text-[var(--accent)]'}`}>
                    {sub.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  </div>
                  <span className={`text-xs sm:text-sm transition-all ${sub.completed ? 'text-[var(--text-secondary)] line-through opacity-70' : 'text-[var(--text-primary)]'}`}>
                    {sub.title}
                  </span>
                </div>

                {/* 10th CBSE Action Pills: PYQ, Revision Cycles, Notes */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {/* Revision Cycle Pill */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playClick();
                      cycleSubtopicRevision(subjectId, chapter.id, sub.id);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${
                      (sub.revisionCount || 0) > 0 
                        ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                    title="Click to cycle Revision (R0 -> R1 -> R2 -> R3 Mastered)"
                  >
                    <RotateCcw size={10} />
                    <span>R{sub.revisionCount || 0}</span>
                  </button>

                  {/* PYQ Pill */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playPop();
                      toggleSubtopicPyq(subjectId, chapter.id, sub.id);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${
                      sub.pyqDone
                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                    title="Mark Past Year Questions done"
                  >
                    <FileText size={10} />
                    <span>PYQ</span>
                  </button>

                  {/* Notes / Formula Pill */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playClick();
                      toggleSubtopicNotes(subjectId, chapter.id, sub.id);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      sub.notesReady
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                    title="Notes / Formula Sheet Ready"
                  >
                    Notes
                  </button>

                  {/* Delete Subtopic */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmAction(`Delete Subtopic`, `Are you sure you want to delete "${sub.title}"?`, () => {
                        deleteSubtopic(subjectId, chapter.id, sub.id);
                      });
                    }} 
                    className="text-[var(--text-secondary)] hover:text-red-400 opacity-0 group-hover/sub:opacity-100 p-1 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}

            <form onSubmit={handleAdd} className="flex gap-2 pt-2">
              <input 
                type="text" 
                placeholder="Add subtopic or key formula..." 
                value={newSubtopic}
                onChange={e => setNewSubtopic(e.target.value)}
                className="flex-1 p-2 text-xs rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] outline-none focus:border-[var(--accent)]"
              />
              <button type="submit" className="px-3 py-1.5 bg-[var(--accent)] text-white text-xs font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-colors">
                <Plus size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
