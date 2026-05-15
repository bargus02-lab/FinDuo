import { motion } from 'framer-motion'
import { Calendar, Check, Clock, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  formatTimeRemaining,
  secondsToMidnight,
} from '../data/dailyChallenges'
import { useDailyChallengeAvailable } from '../store/useGameStore'

interface DailyChallengeCardProps {
  onStart: () => void
}

export function DailyChallengeCard({ onStart }: DailyChallengeCardProps) {
  const available = useDailyChallengeAvailable()
  const [remaining, setRemaining] = useState(() => secondsToMidnight())

  useEffect(() => {
    const id = setInterval(() => setRemaining(secondsToMidnight()), 30_000)
    return () => clearInterval(id)
  }, [])

  if (!available) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-3 bg-primary/10 border border-primary/20 flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center">
          <Check size={18} strokeWidth={3} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-extrabold leading-tight">
            Daily challenge done
          </div>
          <div className="text-[11px] text-ink/60 flex items-center gap-1">
            <Clock size={11} strokeWidth={2.5} />
            Resets in {formatTimeRemaining(remaining)}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.button
      onClick={onStart}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left rounded-2xl p-3 bg-gradient-to-br from-primary to-[#46A302] text-white border-b-2 border-[#3A8902]"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
          <Calendar size={20} strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Sparkles size={12} strokeWidth={3} />
            <span className="text-[10px] uppercase tracking-wider font-bold opacity-80">
              Daily challenge
            </span>
          </div>
          <div className="font-extrabold text-sm leading-tight">
            One question · +20 XP
          </div>
        </div>
        <div className="text-[11px] font-bold bg-white/15 rounded-lg px-2 py-1 flex items-center gap-1">
          <Clock size={10} strokeWidth={3} />
          {formatTimeRemaining(remaining)}
        </div>
      </div>
    </motion.button>
  )
}
