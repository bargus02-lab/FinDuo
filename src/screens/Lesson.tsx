import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { AnswerCard, type AnswerState } from '../components/AnswerCard'
import { Button } from '../components/Button'
import {
  LessonComplete,
  type CompleteSnapshot,
} from '../components/LessonComplete'
import { type MascotMood } from '../components/Mascot'
import { MascotMoment } from '../components/MascotMoment'
import { PageShell } from '../components/PageShell'
import { ProgressBar } from '../components/ProgressBar'
import type { Lesson } from '../data/lessons'
import { pickLine } from '../data/mascotLines'
import { fadeUp } from '../lib/animations'
import { sound } from '../lib/sound'
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

export function LessonScreen({ lesson, onComplete, onExit }: LessonScreenProps) {
  const questions = lesson.questions ?? []
  const [phase, setPhase] = useState<Phase>('playing')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [resolved, setResolved] = useState<Resolved>(null)
  const [score, setScore] = useState(0)
  const [snapshot, setSnapshot] = useState<CompleteSnapshot | null>(null)

  // Mascot — wave on entry, idle/thinking while picking, react on Check.
  const [mascotMood, setMascotMood] = useState<MascotMood>('wave')
  const [mascotLine, setMascotLine] = useState<string>(() => pickLine('start'))

  const question = questions[index]
  const total = questions.length
  const isLast = index === total - 1

  const kudos = useMemo(
    () => (resolved === 'correct' ? pick(CORRECT_KUDOS) : pick(WRONG_KINDS)),
    [resolved, index],
  )

  // Wave on mount → settle into thinking after ~2s.
  useEffect(() => {
    const t = setTimeout(() => {
      setMascotMood('idle')
      setMascotLine(pickLine('thinking'))
    }, 2200)
    return () => clearTimeout(t)
  }, [])

  // Rotate thinking lines every ~7s while idle.
  useEffect(() => {
    if (mascotMood !== 'idle') return
    const t = setInterval(() => {
      setMascotLine(pickLine('thinking'))
    }, 7000)
    return () => clearInterval(t)
  }, [mascotMood])

  // React to user selecting an answer (lean in).
  useEffect(() => {
    if (resolved !== null) return
    if (selected !== null && mascotMood !== 'thinking') {
      setMascotMood('thinking')
    }
  }, [selected, resolved, mascotMood])

  // React to Check outcome.
  useEffect(() => {
    if (resolved === 'correct') {
      setMascotMood('correct')
      setMascotLine(pickLine('correct'))
    } else if (resolved === 'wrong') {
      setMascotMood('wrong')
      setMascotLine(pickLine('wrong'))
    }
  }, [resolved])

  // Reset mascot on next question.
  useEffect(() => {
    if (resolved === null) {
      setMascotMood('idle')
      setMascotLine(pickLine('thinking'))
    }
  }, [index])

  if (!question) {
    return (
      <PageShell>
        <div className="text-center py-20">
          <p className="text-fg/60 mb-4">This lesson has no questions yet.</p>
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
    if (isCorrect) {
      setScore((s) => s + 1)
      sound.correct()
    } else {
      sound.wrong()
    }
  }

  const handleContinue = () => {
    if (isLast) {
      const state = useGameStore.getState()
      setSnapshot({
        xpBefore: state.xp,
        streakBefore: state.streak,
        score,
        total,
      })
      state.completeLesson(lesson.id, lesson.xp)
      setPhase('complete')
      sound.complete()
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
      <LessonComplete
        title={lesson.title}
        snapshot={snapshot}
        xpAfter={snapshot.xpBefore + lesson.xp}
        streakAfter={useGameStore.getState().streak}
        onContinue={onComplete}
      />
    )
  }

  const bubbleTone: 'neutral' | 'correct' | 'wrong' =
    resolved === 'correct'
      ? 'correct'
      : resolved === 'wrong'
        ? 'wrong'
        : 'neutral'

  return (
    <div className="min-h-full flex flex-col">
      <header className="px-5 pt-4 pb-3 flex items-center gap-3 max-w-md mx-auto w-full">
        <button
          onClick={onExit}
          aria-label="Exit lesson"
          className="w-9 h-9 rounded-xl bg-card border border-line/10 flex items-center justify-center text-fg/50 hover:text-fg hover:border-line/30 transition-colors"
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
          <div className="text-[11px] uppercase tracking-wider font-bold text-fg/40 mb-2 mt-2">
            Question {index + 1} of {total}
          </div>
          <h1 className="text-xl font-extrabold tracking-tight leading-snug mb-4">
            {question.prompt}
          </h1>

          <div className="mb-3">
            <MascotMoment
              mood={mascotMood}
              line={mascotLine}
              tone={bubbleTone}
              size={72}
            />
          </div>

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
              <div className="w-9 h-9 rounded-full bg-card/20 flex items-center justify-center">
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
            className="fixed bottom-0 inset-x-0 z-30 max-w-md mx-auto px-5 pt-4 pb-6 bg-gradient-to-t from-canvas via-canvas to-transparent"
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
