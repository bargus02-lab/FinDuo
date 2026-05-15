import { motion } from 'framer-motion'
import { Lock, RotateCcw, User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import { Card } from '../components/Card'
import { PageShell } from '../components/PageShell'
import { ACHIEVEMENTS } from '../data/achievements'
import { fadeUp, staggerChildren } from '../lib/animations'
import { useCompletedCount, useGameStore } from '../store/useGameStore'

export function Profile() {
  const xp = useGameStore((s) => s.xp)
  const streak = useGameStore((s) => s.streak)
  const completedLessons = useGameStore((s) => s.completedLessons)
  const dailyChallengeLastDate = useGameStore(
    (s) => s.dailyChallengeLastDate,
  )
  const reset = useGameStore((s) => s.resetProgress)
  const lessonCount = useCompletedCount()

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
        <p className="text-ink/50 text-xs">Member since today</p>
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
              <div className="text-[10px] uppercase tracking-wider font-bold text-ink/50">
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
          <span className="text-xs font-bold text-ink/40 tabular-nums">
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
                      ? 'bg-white border-black/5'
                      : 'bg-ink/5 border-ink/5'
                  }`}
                  title={a.description}
                >
                  <div
                    className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-1.5 ${
                      isEarned ? `bg-ink/5 ${a.color}` : 'text-ink/30'
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
                      isEarned ? 'text-ink' : 'text-ink/40'
                    }`}
                  >
                    {a.name}
                  </div>
                  <div
                    className={`text-[10px] mt-0.5 leading-tight ${
                      isEarned ? 'text-ink/50' : 'text-ink/30'
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

      <section>
        {confirmReset ? (
          <Card className="border-wrong/30">
            <p className="text-sm font-semibold mb-3">
              Wipe all progress? This can’t be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 py-2 rounded-xl bg-ink/5 text-ink/70 font-bold text-sm"
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
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/40 hover:text-wrong transition-colors"
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
