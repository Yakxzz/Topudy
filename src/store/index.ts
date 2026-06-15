import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'default' | 'cloud-white' | 'rosewater' | 'midnight'

export interface Task {
  id: string
  title: string
  completed: boolean
  isDaily: boolean // true = Daily, false = Monthly
  linkedSubjectId?: string
  linkedChapterId?: string
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

export interface AppState {
  theme: Theme
  setTheme: (theme: Theme) => void

  hasSeenSplash: boolean
  setHasSeenSplash: (val: boolean) => void

  workDuration: number // in minutes
  shortBreakDuration: number // in minutes
  longBreakDuration: number // in minutes
  setTimerSettings: (work: number, short: number, long: number) => void

  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void

  syllabus: SyllabusSubject[]
  addSubject: (title: string) => void
  addChapter: (subjectId: string, title: string) => void
  addSubtopic: (subjectId: string, chapterId: string, title: string) => void
  toggleSubtopic: (subjectId: string, chapterId: string, subtopicId: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'default',
      setTheme: (theme) => set({ theme }),

      hasSeenSplash: false,
      setHasSeenSplash: (hasSeenSplash) => set({ hasSeenSplash }),

      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      setTimerSettings: (workDuration, shortBreakDuration, longBreakDuration) => 
        set({ workDuration, shortBreakDuration, longBreakDuration }),

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
      addChapter: (subjectId, title) => set((state) => ({
        syllabus: state.syllabus.map(s => s.id === subjectId 
          ? { ...s, chapters: [...s.chapters, { id: crypto.randomUUID(), title, subtopics: [] }] }
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
      }))
    }),
    {
      name: 'topudy-storage',
    }
  )
)
