import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type Track = 'money' | 'markets' | 'structured'
export type Theme = 'light' | 'dark' | 'sunset' | 'terminal'

export const TRACKS: { id: Track; label: string; emoji: string }[] = [
  { id: 'money', label: 'Money Basics', emoji: '💰' },
  { id: 'markets', label: 'Markets', emoji: '📈' },
  { id: 'structured', label: 'Structured Finance', emoji: '🏛️' },
]

interface PersistedState {
  xp: number
  streak: number
  lastCompletedDate: string | null
  completedLessons: Record<string, boolean>
  dailyChallengeLastDate: string | null
  earnedAchievements: Record<string, boolean>
  currentTrack: Track
  theme: Theme
  soundEnabled: boolean
}

interface GameStore extends PersistedState {
  completeLesson: (lessonId: string, xpEarned: number) => void
  completeDailyChallenge: (xpEarned: number) => void
  setTrack: (track: Track) => void
  setTheme: (theme: Theme) => void
  toggleSound: () => void
  earnAchievement: (id: string) => void
  resetProgress: () => void
}

const initialState: PersistedState = {
  xp: 0,
  streak: 0,
  lastCompletedDate: null,
  completedLessons: {},
  dailyChallengeLastDate: null,
  earnedAchievements: {},
  currentTrack: 'money',
  theme: 'light',
  soundEnabled: true,
}

export function todayISO(date = new Date()): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function yesterdayISO(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return todayISO(d)
}

function nextStreak(lastDate: string | null, current: number): number {
  const today = todayISO()
  if (lastDate === today) return current
  if (lastDate === yesterdayISO()) return current + 1
  return 1
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialState,

      completeLesson: (lessonId, xpEarned) =>
        set((s) => ({
          completedLessons: { ...s.completedLessons, [lessonId]: true },
          xp: s.xp + xpEarned,
          streak: nextStreak(s.lastCompletedDate, s.streak),
          lastCompletedDate: todayISO(),
        })),

      completeDailyChallenge: (xpEarned) =>
        set((s) => {
          const today = todayISO()
          return {
            xp: s.xp + xpEarned,
            streak: nextStreak(s.lastCompletedDate, s.streak),
            lastCompletedDate: today,
            dailyChallengeLastDate: today,
          }
        }),

      setTrack: (currentTrack) => set({ currentTrack }),
      setTheme: (theme) => set({ theme }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      earnAchievement: (id) =>
        set((s) => ({
          earnedAchievements: { ...s.earnedAchievements, [id]: true },
        })),

      resetProgress: () => set(initialState),
    }),
    {
      name: 'finduo-state',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s): PersistedState => ({
        xp: s.xp,
        streak: s.streak,
        lastCompletedDate: s.lastCompletedDate,
        completedLessons: s.completedLessons,
        dailyChallengeLastDate: s.dailyChallengeLastDate,
        earnedAchievements: s.earnedAchievements,
        currentTrack: s.currentTrack,
        theme: s.theme,
        soundEnabled: s.soundEnabled,
      }),
    },
  ),
)

export const useDailyChallengeAvailable = () =>
  useGameStore((s) => s.dailyChallengeLastDate !== todayISO())

export const useIsLessonComplete = (lessonId: string) =>
  useGameStore((s) => s.completedLessons[lessonId] ?? false)

export const useCompletedCount = () =>
  useGameStore((s) => Object.keys(s.completedLessons).length)
