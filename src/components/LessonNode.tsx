import { motion } from 'framer-motion'
import { Check, Lock, Play, Sparkles } from 'lucide-react'
import type { ComponentType } from 'react'
import type { Lesson } from '../data/lessons'
import { cn } from '../lib/cn'

export type NodeState = 'completed' | 'current' | 'locked'

interface LessonNodeProps {
  lesson: Lesson
  state: NodeState
  onClick?: () => void
}

const stateStyles: Record<
  NodeState,
  { bg: string; text: string; shadow: string; ring: string }
> = {
  completed: {
    bg: 'bg-primary',
    text: 'text-white',
    shadow: '#46A302',
    ring: 'ring-4 ring-xp/70',
  },
  current: {
    bg: 'bg-primary',
    text: 'text-white',
    shadow: '#46A302',
    ring: '',
  },
  locked: {
    bg: 'bg-fg/10',
    text: 'text-fg/30',
    shadow: 'rgba(15,23,41,0.10)',
    ring: '',
  },
}

function defaultIcon(
  state: NodeState,
  type: Lesson['type'],
): ComponentType<{ size?: number; strokeWidth?: number }> {
  if (state === 'completed') return Check
  if (state === 'locked') return Lock
  return type === 'simulation' ? Sparkles : Play
}

export function LessonNode({ lesson, state, onClick }: LessonNodeProps) {
  const s = stateStyles[state]
  const Icon = defaultIcon(state, lesson.type)
  const interactive = state !== 'locked'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {state === 'current' && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full ring-4 ring-xp"
            animate={{ opacity: [0.3, 0.75, 0.3], scale: [1, 1.12, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <motion.button
          type="button"
          onClick={interactive ? onClick : undefined}
          disabled={!interactive}
          aria-label={
            state === 'locked'
              ? `Locked: ${lesson.title}. Complete the previous lesson to unlock.`
              : state === 'completed'
                ? `Completed: ${lesson.title}. Tap to review.`
                : `Start: ${lesson.title}`
          }
          style={{ boxShadow: `0 6px 0 0 ${s.shadow}` }}
          whileHover={
            interactive
              ? { y: -2, transition: { type: 'spring', stiffness: 400, damping: 18 } }
              : undefined
          }
          whileTap={
            interactive
              ? {
                  y: 6,
                  scale: 0.96,
                  boxShadow: `0 0 0 0 ${s.shadow}`,
                  transition: { duration: 0.07 },
                }
              : undefined
          }
          className={cn(
            'relative w-16 h-16 rounded-full flex items-center justify-center select-none',
            s.bg,
            s.text,
            s.ring,
            !interactive && 'cursor-not-allowed',
          )}
        >
          <Icon size={26} strokeWidth={3} />
        </motion.button>
      </div>
      <div
        className={cn(
          'text-center text-[11px] font-bold tracking-wide uppercase max-w-[120px] leading-tight',
          state === 'locked' ? 'text-fg/30' : 'text-fg/60',
        )}
      >
        {lesson.title}
      </div>
    </div>
  )
}
