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
import { getDailyQuestion } from '../data/dailyChallenges'
import { pickLine } from '../data/mascotLines'
import { fadeUp } from '../lib/animations'
import { sound } from '../lib/sound'
import { useGameStore } from '../store/useGameStore'

const CORRECT_KUDOS = ['Sharp!', 'Nice!', 'On the money!', 'Yes!']
const WRONG_KINDS = ['Not quite', 'Almost', 'Tomorrow’s a fresh one']

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

type Resolved = null | 'correct' | 'wrong'
type Phase = 'playing' | 'complete'

const DAILY_XP_CORRECT = 20

interface DailyChallengeScreenProps {
  onComplete: () => void
  onExit: () => void
}

export function DailyChallengeScreen({
  onComplete,
  onExit,
}: DailyChallengeScreenProps) {
  const question = useMemo(() => getDailyQuestion(), [])
  const [phase, setPhase] = useState<Phase>('playing')
  const [selected, setSelected] = useState<number | null>(null)
  const [resolved, setResolved] = useState<Resolved>(null)
  const [snapshot, setSnapshot] = useState<CompleteSnapshot | null>(null)
  const [earned, setEarned] = useState(0)

  const [mascotMood, setMascotMood] = useState<MascotMood>('wave')
  const [mascotLine, setMascotLine] = useState<string>(() => pickLine('daily'))

  const kudos = useMemo(
    () => (resolved === 'correct' ? pick(CORRECT_KUDOS) : pick(WRONG_KINDS)),
    [resolved],
  )

  useEffect(() => {
    const t = setTimeout(() => {
      setMascotMood('idle')
      setMascotLine(pickLine('thinking'))
    }, 2000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (resolved === 'correct') {
      setMascotMood('correct')
      setMascotLine(pickLine('correct'))
    } else if (resolved === 'wrong') {
      setMascotMood('wrong')
      setMascotLine(pickLine('wrong'))
    }
  }, [resolved])

  const handleCheck = () => {
    if (selected === null || resolved) return
    const isCorrect = selected === question.correctIndex
    setResolved(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) sound.correct()
    else sound.wrong()
  }

  const handleContinue = () => {
    const state = useGameStore.getState()
    const xpToAward = resolved === 'correct' ? DAILY_XP_CORRECT : 0
    setEarned(xpToAward)
    setSnapshot({
      xpBefore: state.xp,
      streakBefore: state.streak,
      score: resolved === 'correct' ? 1 : 0,
      total: 1,
    })
    state.completeDailyChallenge(xpToAward)
    setPhase('complete')
    sound.complete()
  }

  const cardState = (i: number): AnswerState => {
    if (resolved === null) return i === selected ? 'selected' : 'idle'
    if (i === selected && i === question.correctIndex) return 'correct-pick'
    if (i === selected && i !== question.correctIndex) return 'wrong-pick'
    if (i === question.correctIndex) return 'revealed-correct'
    return 'dimmed'
  }

  if (phase === 'complete' && snapshot) {
    return (
      <LessonComplete
        title="Daily challenge"
        headline={
          resolved === 'correct' ? 'Daily nailed' : 'Streak preserved'
        }
        snapshot={snapshot}
        xpAfter={snapshot.xpBefore + earned}
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
          aria-label="Exit daily challenge"
          className="w-9 h-9 rounded-xl bg-card border border-line/10 flex items-center justify-center text-fg/50 hover:text-fg hover:border-line/30 transition-colors"
        >
          <X size={18} strokeWidth={3} />
        </button>
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-wider font-bold text-primary">
            Daily challenge
          </div>
        </div>
        <div className="text-xs font-bold text-primary">
          +{DAILY_XP_CORRECT} XP
        </div>
      </header>

      <main className="flex-1 px-5 max-w-md mx-auto w-full pb-48">
        <motion.div variants={fadeUp} initial="initial" animate="in">
          <h1 className="text-xl font-extrabold tracking-tight leading-snug mb-4 mt-4">
            {question.prompt}
          </h1>
          <div className="mb-3">
            <MascotMoment
              mood={mascotMood}
              line={mascotLine}
              tone={
                resolved === 'correct'
                  ? 'correct'
                  : resolved === 'wrong'
                    ? 'wrong'
                    : 'neutral'
              }
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
              Finish
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
