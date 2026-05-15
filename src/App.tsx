import { motion } from 'framer-motion'
import { Flame, RotateCcw, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { Button } from './components/Button'
import { Card } from './components/Card'
import { PageShell } from './components/PageShell'
import { fadeUp, popIn, staggerChildren } from './lib/animations'
import {
  TRACKS,
  useCompletedCount,
  useDailyChallengeAvailable,
  useGameStore,
} from './store/useGameStore'

function App() {
  const xp = useGameStore((s) => s.xp)
  const streak = useGameStore((s) => s.streak)
  const currentTrack = useGameStore((s) => s.currentTrack)
  const completedCount = useCompletedCount()
  const dailyAvailable = useDailyChallengeAvailable()

  const completeLesson = useGameStore((s) => s.completeLesson)
  const completeDaily = useGameStore((s) => s.completeDailyChallenge)
  const setTrack = useGameStore((s) => s.setTrack)
  const reset = useGameStore((s) => s.resetProgress)

  return (
    <PageShell>
      <motion.header
        variants={fadeUp}
        initial="initial"
        animate="in"
        className="text-center mb-6"
      >
        <motion.div
          variants={popIn}
          initial="initial"
          animate="in"
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white mb-3 shadow-card"
        >
          <Sparkles size={28} strokeWidth={2.5} />
        </motion.div>
        <h1 className="text-2xl font-extrabold tracking-tight">FinDuo</h1>
        <p className="text-ink/60 text-sm">Store wired · persists across reloads</p>
      </motion.header>

      <motion.section
        variants={staggerChildren(0.06)}
        initial="initial"
        animate="in"
        className="grid grid-cols-3 gap-3 mb-6"
      >
        {[
          { icon: Zap, label: 'XP', value: xp, color: 'text-primary' },
          { icon: Flame, label: 'Streak', value: streak, color: 'text-xp' },
          {
            icon: TrendingUp,
            label: 'Lessons',
            value: completedCount,
            color: 'text-wrong',
          },
        ].map((item) => (
          <motion.div key={item.label} variants={fadeUp}>
            <Card className="text-center">
              <item.icon
                className={`w-5 h-5 mx-auto mb-1 ${item.color}`}
                strokeWidth={2.5}
              />
              <div className="text-2xl font-extrabold tabular-nums">
                {item.value}
              </div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-ink/50">
                {item.label}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      <section className="mb-6">
        <div className="text-xs uppercase tracking-wider font-semibold text-ink/50 mb-2 px-1">
          Track
        </div>
        <div className="flex gap-2">
          {TRACKS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTrack(t.id)}
              className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                currentTrack === t.id
                  ? 'bg-ink text-cream'
                  : 'bg-white text-ink/70 hover:bg-ink/5 border border-ink/10'
              }`}
            >
              <div className="text-base mb-0.5">{t.emoji}</div>
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <Button
          variant="primary"
          className="w-full"
          onClick={() => completeLesson(`demo-${Date.now()}`, 10)}
        >
          Complete a lesson · +10 XP
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          disabled={!dailyAvailable}
          onClick={() => completeDaily(20)}
        >
          {dailyAvailable
            ? 'Daily challenge · +20 XP'
            : 'Daily challenge done today'}
        </Button>
        <div className="flex justify-center pt-2">
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/40 hover:text-wrong transition-colors"
          >
            <RotateCcw size={12} strokeWidth={2.5} />
            Reset progress
          </button>
        </div>
      </section>

      <p className="text-xs text-ink/40 mt-10 text-center">
        Step 4 of 12 · Zustand store with localStorage persistence
      </p>
    </PageShell>
  )
}

export default App
