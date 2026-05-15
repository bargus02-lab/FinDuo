import { AnimatePresence, motion } from 'framer-motion'
import { Mascot, type MascotMood } from './Mascot'
import { MascotBubble } from './MascotBubble'

interface MascotMomentProps {
  mood: MascotMood
  line: string | null
  size?: number
  tone?: 'neutral' | 'correct' | 'wrong'
}

export function MascotMoment({
  mood,
  line,
  size = 80,
  tone = 'neutral',
}: MascotMomentProps) {
  return (
    <div className="flex items-end justify-end gap-2 min-h-[80px]">
      <AnimatePresence mode="wait">
        {line ? (
          <MascotBubble key={line} text={line} side="right" tone={tone} />
        ) : null}
      </AnimatePresence>
      <motion.div
        layout
        initial={{ scale: 0.6, opacity: 0, x: 12 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="shrink-0"
      >
        <Mascot mood={mood} size={size} />
      </motion.div>
    </div>
  )
}
