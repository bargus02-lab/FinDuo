import { motion } from 'framer-motion'
import { cn } from '../lib/cn'

interface ProgressBarProps {
  progress: number
  className?: string
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, progress)) * 100
  return (
    <div
      className={cn(
        'h-3 rounded-full bg-ink/10 overflow-hidden relative',
        className,
      )}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full bg-primary relative"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 160, damping: 28 }}
      >
        <span className="absolute inset-x-0 top-0.5 h-1 bg-white/30 rounded-full" />
      </motion.div>
    </div>
  )
}
