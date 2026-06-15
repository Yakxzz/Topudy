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
}

export interface SyllabusSubject {
  id: string
  title: string
  chapters: SyllabusChapter[]
}

export interface StudySession {
  id: string
  date: string // YYYY-MM-DD
  durationSeconds: number
}

export interface AppState {
  theme: Theme
  setTheme: (theme: Theme) => void

  hasSeenSplash: boolean
  setHasSeenSplash: (val: boolean) => void

  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  cyclesBeforeLongBreak: number
  setTimerSettings: (work: number, short: number, long: number, cycles: number) => void

  studySessions: StudySession[]
  recordStudySession: (durationSeconds: number) => void

  currentStreak: number
  previousStreakToRestore: number
  lastStudyDate: string | null
  streakRestoresAvailable: number
  lastRestoreDate: string | null
  restoreStreak: () => void
  checkStreakStatus: () => void

  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void

  syllabus: SyllabusSubject[]
  addSubject: (title: string) => void
  deleteSubject: (subjectId: string) => void
  addChapter: (subjectId: string, title: string) => void
  deleteChapter: (subjectId: string, chapterId: string) => void
  addSubtopic: (subjectId: string, chapterId: string, title: string) => void
  toggleSubtopic: (subjectId: string, chapterId: string, subtopicId: string) => void
  deleteSubtopic: (subjectId: string, chapterId: string, subtopicId: string) => void
}

const getTodayDateString = () => new Date().toISOString().split('T')[0]

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'default',
      setTheme: (theme) => set({ theme }),

      hasSeenSplash: false,
      setHasSeenSplash: (hasSeenSplash) => set({ hasSeenSplash }),

      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      cyclesBeforeLongBreak: 4,
      setTimerSettings: (workDuration, shortBreakDuration, longBreakDuration, cyclesBeforeLongBreak) => 
        set({ workDuration, shortBreakDuration, longBreakDuration, cyclesBeforeLongBreak }),

      studySessions: [],
      currentStreak: 0,
      previousStreakToRestore: 0,
      lastStudyDate: null,
      streakRestoresAvailable: 1,
      lastRestoreDate: null,

      checkStreakStatus: () => set((state) => {
        if (!state.lastStudyDate) return {};
        const today = new Date();
        today.setHours(0,0,0,0);
        const lastStudy = new Date(state.lastStudyDate);
        lastStudy.setHours(0,0,0,0);
        const diffDays = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
        
        let newRestores = state.streakRestoresAvailable;
        if (state.lastRestoreDate) {
          const restoreDate = new Date(state.lastRestoreDate);
          if (restoreDate.getMonth() !== today.getMonth() || restoreDate.getFullYear() !== today.getFullYear()) {
            newRestores = 1;
          }
        }

        if (diffDays > 1 && state.currentStreak > 0) {
          // Streak broken
          return {
            previousStreakToRestore: state.currentStreak,
            currentStreak: 0,
            streakRestoresAvailable: newRestores
          };
        }
        
        // If diffDays > 2 (24 hours passed since broken streak day), expire restore opportunity
        if (diffDays > 2 && state.previousStreakToRestore > 0) {
           return {
             previousStreakToRestore: 0,
             streakRestoresAvailable: newRestores
           };
        }
        return { streakRestoresAvailable: newRestores };
      }),

      recordStudySession: (durationSeconds) => set((state) => {
        const today = getTodayDateString();
        const newSession = { id: crypto.randomUUID(), date: today, durationSeconds };
        const newSessions = [...state.studySessions, newSession];
        
        const todayTotalSeconds = newSessions
          .filter(s => s.date === today)
          .reduce((sum, s) => sum + s.durationSeconds, 0);

        let newStreak = state.currentStreak;
        let newLastStudyDate = state.lastStudyDate;

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
              // Streak was broken and didn't restore in time, start fresh
              newStreak = 1;
            }
          }
          newLastStudyDate = today;
        }

        return {
          studySessions: newSessions,
          currentStreak: newStreak,
          lastStudyDate: newLastStudyDate,
        };
      }),

      restoreStreak: () => set((state) => {
        if (state.streakRestoresAvailable > 0 && state.previousStreakToRestore > 0) {
          return {
            currentStreak: state.previousStreakToRestore,
            previousStreakToRestore: 0,
            streakRestoresAvailable: state.streakRestoresAvailable - 1,
            lastRestoreDate: getTodayDateString()
          }
        }
        return {};
      }),

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
      toggleSubtopic: (subjectId, chapterId, subtopicId) => set((state) => ({
        syllabus: state.syllabus.map(s => s.id === subjectId
          ? {
              ...s,
              chapters: s.chapters.map(c => c.id === chapterId
                ? {
                    ...c,
                    subtopics: c.subtopics.map(st => st.id === subtopicId
                      ? { ...st, completed: !st.completed }
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
