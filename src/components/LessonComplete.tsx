import { motion } from 'framer-motion'
import { Flame, Zap } from 'lucide-react'
import { AnimatedNumber } from './AnimatedNumber'
import { BigCheck } from './BigCheck'
import { Button } from './Button'
import { ConfettiBurst } from './ConfettiBurst'
import { cn } from '../lib/cn'

export interface CompleteSnapshot {
  xpBefore: number
  streakBefore: number
  score?: number
  total?: number
}

interface LessonCompleteProps {
  title: string
  headline?: string
  snapshot: CompleteSnapshot
  xpAfter: number
  streakAfter: number
  onContinue: () => void
}

export function LessonComplete({
  title,
  headline,
  snapshot,
  xpAfter,
  streakAfter,
  onContinue,
}: LessonCompleteProps) {
  const streakBumped = streakAfter > snapshot.streakBefore
  const isPerfect =
    snapshot.score !== undefined &&
    snapshot.total !== undefined &&
    snapshot.score === snapshot.total
  const computedHeadline =
    headline ?? (isPerfect ? 'Perfect!' : 'Lesson complete')

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
        className="text-3xl font-extrabold tracking-tight mt-6 mb-1 text-center"
      >
        {computedHeadline}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-ink/60 text-sm mb-8 text-center"
      >
        {snapshot.score !== undefined && snapshot.total !== undefined ? (
          <>
            {snapshot.score}/{snapshot.total} correct on{' '}
            <span className="font-semibold text-ink">{title}</span>
          </>
        ) : (
          <span className="font-semibold text-ink">{title}</span>
        )}
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
          className={cn(
            'rounded-2xl p-4 border-b-2 text-center relative overflow-hidden',
            streakBumped ? 'bg-xp/15 border-xp/30' : 'bg-white border-black/5',
          )}
        >
          {streakBumped && (
            <div className="absolute inset-0 pointer-events-none">
              <ConfettiBurst count={22} spread={90} duration={1.1} />
            </div>
          )}
          <motion.div
            animate={
              streakBumped
                ? { rotate: [-8, 8, -4, 0], scale: [1, 1.3, 1] }
                : undefined
            }
            transition={{ duration: 0.6, delay: 0.7 }}
            className="inline-block relative"
          >
            <Flame className="w-5 h-5 mx-auto mb-1 text-xp" strokeWidth={2.5} />
          </motion.div>
          <div className="text-2xl font-extrabold tabular-nums text-xp relative">
            <AnimatedNumber
              from={snapshot.streakBefore}
              to={streakAfter}
              delay={0.7}
              duration={0.8}
            />
          </div>
          <div className="text-[10px] uppercase tracking-wider font-bold text-ink/50 relative">
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
