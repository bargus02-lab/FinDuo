import { AnimatePresence, motion } from 'framer-motion'
import { Check, Flame, X, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { AnswerCard, type AnswerState } from '../components/AnswerCard'
import { BigCheck } from '../components/BigCheck'
import { Button } from '../components/Button'
import { ConfettiBurst } from '../components/ConfettiBurst'
import { PageShell } from '../components/PageShell'
import { ProgressBar } from '../components/ProgressBar'
import type { Lesson } from '../data/lessons'
import { fadeUp } from '../lib/animations'
import { useGameStore } from '../store/useGameStore'

const CORRECT_KUDOS = ['Nice!', 'You got it!', 'Sharp!', 'Yes!', 'Got it!']
const WRONG_KINDS = ['Not quite', 'Almost', 'So close']

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

type Resolved = null | 'correct' | 'wrong'
type Phase = 'playing' | 'complete'

interface LessonScreenProps {
  lesson: Lesson
  onComplete: () => void
  onExit: () => void
}

interface Snapshot {
  xpBefore: number
  streakBefore: number
  score: number
  total: number
}

export function LessonScreen({ lesson, onComplete, onExit }: LessonScreenProps) {
  const questions = lesson.questions ?? []
  const [phase, setPhase] = useState<Phase>('playing')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [resolved, setResolved] = useState<Resolved>(null)
  const [score, setScore] = useState(0)
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null)

  const question = questions[index]
  const total = questions.length
  const isLast = index === total - 1

  const kudos = useMemo(
    () => (resolved === 'correct' ? pick(CORRECT_KUDOS) : pick(WRONG_KINDS)),
    [resolved, index],
  )

  if (!question) {
    return (
      <PageShell>
        <div className="text-center py-20">
          <p className="text-ink/60 mb-4">This lesson has no questions yet.</p>
          <Button onClick={onExit} variant="secondary">
            Back
          </Button>
        </div>
      </PageShell>
    )
  }

  const handleCheck = () => {
    if (selected === null || resolved) return
    const isCorrect = selected === question.correctIndex
    setResolved(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore((s) => s + 1)
  }

  const handleContinue = () => {
    if (isLast) {
      // Capture pre-completion XP/streak for animation, then mutate the store.
      const state = useGameStore.getState()
      const finalScore = score + (resolved === 'correct' ? 0 : 0)
      setSnapshot({
        xpBefore: state.xp,
        streakBefore: state.streak,
        score: finalScore,
        total,
      })
      state.completeLesson(lesson.id, lesson.xp)
      setPhase('complete')
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setResolved(null)
  }

  const cardState = (i: number): AnswerState => {
    if (resolved === null) return i === selected ? 'selected' : 'idle'
    if (i === selected && i === question.correctIndex) return 'correct-pick'
    if (i === selected && i !== question.correctIndex) return 'wrong-pick'
    if (i === question.correctIndex) return 'revealed-correct'
    return 'dimmed'
  }

  const progress = (index + (resolved ? 1 : 0)) / total

  if (phase === 'complete' && snapshot) {
    return (
      <CompleteView
        lesson={lesson}
        snapshot={snapshot}
        xpAfter={snapshot.xpBefore + lesson.xp}
        streakAfter={useGameStore.getState().streak}
        onContinue={onComplete}
      />
    )
  }

  return (
    <div className="min-h-full flex flex-col">
      <header className="px-5 pt-4 pb-3 flex items-center gap-3 max-w-md mx-auto w-full">
        <button
          onClick={onExit}
          aria-label="Exit lesson"
          className="w-9 h-9 rounded-xl bg-white border border-ink/10 flex items-center justify-center text-ink/50 hover:text-ink hover:border-ink/30 transition-colors"
        >
          <X size={18} strokeWidth={3} />
        </button>
        <ProgressBar progress={progress} className="flex-1" />
      </header>

      <main className="flex-1 px-5 max-w-md mx-auto w-full pb-48">
        <motion.div
          key={question.prompt}
          variants={fadeUp}
          initial="initial"
          animate="in"
        >
          <div className="text-[11px] uppercase tracking-wider font-bold text-ink/40 mb-2 mt-2">
            Question {index + 1} of {total}
          </div>
          <h1 className="text-xl font-extrabold tracking-tight leading-snug mb-6">
            {question.prompt}
          </h1>

          <div className="space-y-2.5">
            {question.choices.map((choice, i) => (
              <AnswerCard
                key={i}
                label={choice}
                letter={String.fromCharCode(65 + i)}
                state={cardState(i)}
                onClick={() => !resolved && setSelected(i)}
                disabled={resolved !== null}
              />
            ))}
          </div>
        </motion.div>
      </main>

      <AnimatePresence mode="wait">
        {resolved ? (
          <motion.div
            key="banner"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className={`fixed bottom-0 inset-x-0 z-40 max-w-md mx-auto rounded-t-3xl px-6 pt-5 pb-7 ${
              resolved === 'correct'
                ? 'bg-primary text-white'
                : 'bg-wrong text-white'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                {resolved === 'correct' ? (
                  <Check size={20} strokeWidth={3.5} />
                ) : (
                  <X size={20} strokeWidth={3.5} />
                )}
              </div>
              <div className="text-xl font-extrabold tracking-tight">
                {kudos}
              </div>
            </div>
            {resolved === 'wrong' && (
              <div className="text-sm font-semibold mb-1 opacity-90">
                Correct: {question.choices[question.correctIndex]}
              </div>
            )}
            <p className="text-sm leading-relaxed opacity-90 mb-4">
              {question.explanation}
            </p>
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleContinue}
            >
              {isLast ? 'Finish' : 'Continue'}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="check"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 inset-x-0 z-30 max-w-md mx-auto px-5 pt-4 pb-6 bg-gradient-to-t from-cream via-cream to-transparent"
          >
            <Button
              variant="primary"
              className="w-full"
              disabled={selected === null}
              onClick={handleCheck}
            >
              Check
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Complete phase ────────────────────────────────────────────────────────

interface CompleteViewProps {
  lesson: Lesson
  snapshot: Snapshot
  xpAfter: number
  streakAfter: number
  onContinue: () => void
}

function CompleteView({
  lesson,
  snapshot,
  xpAfter,
  streakAfter,
  onContinue,
}: CompleteViewProps) {
  const streakBumped = streakAfter > snapshot.streakBefore
  const isPerfect = snapshot.score === snapshot.total

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-12 relative max-w-md mx-auto">
      <div className="relative">
        <ConfettiBurst />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <BigCheck size={140} />
        </motion.div>
      </div>

      <motion.h1
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="text-3xl font-extrabold tracking-tight mt-6 mb-1"
      >
        {isPerfect ? 'Perfect!' : 'Lesson complete'}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-ink/60 text-sm mb-8"
      >
        {snapshot.score}/{snapshot.total} correct on{' '}
        <span className="font-semibold text-ink">{lesson.title}</span>
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.4 }}
        className="grid grid-cols-2 gap-3 w-full mb-10"
      >
        <div className="bg-white rounded-2xl p-4 border-b-2 border-black/5 text-center">
          <Zap className="w-5 h-5 mx-auto mb-1 text-primary" strokeWidth={2.5} />
          <div className="text-2xl font-extrabold tabular-nums text-primary">
            <AnimatedNumber
              from={snapshot.xpBefore}
              to={xpAfter}
              delay={0.7}
              duration={1.1}
            />
          </div>
          <div className="text-[10px] uppercase tracking-wider font-bold text-ink/50">
            Total XP
          </div>
        </div>
        <div
          className={`rounded-2xl p-4 border-b-2 text-center ${
            streakBumped
              ? 'bg-xp/15 border-xp/30'
              : 'bg-white border-black/5'
          }`}
        >
          <motion.div
            animate={
              streakBumped
                ? { rotate: [-8, 8, -4, 0], scale: [1, 1.2, 1] }
                : undefined
            }
            transition={{ duration: 0.6, delay: 0.7 }}
            className="inline-block"
          >
            <Flame className="w-5 h-5 mx-auto mb-1 text-xp" strokeWidth={2.5} />
          </motion.div>
          <div className="text-2xl font-extrabold tabular-nums text-xp">
            <AnimatedNumber
              from={snapshot.streakBefore}
              to={streakAfter}
              delay={0.7}
              duration={0.8}
            />
          </div>
          <div className="text-[10px] uppercase tracking-wider font-bold text-ink/50">
            Day streak
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.4 }}
        className="w-full"
      >
        <Button variant="primary" className="w-full" onClick={onContinue}>
          Continue
        </Button>
      </motion.div>
    </div>
  )
}
