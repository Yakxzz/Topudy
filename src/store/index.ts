import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CBSE_CLASS_10_SYLLABUS } from '../data/cbse10Syllabus'

export type Theme = 'default' | 'cloud-white' | 'rosewater' | 'midnight'

export interface Task {
  id: string
  title: string
  completed: boolean
  isDaily: boolean
  linkedSubjectId?: string
  linkedChapterId?: string
  linkedSubtopicId?: string
  priority?: 'high' | 'medium' | 'low'
  category?: 'ncert' | 'pyq' | 'revision' | 'sample_paper' | 'general'
  estimatedMinutes?: number
}

export interface SyllabusItem {
  id: string
  title: string
  completed: boolean
  pyqDone?: boolean
  notesReady?: boolean
  revisionCount?: number // 0, 1, 2, 3
}

export interface SyllabusChapter {
  id: string
  title: string
  subtopics: SyllabusItem[]
  completed?: boolean
  pyqDone?: boolean
  notesReady?: boolean
  revisionCount?: number
}

export interface SyllabusSubject {
  id: string
  title: string
  code?: string
  chapters: SyllabusChapter[]
  completed?: boolean
}

export interface StudySession {
  id: string
  date: string // YYYY-MM-DD
  durationSeconds: number
  subjectTag?: string // 'Mathematics', 'Science', 'Social Science', 'English', etc.
  mode?: string
}

export interface Certificate {
  id: string
  title: string
  description: string
  dateEarned: string
  type: 'syllabus' | 'hours' | 'streak' | 'board'
  referenceId?: string
}

export interface AppState {
  theme: Theme
  setTheme: (theme: Theme) => void

  hasSeenSplash: boolean
  setHasSeenSplash: (val: boolean) => void

  // 10th CBSE Boards Features
  studentName: string
  setStudentName: (name: string) => void
  cbseExamDate: string
  setCbseExamDate: (date: string) => void
  dailyStudyGoalHours: number
  setDailyStudyGoalHours: (hours: number) => void
  currentSubjectTag: string
  setCurrentSubjectTag: (tag: string) => void

  // Timer Configuration & Aesthetics
  defaultTimerDuration: number // in minutes
  setDefaultTimerDuration: (minutes: number) => void
  timerFont: 'mono' | 'serif' | 'clean'
  setTimerFont: (font: 'mono' | 'serif' | 'clean') => void
  timerPreset: number
  setTimerPreset: (preset: number) => void

  // Analytics
  studySessions: StudySession[]
  recordStudySession: (durationSeconds: number, subjectTag?: string, mode?: string) => void

  // Ambient Audio (Zero CDN dependency Web Audio)
  audioPlaying: boolean
  audioTrack: string // 'rain' | 'focus' | 'cafe' | 'lofi'
  audioVolume: number
  setAudioState: (state: Partial<{ audioPlaying: boolean, audioTrack: string, audioVolume: number }>) => void

  // Gamification & Streaks
  currentStreak: number
  lastStudyDate: string | null
  checkStreakStatus: () => void

  // Certificates
  certificates: Certificate[]
  addCertificate: (cert: Omit<Certificate, 'id' | 'dateEarned'>) => void

  // Tasks
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void

  // Syllabus & CBSE Template
  syllabus: SyllabusSubject[]
  loadCbseSyllabusTemplate: (replace?: boolean) => void
  addSubject: (title: string, code?: string) => void
  deleteSubject: (subjectId: string) => void
  addChapter: (subjectId: string, title: string) => void
  deleteChapter: (subjectId: string, chapterId: string) => void
  toggleChapter: (subjectId: string, chapterId: string, completed: boolean) => void
  toggleSubject: (subjectId: string, completed: boolean) => void
  addSubtopic: (subjectId: string, chapterId: string, title: string) => void
  toggleSubtopic: (subjectId: string, chapterId: string, subtopicId: string, forceStatus?: boolean) => void
  cycleSubtopicRevision: (subjectId: string, chapterId: string, subtopicId: string) => void
  toggleSubtopicPyq: (subjectId: string, chapterId: string, subtopicId: string) => void
  toggleSubtopicNotes: (subjectId: string, chapterId: string, subtopicId: string) => void
  deleteSubtopic: (subjectId: string, chapterId: string, subtopicId: string) => void
}

const getTodayDateString = () => new Date().toISOString().split('T')[0]

const calculateTotalHours = (sessions: StudySession[]) => {
  const totalSeconds = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);
  return Math.floor(totalSeconds / 3600);
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'default',
      setTheme: (theme) => set({ theme }),

      hasSeenSplash: false,
      setHasSeenSplash: (hasSeenSplash) => set({ hasSeenSplash }),

      // 10th CBSE Settings
      studentName: 'Class 10 CBSE Scholar',
      setStudentName: (studentName) => set({ studentName }),
      cbseExamDate: '2027-02-15',
      setCbseExamDate: (cbseExamDate) => set({ cbseExamDate }),
      dailyStudyGoalHours: 4,
      setDailyStudyGoalHours: (dailyStudyGoalHours) => set({ dailyStudyGoalHours }),
      currentSubjectTag: 'Mathematics',
      setCurrentSubjectTag: (currentSubjectTag) => set({ currentSubjectTag }),

      // Timer & Font
      defaultTimerDuration: 25,
      setDefaultTimerDuration: (minutes) => set({ defaultTimerDuration: minutes }),
      timerFont: 'mono',
      setTimerFont: (timerFont) => set({ timerFont }),
      timerPreset: 25,
      setTimerPreset: (timerPreset) => set({ timerPreset }),

      // Ambient Audio
      audioPlaying: false,
      audioTrack: 'rain',
      audioVolume: 0.5,
      setAudioState: (state) => set((prev) => ({ ...prev, ...state })),

      // History & Gamification
      studySessions: [],
      currentStreak: 0,
      lastStudyDate: null,
      certificates: [],

      checkStreakStatus: () => set((state) => {
        if (!state.lastStudyDate) return {};
        const today = new Date();
        today.setHours(0,0,0,0);
        const lastStudy = new Date(state.lastStudyDate);
        lastStudy.setHours(0,0,0,0);
        const diffDays = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1 && state.currentStreak > 0) {
          return { currentStreak: 0 };
        }
        return {};
      }),

      addCertificate: (cert) => set((state) => {
        if (cert.referenceId && state.certificates.some(c => c.referenceId === cert.referenceId)) {
          return {};
        }
        const newCert: Certificate = {
          ...cert,
          id: crypto.randomUUID(),
          dateEarned: getTodayDateString()
        };
        return { certificates: [...state.certificates, newCert] };
      }),

      recordStudySession: (durationSeconds, subjectTag, mode) => {
        set((state) => {
          const today = getTodayDateString();
          const newSession: StudySession = { 
            id: crypto.randomUUID(), 
            date: today, 
            durationSeconds,
            subjectTag: subjectTag || state.currentSubjectTag || 'General Focus',
            mode: mode || (durationSeconds >= 10800 ? 'mock_paper' : 'study')
          };
          const newSessions = [...state.studySessions, newSession];
          
          const todayTotalSeconds = newSessions
            .filter(s => s.date === today)
            .reduce((sum, s) => sum + s.durationSeconds, 0);

          let newStreak = state.currentStreak;
          let newLastStudyDate = state.lastStudyDate;
          const newCertificates = [...state.certificates];

          // STREAK LOGIC: 30 minutes daily
          if (todayTotalSeconds >= 30 * 60 && state.lastStudyDate !== today) {
            if (!state.lastStudyDate) {
              newStreak = 1;
            } else {
              const lastStudy = new Date(state.lastStudyDate);
              const currentDate = new Date(today);
              lastStudy.setHours(0,0,0,0);
              currentDate.setHours(0,0,0,0);
              const diffDays = Math.floor((currentDate.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
              
              if (diffDays === 1) {
                newStreak += 1;
              } else if (diffDays > 1) {
                newStreak = 1;
              }
            }
            newLastStudyDate = today;

            // STREAK MILESTONES
            const streakMilestones = [3, 7, 15, 30, 50, 100];
            if (streakMilestones.includes(newStreak)) {
               const ref = `streak-${newStreak}`;
               if (!newCertificates.some(c => c.referenceId === ref)) {
                 newCertificates.push({
                   id: crypto.randomUUID(),
                   title: `${newStreak} Day Consistency Titan`,
                   description: `You have successfully maintained a disciplined study streak for ${newStreak} consecutive days.`,
                   dateEarned: today,
                   type: 'streak',
                   referenceId: ref
                 });
               }
            }
          }

          // 3-HOUR MOCK PAPER CERTIFICATE
          if (durationSeconds >= 180 * 60) {
            const ref = `mock-paper-complete-${today}`;
            if (!newCertificates.some(c => c.referenceId === ref)) {
              newCertificates.push({
                id: crypto.randomUUID(),
                title: '3-Hour CBSE Mock Paper Champion',
                description: `Successfully completed an unbroken 3-hour Board exam simulation session in ${subjectTag || 'General'}.`,
                dateEarned: today,
                type: 'board',
                referenceId: ref
              });
            }
          }

          // TOTAL HOURS MILESTONES
          const totalHours = calculateTotalHours(newSessions);
          const hourMilestones = [10, 25, 50, 100, 200, 500];
          
          hourMilestones.forEach(milestone => {
             if (totalHours >= milestone) {
                const ref = `hour-${milestone}`;
                if (!newCertificates.some(c => c.referenceId === ref)) {
                  newCertificates.push({
                    id: crypto.randomUUID(),
                    title: `${milestone} Hours Board Grind`,
                    description: `You have dedicated a stellar total of ${milestone} hours of deep focused study.`,
                    dateEarned: today,
                    type: 'hours',
                    referenceId: ref
                  });
                }
             }
          });

          return {
            studySessions: newSessions,
            currentStreak: newStreak,
            lastStudyDate: newLastStudyDate,
            certificates: newCertificates
          };
        });
      },

      tasks: [],
      addTask: (task) => set((state) => ({
        tasks: [
          ...state.tasks, 
          { 
            ...task, 
            id: crypto.randomUUID(), 
            completed: false,
            priority: task.priority || 'medium',
            category: task.category || 'general'
          }
        ]
      })),
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),

      syllabus: [],
      
      loadCbseSyllabusTemplate: (replace = false) => set((state) => {
        const templateData: SyllabusSubject[] = JSON.parse(JSON.stringify(CBSE_CLASS_10_SYLLABUS));
        if (replace || state.syllabus.length === 0) {
          return { syllabus: templateData };
        }
        // Append missing subjects
        const existingTitles = new Set(state.syllabus.map(s => s.title.toLowerCase()));
        const toAppend = templateData.filter(s => !existingTitles.has(s.title.toLowerCase()));
        return { syllabus: [...state.syllabus, ...toAppend] };
      }),

      addSubject: (title, code) => set((state) => ({
        syllabus: [...state.syllabus, { id: crypto.randomUUID(), title, code, chapters: [] }]
      })),
      deleteSubject: (subjectId) => set((state) => ({
        syllabus: state.syllabus.filter(s => s.id !== subjectId)
      })),
      addChapter: (subjectId, title) => set((state) => ({
        syllabus: state.syllabus.map(s => s.id === subjectId 
          ? { ...s, chapters: [...s.chapters, { id: crypto.randomUUID(), title, subtopics: [] }] }
          : s
        )
      })),
      deleteChapter: (subjectId, chapterId) => set((state) => ({
        syllabus: state.syllabus.map(s => s.id === subjectId
          ? { ...s, chapters: s.chapters.filter(c => c.id !== chapterId) }
          : s
        )
      })),
      toggleSubject: (subjectId, completed) => set((state) => ({
        syllabus: state.syllabus.map(s => s.id === subjectId
          ? {
              ...s,
              completed,
              chapters: s.chapters.map(c => ({
                ...c,
                completed,
                subtopics: c.subtopics.map(st => ({ ...st, completed }))
              }))
            }
          : s
        )
      })),
      toggleChapter: (subjectId, chapterId, completed) => set((state) => ({
        syllabus: state.syllabus.map(s => s.id === subjectId
          ? {
              ...s,
              chapters: s.chapters.map(c => c.id === chapterId
                ? {
                    ...c,
                    completed,
                    subtopics: c.subtopics.map(st => ({ ...st, completed }))
                  }
                : c
              )
            }
          : s
        )
      })),
      addSubtopic: (subjectId, chapterId, title) => set((state) => ({
        syllabus: state.syllabus.map(s => s.id === subjectId
          ? {
              ...s,
              chapters: s.chapters.map(c => c.id === chapterId
                ? { ...c, subtopics: [...c.subtopics, { id: crypto.randomUUID(), title, completed: false, revisionCount: 0, pyqDone: false, notesReady: false }] }
                : c
              )
            }
          : s
        )
      })),
      toggleSubtopic: (subjectId, chapterId, subtopicId, forceStatus) => {
        set((state) => {
          let targetSubject: SyllabusSubject | null = null;

          const newSyllabus = state.syllabus.map(s => {
            if (s.id === subjectId) {
              const newSubject = {
                ...s,
                chapters: s.chapters.map(c => c.id === chapterId
                  ? {
                      ...c,
                      subtopics: c.subtopics.map(st => st.id === subtopicId
                        ? { ...st, completed: forceStatus !== undefined ? forceStatus : !st.completed }
                        : st
                      )
                    }
                  : c
                )
              };
              targetSubject = newSubject;
              return newSubject;
            }
            return s;
          });

          // Check if subject is completely finished
          const newCertificates = [...state.certificates];
          if (targetSubject) {
            const subj = targetSubject as unknown as SyllabusSubject;
            let isComplete = true;
            let hasTopics = false;
            
            for (const chap of subj.chapters) {
              for (const sub of chap.subtopics) {
                 hasTopics = true;
                 if (!sub.completed) {
                   isComplete = false;
                   break;
                 }
              }
              if (!isComplete) break;
            }

            if (hasTopics && isComplete) {
              const ref = `syllabus-${subj.id}`;
              if (!newCertificates.some(c => c.referenceId === ref)) {
                 newCertificates.push({
                    id: crypto.randomUUID(),
                    title: `Mastered: ${subj.title}`,
                    description: `You have successfully completed 100% of the CBSE Board syllabus for ${subj.title}.`,
                    dateEarned: getTodayDateString(),
                    type: 'syllabus',
                    referenceId: ref
                 });
              }
            }
          }

          return {
            syllabus: newSyllabus,
            certificates: newCertificates
          };
        });
      },
      cycleSubtopicRevision: (subjectId, chapterId, subtopicId) => set((state) => ({
        syllabus: state.syllabus.map(s => s.id === subjectId
          ? {
              ...s,
              chapters: s.chapters.map(c => c.id === chapterId
                ? {
                    ...c,
                    subtopics: c.subtopics.map(st => st.id === subtopicId
                      ? { ...st, revisionCount: ((st.revisionCount || 0) + 1) % 4 }
                      : st
                    )
                  }
                : c
              )
            }
          : s
        )
      })),
      toggleSubtopicPyq: (subjectId, chapterId, subtopicId) => set((state) => ({
        syllabus: state.syllabus.map(s => s.id === subjectId
          ? {
              ...s,
              chapters: s.chapters.map(c => c.id === chapterId
                ? {
                    ...c,
                    subtopics: c.subtopics.map(st => st.id === subtopicId
                      ? { ...st, pyqDone: !st.pyqDone }
                      : st
                    )
                  }
                : c
              )
            }
          : s
        )
      })),
      toggleSubtopicNotes: (subjectId, chapterId, subtopicId) => set((state) => ({
        syllabus: state.syllabus.map(s => s.id === subjectId
          ? {
              ...s,
              chapters: s.chapters.map(c => c.id === chapterId
                ? {
                    ...c,
                    subtopics: c.subtopics.map(st => st.id === subtopicId
                      ? { ...st, notesReady: !st.notesReady }
                      : st
                    )
                  }
                : c
              )
            }
          : s
        )
      })),
      deleteSubtopic: (subjectId, chapterId, subtopicId) => set((state) => ({
        syllabus: state.syllabus.map(s => s.id === subjectId
          ? {
              ...s,
              chapters: s.chapters.map(c => c.id === chapterId
                ? { ...c, subtopics: c.subtopics.filter(st => st.id !== subtopicId) }
                : c
              )
            }
          : s
        )
      }))
    }),
    {
      name: 'topudy-storage',
    }
  )
)
