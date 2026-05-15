import { motion } from 'framer-motion'
import { cn } from '../lib/cn'

interface MascotBubbleProps {
  text: string
  side?: 'left' | 'right'
  tone?: 'neutral' | 'correct' | 'wrong'
  className?: string
}

export function MascotBubble({
  text,
  side = 'right',
  tone = 'neutral',
  className,
}: MascotBubbleProps) {
  const isCorrect = tone === 'correct'
  const isWrong = tone === 'wrong'
  const surface = isCorrect
    ? 'bg-primary text-white border-primary'
    : isWrong
      ? 'bg-wrong text-white border-wrong'
      : 'bg-card text-fg border-line/15'

  return (
    <motion.div
      key={text}
      initial={{ scale: 0.75, opacity: 0, y: 6 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: -4 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      className={cn(
        'relative inline-block max-w-[200px] rounded-2xl px-3 py-2 border-b-2 shadow-card',
        surface,
        className,
      )}
    >
      <span className="text-[13px] font-extrabold leading-tight">{text}</span>
      {/* tail */}
      <span
        aria-hidden
        className={cn(
          'absolute bottom-1.5 w-3 h-3 rotate-45 border-b-2',
          isCorrect
            ? 'bg-primary border-primary'
            : isWrong
              ? 'bg-wrong border-wrong'
              : 'bg-card border-line/15',
          side === 'right' ? '-right-1' : '-left-1',
        )}
      />
    </motion.div>
  )
}
