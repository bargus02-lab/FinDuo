import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { Flame, Sparkles, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DailyChallengeCard } from '../components/DailyChallengeCard'
import { LessonPath } from '../components/LessonPath'
import { LessonPreview } from '../components/LessonPreview'
import { PageShell } from '../components/PageShell'
import { fadeUp } from '../lib/animations'
import { lessonsForTrack, type Lesson } from '../data/lessons'
import { TRACKS, useCompletedCount, useGameStore } from '../store/useGameStore'

function ParallaxBackdrop() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 1200], [0, -180])
  const y2 = useTransform(scrollY, [0, 1200], [0, -320])
  const y3 = useTransform(scrollY, [0, 1200], [0, -100])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-10 -right-16 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-72 -left-20 w-80 h-80 rounded-full bg-xp/15 blur-3xl"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[60vh] right-10 w-56 h-56 rounded-full bg-wrong/10 blur-3xl"
      />
    </div>
  )
}

function greeting(date = new Date()): string {
  const h = date.getHours()
  if (h < 5) return 'Up late'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

interface HomeProps {
  onStartLesson: (lessonId: string) => void
  onStartDaily: () => void
}

export function Home({ onStartLesson, onStartDaily }: HomeProps) {
  const xp = useGameStore((s) => s.xp)
  const streak = useGameStore((s) => s.streak)
  const currentTrack = useGameStore((s) => s.currentTrack)
  const setTrack = useGameStore((s) => s.setTrack)
  const completed = useGameStore((s) => s.completedLessons)
  const completedCount = useCompletedCount()

  const [selected, setSelected] = useState<Lesson | null>(null)
  const lessons = lessonsForTrack(currentTrack)
  const hello = useMemo(() => greeting(), [])
  const isNewUser = completedCount === 0

  const handleStart = () => {
    if (!selected) return
    onStartLesson(selected.id)
    setSelected(null)
  }

  return (
    <>
      <ParallaxBackdrop />
      <PageShell className="pb-28">
        <motion.header
          variants={fadeUp}
          initial="initial"
          animate="in"
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-line/5 shadow-sm">
            <Flame size={16} className="text-xp" strokeWidth={3} />
            <span className="text-sm font-extrabold tabular-nums">
              {streak}
            </span>
          </div>
          <h1 className="text-base font-extrabold tracking-tight">FinDuo</h1>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-line/5 shadow-sm">
            <Zap size={16} className="text-primary" strokeWidth={3} />
            <span className="text-sm font-extrabold tabular-nums">{xp}</span>
          </div>
        </motion.header>

        {isNewUser ? (
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="in"
            className="mb-3 rounded-2xl p-4 bg-card border-b-2 border-line/5 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Sparkles size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight">
                {hello}
              </div>
              <div className="text-[12px] text-fg/60 leading-snug">
                Start with the first lesson below, or jump to any track.
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="in"
            className="mb-3"
          >
            <DailyChallengeCard onStart={onStartDaily} />
          </motion.div>
        )}

        <motion.nav
          variants={fadeUp}
          initial="initial"
          animate="in"
          className="flex gap-2 mb-2"
        >
          {TRACKS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTrack(t.id)}
              className={`flex-1 px-2 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition-colors ${
                currentTrack === t.id
                  ? 'bg-fg text-canvas'
                  : 'bg-card text-fg/60 hover:bg-fg/5 border border-line/10'
              }`}
            >
              <div className="text-base mb-0.5">{t.emoji}</div>
              {t.label}
            </button>
          ))}
        </motion.nav>

        <LessonPath lessons={lessons} onLessonTap={setSelected} />
      </PageShell>

      <AnimatePresence>
        {selected && (
          <LessonPreview
            key={selected.id}
            lesson={selected}
            alreadyCompleted={!!completed[selected.id]}
            onClose={() => setSelected(null)}
            onStart={handleStart}
          />
        )}
      </AnimatePresence>
    </>
  )
}
