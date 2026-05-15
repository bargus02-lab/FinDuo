import { motion } from 'framer-motion'
import { Home, Pizza, PiggyBank, Gamepad2 } from 'lucide-react'
import type { ComponentType } from 'react'
import { useState } from 'react'
import { Button } from '../Button'

const PAYCHECK = 5000

interface Bucket {
  id: 'rent' | 'food' | 'savings' | 'fun'
  label: string
  Icon: ComponentType<{ size?: number; strokeWidth?: number }>
  color: string
  initial: number
  max: number
  guidance: string
}

const BUCKETS: Bucket[] = [
  {
    id: 'rent',
    label: 'Rent & bills',
    Icon: Home,
    color: 'bg-primary',
    initial: 30,
    max: 60,
    guidance: 'Ideal: 25–35%',
  },
  {
    id: 'food',
    label: 'Food',
    Icon: Pizza,
    color: 'bg-wrong',
    initial: 15,
    max: 40,
    guidance: 'Ideal: 10–15%',
  },
  {
    id: 'savings',
    label: 'Savings',
    Icon: PiggyBank,
    color: 'bg-xp',
    initial: 20,
    max: 60,
    guidance: 'Ideal: 15%+',
  },
  {
    id: 'fun',
    label: 'Fun',
    Icon: Gamepad2,
    color: 'bg-[#CE82FF]',
    initial: 10,
    max: 40,
    guidance: 'Ideal: 5–15%',
  },
]

function computeHealth(a: Record<Bucket['id'], number>): number {
  let score = 50
  // Rent
  if (a.rent <= 35) score += 10
  if (a.rent > 40) score -= 15
  if (a.rent > 50) score -= 15
  // Food
  if (a.food <= 15) score += 5
  if (a.food > 25) score -= 8
  // Savings
  if (a.savings >= 20) score += 25
  else if (a.savings >= 10) score += 10
  else if (a.savings < 5) score -= 20
  // Fun
  if (a.fun >= 5 && a.fun <= 15) score += 5
  if (a.fun > 25) score -= 8
  // Total
  const total = a.rent + a.food + a.savings + a.fun
  if (total > 100) score -= (total - 100) * 1.5
  if (total < 90) score -= (90 - total) * 0.5
  return Math.max(0, Math.min(100, Math.round(score)))
}

function healthLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Thriving', color: 'text-primary' }
  if (score >= 60) return { label: 'Healthy', color: 'text-primary' }
  if (score >= 40) return { label: 'Wobbly', color: 'text-xp' }
  return { label: 'Stressed', color: 'text-wrong' }
}

interface BudgetAllocatorProps {
  onFinish: () => void
}

export function BudgetAllocator({ onFinish }: BudgetAllocatorProps) {
  const [alloc, setAlloc] = useState<Record<Bucket['id'], number>>({
    rent: 30,
    food: 15,
    savings: 20,
    fun: 10,
  })

  const total = alloc.rent + alloc.food + alloc.savings + alloc.fun
  const health = computeHealth(alloc)
  const { label, color } = healthLabel(health)
  const totalOk = total >= 95 && total <= 100

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5 border-b-2 border-black/5">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-ink/50 mb-1">
          <span>Monthly take-home</span>
          <span>Allocated</span>
        </div>
        <div className="flex items-end justify-between mb-4">
          <div className="text-2xl font-extrabold tabular-nums">
            ${PAYCHECK.toLocaleString()}
          </div>
          <div
            className={`text-2xl font-extrabold tabular-nums ${
              totalOk
                ? 'text-primary'
                : total > 100
                  ? 'text-wrong'
                  : 'text-ink/40'
            }`}
          >
            {total}%
          </div>
        </div>

        <div className="text-xs uppercase tracking-wider font-bold text-ink/50 mb-1">
          Financial health
        </div>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex-1 h-3 bg-ink/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                health >= 60
                  ? 'bg-primary'
                  : health >= 40
                    ? 'bg-xp'
                    : 'bg-wrong'
              }`}
              animate={{ width: `${health}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            />
          </div>
          <div className="tabular-nums font-extrabold text-lg w-10 text-right">
            {health}
          </div>
        </div>
        <div className={`text-xs font-bold ${color}`}>{label}</div>
      </div>

      <div className="space-y-3">
        {BUCKETS.map((b) => {
          const value = alloc[b.id]
          const dollars = Math.round((value / 100) * PAYCHECK)
          return (
            <div
              key={b.id}
              className="bg-white rounded-2xl p-4 border-b-2 border-black/5"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-9 h-9 rounded-xl ${b.color} text-white flex items-center justify-center`}
                >
                  <b.Icon size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="font-extrabold text-sm">{b.label}</div>
                  <div className="text-[11px] text-ink/50">{b.guidance}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold tabular-nums text-base">
                    {value}%
                  </div>
                  <div className="text-[11px] text-ink/50 tabular-nums">
                    ${dollars.toLocaleString()}
                  </div>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={b.max}
                value={value}
                onChange={(e) =>
                  setAlloc((a) => ({ ...a, [b.id]: Number(e.target.value) }))
                }
                className="w-full accent-primary cursor-pointer"
                aria-label={b.label}
              />
            </div>
          )
        })}
      </div>

      <Button
        variant="primary"
        className="w-full"
        onClick={onFinish}
        disabled={!totalOk}
      >
        {totalOk ? 'Save budget' : 'Make it add up to 100%'}
      </Button>
    </div>
  )
}
