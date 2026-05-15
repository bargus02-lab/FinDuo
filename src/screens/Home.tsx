import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { Flame, Zap } from 'lucide-react'
import { useState } from 'react'
import { LessonPath } from '../components/LessonPath'
import { LessonPreview } from '../components/LessonPreview'
import { PageShell } from '../components/PageShell'
import { fadeUp } from '../lib/animations'
import { lessonsForTrack, type Lesson } from '../data/lessons'
import { TRACKS, useGameStore } from '../store/useGameStore'

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

export function Home() {
  const xp = useGameStore((s) => s.xp)
  const streak = useGameStore((s) => s.streak)
  const currentTrack = useGameStore((s) => s.currentTrack)
  const setTrack = useGameStore((s) => s.setTrack)
  const completed = useGameStore((s) => s.completedLessons)
  const completeLesson = useGameStore((s) => s.completeLesson)

  const [selected, setSelected] = useState<Lesson | null>(null)
  const lessons = lessonsForTrack(currentTrack)

  const handleStart = () => {
    if (!selected) return
    // Placeholder: until step 6 ships the actual lesson screen, "Start"
    // marks the lesson complete so the path progression is testable.
    if (!completed[selected.id]) {
      completeLesson(selected.id, selected.xp)
    }
    setSelected(null)
  }

  return (
    <>
      <ParallaxBackdrop />
      <PageShell>
        <motion.header
          variants={fadeUp}
          initial="initial"
          animate="in"
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-ink/5 shadow-sm">
            <Flame size={16} className="text-xp" strokeWidth={3} />
            <span className="text-sm font-extrabold tabular-nums">
              {streak}
            </span>
          </div>
          <h1 className="text-base font-extrabold tracking-tight">FinDuo</h1>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-ink/5 shadow-sm">
            <Zap size={16} className="text-primary" strokeWidth={3} />
            <span className="text-sm font-extrabold tabular-nums">{xp}</span>
          </div>
        </motion.header>

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
                  ? 'bg-ink text-cream'
                  : 'bg-white text-ink/60 hover:bg-ink/5 border border-ink/10'
              }`}
            >
              <div className="text-base mb-0.5">{t.emoji}</div>
              {t.label}
            </button>
          ))}
        </motion.nav>

        <LessonPath lessons={lessons} onLessonTap={setSelected} />

        <p className="text-xs text-ink/40 mt-12 text-center">
          Step 5 of 12 · learning tree (lesson screens land in step 6)
        </p>
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
