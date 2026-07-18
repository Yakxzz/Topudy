import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'default' | 'cloud-white' | 'rosewater' | 'midnight' | 'mint' | 'lavender' | 'coffee' | 'ocean'

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
  completed?: boolean
  subtopics: SyllabusItem[]
}

export interface SyllabusSubject {
  id: string
  title: string
  completed?: boolean
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

  isPremium: boolean
  premiumType: 'none' | 'lifetime' | 'monthly' | 'yearly'
  trialTimeUsed: number
  activatePremium: (type: 'lifetime' | 'monthly' | 'yearly') => void
  incrementTrialTime: () => void

  showPaywall: boolean
  setShowPaywall: (show: boolean) => void

  hasSeenSplash: boolean
  setHasSeenSplash: (val: boolean) => void

  workDuration: number
  setTimerSettings: (work: number) => void

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
  toggleSubject: (subjectId: string, completed: boolean) => void
  toggleChapter: (subjectId: string, chapterId: string, completed: boolean) => void
  toggleSubtopic: (subjectId: string, chapterId: string, subtopicId: string, forceStatus?: boolean) => void
  deleteSubtopic: (subjectId: string, chapterId: string, subtopicId: string) => void

  userName: string
  setUserName: (name: string) => void

  unlockedCertificates: string[]
  unlockCertificate: (certId: string) => void

  timerMode: 'study' | 'timer'
  setTimerMode: (mode: 'study' | 'timer') => void

  audioPlaying: boolean
  audioTrack: string
  audioVolume: number
  setAudioState: (playing: boolean, track?: string, volume?: number) => void
}

const getTodayDateString = () => new Date().toISOString().split('T')[0]

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'ocean',
      setTheme: (theme) => set({ theme }),

      isPremium: false,
      premiumType: 'none',
      trialTimeUsed: 0,
      activatePremium: (type) => set({ isPremium: true, premiumType: type }),
      incrementTrialTime: () => set((state) => ({ 
        trialTimeUsed: state.isPremium ? state.trialTimeUsed : state.trialTimeUsed + 1 
      })),

      showPaywall: false,
      setShowPaywall: (show) => set({ showPaywall: show }),

      userName: '',
      setUserName: (userName) => set({ userName }),

      unlockedCertificates: [],
      unlockCertificate: (certId) => set((state) => ({
        unlockedCertificates: state.unlockedCertificates.includes(certId) 
          ? state.unlockedCertificates 
          : [...state.unlockedCertificates, certId]
      })),

      timerMode: 'study',
      setTimerMode: (timerMode) => set({ timerMode }),

      audioPlaying: false,
      audioTrack: 'lofi',
      audioVolume: 0.5,
      setAudioState: (playing, track, volume) => set((state) => ({ 
        audioPlaying: playing, 
        audioTrack: track ?? state.audioTrack,
        audioVolume: volume ?? state.audioVolume
      })),

      hasSeenSplash: false,
      setHasSeenSplash: (hasSeenSplash) => set({ hasSeenSplash }),

      workDuration: 25,
      setTimerSettings: (workDuration) => set({ workDuration }),

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
        syllabus: [...state.syllabus, { id: crypto.randomUUID(), title, completed: false, chapters: [] }]
      })),
      deleteSubject: (subjectId) => set((state) => ({
        syllabus: state.syllabus.filter(s => s.id !== subjectId)
      })),
      addChapter: (subjectId, title) => set((state) => ({
        syllabus: state.syllabus.map(s => s.id === subjectId 
          ? { ...s, chapters: [...s.chapters, { id: crypto.randomUUID(), title, completed: false, subtopics: [] }] }
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
      toggleSubtopic: (subjectId, chapterId, subtopicId, forceStatus) => set((state) => ({
        syllabus: state.syllabus.map(s => s.id === subjectId
          ? {
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
