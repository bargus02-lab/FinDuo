import { motion } from 'framer-motion'
import { Sparkles, Zap } from 'lucide-react'
import type { Lesson } from '../data/lessons'
import { Button } from './Button'

interface LessonPreviewProps {
  lesson: Lesson
  alreadyCompleted: boolean
  onClose: () => void
  onStart: () => void
}

export function LessonPreview({
  lesson,
  alreadyCompleted,
  onClose,
  onStart,
}: LessonPreviewProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
        className="fixed inset-0 bg-fg/40 z-40"
      />
      <motion.div
        role="dialog"
        aria-label={lesson.title}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="fixed bottom-0 inset-x-0 z-50 mx-auto max-w-md bg-card rounded-t-3xl p-6 pb-8 shadow-2xl"
      >
        <div className="w-10 h-1.5 rounded-full bg-fg/10 mx-auto mb-4" />

        <div className="flex items-start gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            {lesson.type === 'simulation' ? (
              <Sparkles size={22} strokeWidth={2.5} />
            ) : (
              <Zap size={22} strokeWidth={2.5} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-extrabold tracking-tight leading-tight">
              {lesson.title}
            </h2>
            <div className="text-xs font-bold text-primary mt-0.5">
              +{lesson.xp} XP{alreadyCompleted ? ' · already done' : ''}
            </div>
          </div>
        </div>

        <p className="text-sm text-fg/60 mb-6 leading-relaxed">
          {lesson.description}
        </p>

        <Button variant="primary" className="w-full" onClick={onStart}>
          {alreadyCompleted ? 'Review' : 'Start'}
        </Button>
      </motion.div>
    </>
  )
}
