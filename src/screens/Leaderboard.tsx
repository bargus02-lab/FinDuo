import { motion } from 'framer-motion'
import { Crown, Medal, Trophy } from 'lucide-react'
import { PageShell } from '../components/PageShell'
import { buildLeaderboard } from '../data/leaderboard'
import { fadeUp, staggerChildren } from '../lib/animations'
import { useGameStore } from '../store/useGameStore'

const RANK_ICON = [Crown, Medal, Trophy] as const
const RANK_COLOR = ['text-xp', 'text-ink/50', 'text-[#CD7F32]'] as const

export function Leaderboard() {
  const xp = useGameStore((s) => s.xp)
  const entries = buildLeaderboard(xp)
  const userRank = entries.findIndex((e) => e.isUser) + 1

  return (
    <PageShell className="pb-28">
      <motion.header
        variants={fadeUp}
        initial="initial"
        animate="in"
        className="text-center mb-5 pt-2"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-xp text-white mb-2 shadow-card">
          <Trophy size={28} strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Leaderboard</h1>
        <p className="text-ink/50 text-xs">
          You’re ranked #{userRank} this week
        </p>
      </motion.header>

      <motion.ol
        variants={staggerChildren(0.04)}
        initial="initial"
        animate="in"
        className="space-y-2"
      >
        {entries.map((entry, i) => {
          const rank = i + 1
          const isPodium = rank <= 3
          const RankIcon = isPodium ? RANK_ICON[rank - 1] : null
          const rankColor = isPodium ? RANK_COLOR[rank - 1] : 'text-ink/40'

          return (
            <motion.li
              key={entry.name}
              variants={fadeUp}
              className={`flex items-center gap-3 rounded-2xl p-3 border-b-2 ${
                entry.isUser
                  ? 'bg-primary/10 border-primary/30 ring-2 ring-primary/20'
                  : 'bg-white border-black/5'
              }`}
            >
              <div className="w-8 flex items-center justify-center">
                {RankIcon ? (
                  <RankIcon
                    size={20}
                    strokeWidth={2.5}
                    className={rankColor}
                  />
                ) : (
                  <span
                    className={`text-xs font-extrabold tabular-nums ${rankColor}`}
                  >
                    {rank}
                  </span>
                )}
              </div>
              <div className="w-10 h-10 rounded-xl bg-ink/5 flex items-center justify-center text-xl">
                {entry.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-sm truncate">
                  {entry.name}
                  {entry.isUser && (
                    <span className="ml-2 text-[10px] uppercase tracking-wider text-primary font-extrabold">
                      You
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-ink/50">
                  {rank === 1
                    ? 'Top of the board'
                    : `${entries[0].xp - entry.xp} XP behind 1st`}
                </div>
              </div>
              <div className="text-right">
                <div className="font-extrabold tabular-nums">
                  {entry.xp.toLocaleString()}
                </div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-ink/40">
                  XP
                </div>
              </div>
            </motion.li>
          )
        })}
      </motion.ol>

      <p className="text-center text-[11px] text-ink/30 mt-6 italic">
        Competitors are simulated friends — for now.
      </p>
    </PageShell>
  )
}
