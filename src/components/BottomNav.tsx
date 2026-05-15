import { motion } from 'framer-motion'
import { GraduationCap, Trophy, User, type LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'
import { cn } from '../lib/cn'

export type Tab = 'home' | 'leaderboard' | 'profile'

interface BottomNavProps {
  active: Tab
  onChange: (tab: Tab) => void
}

interface TabDef {
  id: Tab
  label: string
  Icon: ComponentType<LucideProps>
}

const TABS: TabDef[] = [
  { id: 'home', label: 'Learn', Icon: GraduationCap },
  { id: 'leaderboard', label: 'Ranks', Icon: Trophy },
  { id: 'profile', label: 'You', Icon: User },
]

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 max-w-md mx-auto px-3 pb-3 pt-2 pointer-events-none">
      <div className="pointer-events-auto bg-white rounded-2xl border border-ink/10 shadow-lg flex">
        {TABS.map((t) => {
          const isActive = t.id === active
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className="flex-1 relative py-2.5"
              aria-current={isActive ? 'page' : undefined}
              aria-label={t.label}
            >
              <div className="flex flex-col items-center gap-0.5 relative">
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 -inset-x-2 bg-primary/10 rounded-xl"
                    transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                  />
                )}
                <t.Icon
                  size={20}
                  strokeWidth={2.5}
                  className={cn(
                    'relative',
                    isActive ? 'text-primary' : 'text-ink/50',
                  )}
                />
                <span
                  className={cn(
                    'relative text-[10px] font-extrabold uppercase tracking-wider',
                    isActive ? 'text-primary' : 'text-ink/50',
                  )}
                >
                  {t.label}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
