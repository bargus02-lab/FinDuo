import {
  Award,
  BookOpen,
  Building2,
  Calendar,
  Crown,
  Flame,
  LineChart,
  Trophy,
  Zap,
  type LucideProps,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { lessonsForTrack } from './lessons'

export interface Achievement {
  id: string
  name: string
  description: string
  Icon: ComponentType<LucideProps>
  color: string
  isEarned: (state: AchievementState) => boolean
}

export interface AchievementState {
  xp: number
  streak: number
  completedLessons: Record<string, boolean>
  dailyChallengeLastDate: string | null
}

function trackComplete(trackId: 'money' | 'markets' | 'structured') {
  return (s: AchievementState) =>
    lessonsForTrack(trackId).every((l) => s.completedLessons[l.id])
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    name: 'First step',
    description: 'Complete your first lesson',
    Icon: BookOpen,
    color: 'text-primary',
    isEarned: (s) => Object.keys(s.completedLessons).length >= 1,
  },
  {
    id: 'hot-streak',
    name: 'Hot streak',
    description: 'Reach a 3-day streak',
    Icon: Flame,
    color: 'text-xp',
    isEarned: (s) => s.streak >= 3,
  },
  {
    id: 'perfect-week',
    name: 'Perfect week',
    description: '7 days in a row',
    Icon: Calendar,
    color: 'text-xp',
    isEarned: (s) => s.streak >= 7,
  },
  {
    id: 'centurion',
    name: 'Centurion',
    description: 'Earn 100 XP',
    Icon: Zap,
    color: 'text-primary',
    isEarned: (s) => s.xp >= 100,
  },
  {
    id: 'half-k',
    name: 'Half a thousand',
    description: 'Earn 500 XP',
    Icon: Award,
    color: 'text-primary',
    isEarned: (s) => s.xp >= 500,
  },
  {
    id: 'money-brain',
    name: 'Money brain',
    description: 'Complete every Money Basics lesson',
    Icon: BookOpen,
    color: 'text-wrong',
    isEarned: trackComplete('money'),
  },
  {
    id: 'market-mind',
    name: 'Market mind',
    description: 'Complete every Markets lesson',
    Icon: LineChart,
    color: 'text-primary',
    isEarned: trackComplete('markets'),
  },
  {
    id: 'tranche-tamer',
    name: 'Tranche tamer',
    description: 'Complete every Structured Finance lesson',
    Icon: Building2,
    color: 'text-[#CE82FF]',
    isEarned: trackComplete('structured'),
  },
  {
    id: 'trifecta',
    name: 'Trifecta',
    description: 'Conquer all three tracks',
    Icon: Crown,
    color: 'text-xp',
    isEarned: (s) =>
      trackComplete('money')(s) &&
      trackComplete('markets')(s) &&
      trackComplete('structured')(s),
  },
  {
    id: 'grand-master',
    name: 'Grand master',
    description: 'Earn 1000 XP',
    Icon: Trophy,
    color: 'text-xp',
    isEarned: (s) => s.xp >= 1000,
  },
]
