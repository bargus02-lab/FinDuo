import { motion } from 'framer-motion'
import {
  Check,
  Lock,
  RotateCcw,
  User as UserIcon,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useState } from 'react'
import { Card } from '../components/Card'
import { PageShell } from '../components/PageShell'
import { ACHIEVEMENTS } from '../data/achievements'
import { fadeUp, staggerChildren } from '../lib/animations'
import {
  useCompletedCount,
  useGameStore,
  type Theme,
} from '../store/useGameStore'

interface ThemeOption {
  id: Theme
  name: string
  preview: string
}

const THEMES: ThemeOption[] = [
  { id: 'light', name: 'Light', preview: 'bg-[#FFFBF5] border-black/10' },
  { id: 'dark', name: 'Dark', preview: 'bg-[#0F1729] border-white/10' },
  {
    id: 'sunset',
    name: 'Sunset',
    preview: 'bg-gradient-to-br from-[#1E102E] via-[#3B1C5A] to-[#FF7E5E] border-white/10',
  },
  {
    id: 'terminal',
    name: 'Terminal',
    preview: 'bg-[#0A1A0A] border-[#64FF96]',
  },
]

export function Profile() {
  const xp = useGameStore((s) => s.xp)
  const streak = useGameStore((s) => s.streak)
  const completedLessons = useGameStore((s) => s.completedLessons)
  const dailyChallengeLastDate = useGameStore(
    (s) => s.dailyChallengeLastDate,
  )
  const theme = useGameStore((s) => s.theme)
  const soundEnabled = useGameStore((s) => s.soundEnabled)
  const firstSeenAt = useGameStore((s) => s.firstSeenAt)
  const setTheme = useGameStore((s) => s.setTheme)
  const toggleSound = useGameStore((s) => s.toggleSound)
  const reset = useGameStore((s) => s.resetProgress)
  const lessonCount = useCompletedCount()

  const memberSince = firstSeenAt
    ? new Date(firstSeenAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'today'

  const [confirmReset, setConfirmReset] = useState(false)

  const achievementState = {
    xp,
    streak,
    completedLessons,
    dailyChallengeLastDate,
  }

  const earned = ACHIEVEMENTS.filter((a) => a.isEarned(achievementState))

  return (
    <PageShell className="pb-28">
      <motion.header
        variants={fadeUp}
        initial="initial"
        animate="in"
        className="text-center mb-6 pt-2"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary text-white mb-3 shadow-card">
          <UserIcon size={36} strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">You</h1>
        <p className="text-fg/50 text-xs">Member since {memberSince}</p>
      </motion.header>

      <motion.section
        variants={staggerChildren(0.06)}
        initial="initial"
        animate="in"
        className="grid grid-cols-3 gap-2.5 mb-6"
      >
        {[
          { label: 'XP', value: xp, color: 'text-primary' },
          { label: 'Streak', value: streak, color: 'text-xp' },
          { label: 'Lessons', value: lessonCount, color: 'text-wrong' },
        ].map((s) => (
          <motion.div key={s.label} variants={fadeUp}>
            <Card className="text-center">
              <div
                className={`text-2xl font-extrabold tabular-nums ${s.color}`}
              >
                {s.value}
              </div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-fg/50">
                {s.label}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      <section className="mb-8">
        <div className="flex items-baseline justify-between mb-2 px-1">
          <h2 className="text-sm font-extrabold tracking-tight uppercase">
            Achievements
          </h2>
          <span className="text-xs font-bold text-fg/40 tabular-nums">
            {earned.length}/{ACHIEVEMENTS.length}
          </span>
        </div>
        <motion.div
          variants={staggerChildren(0.04)}
          initial="initial"
          animate="in"
          className="grid grid-cols-3 gap-2.5"
        >
          {ACHIEVEMENTS.map((a) => {
            const isEarned = a.isEarned(achievementState)
            return (
              <motion.div
                key={a.id}
                variants={fadeUp}
                whileHover={isEarned ? { scale: 1.02 } : undefined}
              >
                <div
                  className={`rounded-2xl p-3 text-center border-b-2 transition-colors ${
                    isEarned
                      ? 'bg-card border-line/5'
                      : 'bg-fg/5 border-line/5'
                  }`}
                  title={a.description}
                >
                  <div
                    className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-1.5 ${
                      isEarned ? `bg-fg/5 ${a.color}` : 'text-fg/30'
                    }`}
                  >
                    {isEarned ? (
                      <a.Icon size={20} strokeWidth={2.5} />
                    ) : (
                      <Lock size={16} strokeWidth={2.5} />
                    )}
                  </div>
                  <div
                    className={`text-[11px] font-extrabold leading-tight ${
                      isEarned ? 'text-fg' : 'text-fg/40'
                    }`}
                  >
                    {a.name}
                  </div>
                  <div
                    className={`text-[10px] mt-0.5 leading-tight ${
                      isEarned ? 'text-fg/50' : 'text-fg/30'
                    }`}
                  >
                    {a.description}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-extrabold tracking-tight uppercase mb-2 px-1">
          Theme
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {THEMES.map((t) => {
            const isActive = theme === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`relative aspect-square rounded-2xl border-2 transition-colors ${t.preview} ${
                  isActive
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-canvas'
                    : ''
                }`}
                aria-label={`${t.name} theme`}
              >
                {isActive && (
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                    <Check size={12} strokeWidth={3.5} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
        <div className="grid grid-cols-4 gap-2 mt-1.5">
          {THEMES.map((t) => (
            <div
              key={t.id}
              className={`text-[10px] uppercase tracking-wider font-bold text-center ${
                theme === t.id ? 'text-primary' : 'text-fg/40'
              }`}
            >
              {t.name}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-extrabold tracking-tight uppercase mb-2 px-1">
          Settings
        </h2>
        <button
          onClick={toggleSound}
          className="w-full flex items-center justify-between bg-card rounded-2xl px-4 py-3 border-b-2 border-line/5"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                soundEnabled ? 'bg-primary text-white' : 'bg-fg/10 text-fg/50'
              }`}
            >
              {soundEnabled ? (
                <Volume2 size={18} strokeWidth={2.5} />
              ) : (
                <VolumeX size={18} strokeWidth={2.5} />
              )}
            </div>
            <div className="text-left">
              <div className="font-extrabold text-sm">Sound</div>
              <div className="text-[11px] text-fg/50">
                Tap feedback and chime
              </div>
            </div>
          </div>
          <div
            className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
              soundEnabled ? 'bg-primary' : 'bg-fg/15'
            }`}
          >
            <motion.div
              className="w-5 h-5 rounded-full bg-card shadow"
              animate={{ x: soundEnabled ? 20 : 0 }}
              transition={{ type: 'spring', stiffness: 480, damping: 30 }}
            />
          </div>
        </button>
      </section>

      <section>
        {confirmReset ? (
          <Card className="border-wrong/30">
            <p className="text-sm font-semibold mb-3">
              Wipe all progress? This can’t be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 py-2 rounded-xl bg-fg/5 text-fg/70 font-bold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  reset()
                  setConfirmReset(false)
                }}
                className="flex-1 py-2 rounded-xl bg-wrong text-white font-bold text-sm"
              >
                Reset
              </button>
            </div>
          </Card>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg/40 hover:text-wrong transition-colors"
            >
              <RotateCcw size={12} strokeWidth={2.5} />
              Reset progress
            </button>
          </div>
        )}
      </section>
    </PageShell>
  )
}
