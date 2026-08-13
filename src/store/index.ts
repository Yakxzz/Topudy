import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'default' | 'cloud-white' | 'rosewater' | 'midnight'

export interface Task {
  id: string
  title: string
  completed: boolean
  isDaily: boolean
  linkedSubjectId?: string
  linkedChapterId?: string
  linkedSubtopicId?: string
}

export interface SyllabusItem {
  id: string
  title: string
  completed: boolean
}

export interface SyllabusChapter {
  id: string
  title: string
  subtopics: SyllabusItem[]
  completed?: boolean
}

export interface SyllabusSubject {
  id: string
  title: string
  chapters: SyllabusChapter[]
  completed?: boolean
}

export interface StudySession {
  id: string
  date: string // YYYY-MM-DD
  durationSeconds: number
}

export interface Certificate {
  id: string
  title: string
  description: string
  dateEarned: string
  type: 'syllabus' | 'hours' | 'streak'
  referenceId?: string // Used to avoid duplicates (e.g. subjectId, or "hour-50")
}

export interface AppState {
  theme: Theme
  setTheme: (theme: Theme) => void

  hasSeenSplash: boolean
  setHasSeenSplash: (val: boolean) => void

  // Simple Timer
  defaultTimerDuration: number // in minutes
  setDefaultTimerDuration: (minutes: number) => void

  // Analytics
  studySessions: StudySession[]
  recordStudySession: (durationSeconds: number) => void

  // Audio
  audioPlaying: boolean
  audioTrack: string
  audioVolume: number
  setAudioState: (state: Partial<{ audioPlaying: boolean, audioTrack: string, audioVolume: number }>) => void

  // Gamification (Free)
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

  // Syllabus
  syllabus: SyllabusSubject[]
  addSubject: (title: string) => void
  deleteSubject: (subjectId: string) => void
  addChapter: (subjectId: string, title: string) => void
  deleteChapter: (subjectId: string, chapterId: string) => void
  toggleChapter: (subjectId: string, chapterId: string, completed: boolean) => void
  toggleSubject: (subjectId: string, completed: boolean) => void
  addSubtopic: (subjectId: string, chapterId: string, title: string) => void
  toggleSubtopic: (subjectId: string, chapterId: string, subtopicId: string, forceStatus?: boolean) => void
  deleteSubtopic: (subjectId: string, chapterId: string, subtopicId: string) => void
}

const getTodayDateString = () => new Date().toISOString().split('T')[0]

// Helper to calculate total hours studied
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

      defaultTimerDuration: 25,
      setDefaultTimerDuration: (minutes) => set({ defaultTimerDuration: minutes }),

      audioPlaying: false,
      audioTrack: 'rain',
      audioVolume: 0.5,
      setAudioState: (state) => set((prev) => ({ ...prev, ...state })),

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
          // Streak broken
          return { currentStreak: 0 };
        }
        return {};
      }),

      addCertificate: (cert) => set((state) => {
        // Prevent duplicate certificates based on referenceId
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

      recordStudySession: (durationSeconds) => {
        set((state) => {
          const today = getTodayDateString();
          const newSession = { id: crypto.randomUUID(), date: today, durationSeconds };
          const newSessions = [...state.studySessions, newSession];
          
          const todayTotalSeconds = newSessions
            .filter(s => s.date === today)
            .reduce((sum, s) => sum + s.durationSeconds, 0);

          let newStreak = state.currentStreak;
          let newLastStudyDate = state.lastStudyDate;
          let newCertificates = [...state.certificates];

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

            // STREAK MILESTONE CERTIFICATES
            const streakMilestones = [7, 15, 30, 50, 100, 365];
            if (streakMilestones.includes(newStreak)) {
               const ref = `streak-${newStreak}`;
               if (!newCertificates.some(c => c.referenceId === ref)) {
                 newCertificates.push({
                   id: crypto.randomUUID(),
                   title: `${newStreak} Day Streak!`,
                   description: `Incredible consistency! You studied for ${newStreak} consecutive days.`,
                   dateEarned: today,
                   type: 'streak',
                   referenceId: ref
                 });
               }
            }
          }

          // HOUR MILESTONE CERTIFICATES
          const totalHours = calculateTotalHours(newSessions);
          const hourMilestones = [10, 50, 100, 250, 500, 1000];
          
          hourMilestones.forEach(milestone => {
             if (totalHours >= milestone) {
                const ref = `hour-${milestone}`;
                if (!newCertificates.some(c => c.referenceId === ref)) {
                  newCertificates.push({
                    id: crypto.randomUUID(),
                    title: `${milestone} Hours of Focus`,
                    description: `You have dedicated a total of ${milestone} hours to your studies.`,
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
        tasks: [...state.tasks, { ...task, id: crypto.randomUUID(), completed: false }]
      })),
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),

      syllabus: [],
      addSubject: (title) => set((state) => ({
        syllabus: [...state.syllabus, { id: crypto.randomUUID(), title, chapters: [] }]
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
                ? { ...c, subtopics: [...c.subtopics, { id: crypto.randomUUID(), title, completed: false }] }
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
          let newCertificates = [...state.certificates];
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
                    description: `You have successfully completed 100% of the syllabus for ${subj.title}.`,
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
