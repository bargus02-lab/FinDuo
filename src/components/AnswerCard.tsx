import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { cn } from '../lib/cn'

export type AnswerState =
  | 'idle'
  | 'selected'
  | 'correct-pick'
  | 'wrong-pick'
  | 'revealed-correct'
  | 'dimmed'

interface AnswerCardProps {
  label: string
  state: AnswerState
  letter: string
  onClick?: () => void
  disabled?: boolean
}

const baseRow =
  'w-full flex items-center gap-3 text-left px-4 py-3.5 rounded-2xl border-2 transition-colors select-none'

const stateClass: Record<AnswerState, string> = {
  idle: 'bg-white border-ink/10 hover:border-ink/30 text-ink',
  selected: 'bg-primary/10 border-primary text-ink',
  'correct-pick': 'bg-primary border-primary text-white',
  'wrong-pick': 'bg-wrong border-wrong text-white',
  'revealed-correct': 'bg-primary/15 border-primary text-ink',
  dimmed: 'bg-white border-ink/10 text-ink/40',
}

const letterClass: Record<AnswerState, string> = {
  idle: 'bg-ink/5 text-ink/60 border border-ink/10',
  selected: 'bg-white text-primary border border-primary',
  'correct-pick': 'bg-white/20 text-white border border-white/30',
  'wrong-pick': 'bg-white/20 text-white border border-white/30',
  'revealed-correct': 'bg-white text-primary border border-primary',
  dimmed: 'bg-ink/5 text-ink/30 border border-ink/5',
}

export function AnswerCard({
  label,
  state,
  letter,
  onClick,
  disabled,
}: AnswerCardProps) {
  const interactive = !disabled && state !== 'dimmed' && state !== 'revealed-correct'

  return (
    <motion.button
      type="button"
      onClick={interactive ? onClick : undefined}
      disabled={!interactive}
      animate={
        state === 'wrong-pick'
          ? { x: [-8, 8, -6, 6, -3, 3, 0] }
          : state === 'correct-pick'
            ? { scale: [1, 1.05, 1] }
            : { x: 0, scale: 1 }
      }
      transition={
        state === 'wrong-pick'
          ? { duration: 0.4 }
          : state === 'correct-pick'
            ? { duration: 0.35, ease: 'easeOut' }
            : { duration: 0.15 }
      }
      whileTap={interactive ? { scale: 0.98 } : undefined}
      className={cn(baseRow, stateClass[state])}
    >
      <span
        className={cn(
          'shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold',
          letterClass[state],
        )}
      >
        {state === 'correct-pick' || state === 'revealed-correct' ? (
          <Check size={14} strokeWidth={3.5} />
        ) : state === 'wrong-pick' ? (
          <X size={14} strokeWidth={3.5} />
        ) : (
          letter
        )}
      </span>
      <span className="font-semibold leading-snug">{label}</span>
    </motion.button>
  )
}
