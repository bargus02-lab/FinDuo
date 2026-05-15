import { motion } from 'framer-motion'
import { Droplet } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '../Button'

const SENIOR = 0.7
const MEZZ = 0.2
const EQUITY = 0.1

interface Tranche {
  id: 'senior' | 'mezz' | 'equity'
  label: string
  notional: number
  color: string
  delay: number
}

function computePayouts(pool: number, defaultRate: number) {
  const surviving = pool * (1 - defaultRate)
  const seniorNotional = pool * SENIOR
  const mezzNotional = pool * MEZZ
  const equityNotional = pool * EQUITY

  let rem = surviving
  const seniorPaid = Math.min(rem, seniorNotional)
  rem -= seniorPaid
  const mezzPaid = Math.min(rem, mezzNotional)
  rem -= mezzPaid
  const equityPaid = Math.min(rem, equityNotional)

  return {
    senior: seniorPaid / seniorNotional,
    mezz: mezzPaid / mezzNotional,
    equity: equityPaid / equityNotional,
    seniorPaid,
    mezzPaid,
    equityPaid,
    seniorNotional,
    mezzNotional,
    equityNotional,
  }
}

interface WaterfallVisualizerProps {
  onFinish: () => void
}

export function WaterfallVisualizer({ onFinish }: WaterfallVisualizerProps) {
  const [pool, setPool] = useState(500) // $M
  const [defaultRate, setDefaultRate] = useState(0.05)
  const [runId, setRunId] = useState(0)
  const [played, setPlayed] = useState(false)

  const result = useMemo(
    () => computePayouts(pool, defaultRate),
    [pool, defaultRate],
  )

  const tranches: (Tranche & { paid: number; notional: number; payout: number })[] = [
    {
      id: 'senior',
      label: 'Senior',
      notional: result.seniorNotional,
      color: '#1CB0F6',
      delay: 0.1,
      paid: result.senior,
      payout: result.seniorPaid,
    },
    {
      id: 'mezz',
      label: 'Mezzanine',
      notional: result.mezzNotional,
      color: '#CE82FF',
      delay: 0.9,
      paid: result.mezz,
      payout: result.mezzPaid,
    },
    {
      id: 'equity',
      label: 'Equity',
      notional: result.equityNotional,
      color: '#FFC800',
      delay: 1.7,
      paid: result.equity,
      payout: result.equityPaid,
    },
  ]

  return (
    <div className="space-y-5">
      <div className="bg-card rounded-2xl p-5 border-b-2 border-line/5 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs uppercase tracking-wider font-bold text-fg/50">
              Pool size
            </span>
            <span className="text-base font-extrabold tabular-nums">
              ${pool}M
            </span>
          </div>
          <input
            type="range"
            min={100}
            max={1000}
            step={50}
            value={pool}
            onChange={(e) => {
              setPool(Number(e.target.value))
              setPlayed(false)
            }}
            className="w-full accent-primary cursor-pointer"
            aria-label="Pool size"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs uppercase tracking-wider font-bold text-fg/50">
              Default rate
            </span>
            <span className="text-base font-extrabold tabular-nums">
              {(defaultRate * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={0.4}
            step={0.01}
            value={defaultRate}
            onChange={(e) => {
              setDefaultRate(Number(e.target.value))
              setPlayed(false)
            }}
            className="w-full accent-wrong cursor-pointer"
            aria-label="Default rate"
          />
        </div>
      </div>

      <div className="bg-card rounded-2xl p-4 border-b-2 border-line/5">
        <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-wider font-bold text-fg/50">
          <Droplet size={12} strokeWidth={2.5} />
          Cash from pool: ${Math.round(pool * (1 - defaultRate))}M
          <span className="text-wrong">
            (−${Math.round(pool * defaultRate)}M defaults)
          </span>
        </div>
        <div className="space-y-3">
          {tranches.map((t) => (
            <div key={`${t.id}-${runId}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-extrabold">{t.label}</div>
                <div className="text-xs font-bold tabular-nums text-fg/50">
                  ${Math.round(t.payout)}M / ${Math.round(t.notional)}M
                  <span
                    className={`ml-2 ${t.paid >= 1 ? 'text-primary' : t.paid > 0 ? 'text-xp' : 'text-wrong'}`}
                  >
                    {(t.paid * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="h-9 bg-fg/10 rounded-xl overflow-hidden relative">
                <motion.div
                  className="h-full rounded-xl"
                  style={{ background: t.color }}
                  key={runId}
                  initial={{ width: '0%' }}
                  animate={{ width: `${t.paid * 100}%` }}
                  transition={{
                    duration: 1.1,
                    delay: t.delay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onAnimationComplete={() => {
                    if (t.id === 'equity') setPlayed(true)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          onClick={() => {
            setRunId((r) => r + 1)
            setPlayed(false)
          }}
        >
          Replay
        </Button>
        <Button variant="primary" onClick={onFinish} disabled={!played}>
          {played ? 'Done' : 'Watch it pour'}
        </Button>
      </div>
    </div>
  )
}
