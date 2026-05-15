import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '../Button'

interface Asset {
  id: string
  name: string
  emoji: string
  expectedReturn: number
  volatility: number
  color: string
  blurb: string
}

const ASSETS: Asset[] = [
  {
    id: 'sp500',
    name: 'S&P 500',
    emoji: '🇺🇸',
    expectedReturn: 0.08,
    volatility: 0.16,
    color: '#58CC02',
    blurb: 'Big-cap US stocks',
  },
  {
    id: 'intl',
    name: 'Intl stocks',
    emoji: '🌎',
    expectedReturn: 0.07,
    volatility: 0.19,
    color: '#1CB0F6',
    blurb: 'Developed markets',
  },
  {
    id: 'bonds',
    name: 'Bonds',
    emoji: '🏦',
    expectedReturn: 0.03,
    volatility: 0.05,
    color: '#CE82FF',
    blurb: 'Boring & steady',
  },
  {
    id: 'reits',
    name: 'Real estate',
    emoji: '🏘️',
    expectedReturn: 0.06,
    volatility: 0.18,
    color: '#FF9600',
    blurb: 'REITs',
  },
  {
    id: 'crypto',
    name: 'Crypto',
    emoji: '🪙',
    expectedReturn: 0.12,
    volatility: 0.7,
    color: '#FFC800',
    blurb: 'Volatile, high upside',
  },
  {
    id: 'cash',
    name: 'Cash',
    emoji: '💵',
    expectedReturn: 0.015,
    volatility: 0.001,
    color: '#9CA3AF',
    blurb: 'Safe but lazy',
  },
]

const START = 10000
const MONTHS = 60

function randn(): number {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function simulatePath(picks: Asset[]): number[] {
  const path: number[] = [START]
  const w = 1 / picks.length
  const ret = picks.reduce((s, a) => s + a.expectedReturn * w, 0)
  const variance = picks.reduce(
    (s, a) => s + Math.pow(a.volatility * w, 2),
    0,
  )
  const vol = Math.sqrt(variance)
  const mRet = ret / 12
  const mVol = vol / Math.sqrt(12)
  for (let i = 1; i <= MONTHS; i++) {
    const r = mRet + mVol * randn()
    path.push(Math.max(0, path[i - 1] * (1 + r)))
  }
  return path
}

interface PortfolioBuilderProps {
  onFinish: () => void
}

type Phase = 'picking' | 'running' | 'done'

export function PortfolioBuilder({ onFinish }: PortfolioBuilderProps) {
  const [picked, setPicked] = useState<string[]>([])
  const [phase, setPhase] = useState<Phase>('picking')
  const [path, setPath] = useState<number[]>([])
  const [step, setStep] = useState(0)

  const ready = picked.length === 3

  useEffect(() => {
    if (phase !== 'running') return
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= MONTHS) {
          clearInterval(id)
          setPhase('done')
          return s
        }
        return s + 1
      })
    }, 70)
    return () => clearInterval(id)
  }, [phase])

  const toggle = (id: string) => {
    setPicked((p) => {
      if (p.includes(id)) return p.filter((x) => x !== id)
      if (p.length >= 3) return p
      return [...p, id]
    })
  }

  const handleRun = () => {
    const selected = ASSETS.filter((a) => picked.includes(a.id))
    setPath(simulatePath(selected))
    setStep(0)
    setPhase('running')
  }

  const currentValue = path[step] ?? START
  const pctChange = ((currentValue - START) / START) * 100

  return (
    <div className="space-y-5">
      {phase === 'picking' && (
        <>
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-ink/50 mb-2">
              Pick 3 assets · {picked.length}/3
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {ASSETS.map((a) => {
                const isPicked = picked.includes(a.id)
                return (
                  <motion.button
                    key={a.id}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggle(a.id)}
                    className={`relative text-left p-3 rounded-2xl border-2 transition-colors ${
                      isPicked
                        ? 'border-primary bg-primary/5'
                        : 'border-ink/10 bg-white hover:border-ink/30'
                    }`}
                  >
                    {isPicked && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                        <Check size={12} strokeWidth={3.5} />
                      </div>
                    )}
                    <div className="text-2xl mb-1">{a.emoji}</div>
                    <div className="font-extrabold text-sm">{a.name}</div>
                    <div className="text-[11px] text-ink/50 mb-2">{a.blurb}</div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-ink/40">
                      <span>Ret {(a.expectedReturn * 100).toFixed(0)}%</span>
                      <span>Vol {(a.volatility * 100).toFixed(0)}%</span>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
          <Button
            variant="primary"
            className="w-full"
            onClick={handleRun}
            disabled={!ready}
          >
            {ready ? 'Run 5-year simulation' : `Pick ${3 - picked.length} more`}
          </Button>
        </>
      )}

      {(phase === 'running' || phase === 'done') && (
        <>
          <ValueChart path={path} step={step} />
          <div className="bg-white rounded-2xl p-5 border-b-2 border-black/5 text-center">
            <div className="text-xs uppercase tracking-wider font-bold text-ink/50 mb-1">
              {phase === 'running' ? 'Month' : 'Final'}{' '}
              {phase === 'running' ? `${step}/${MONTHS}` : ''}
            </div>
            <div className="text-3xl font-extrabold tabular-nums">
              ${Math.round(currentValue).toLocaleString()}
            </div>
            <div
              className={`text-sm font-bold ${pctChange >= 0 ? 'text-primary' : 'text-wrong'}`}
            >
              {pctChange >= 0 ? '+' : ''}
              {pctChange.toFixed(1)}% over 5 years
            </div>
          </div>
          <Button
            variant="primary"
            className="w-full"
            onClick={onFinish}
            disabled={phase !== 'done'}
          >
            {phase === 'done' ? 'Save portfolio' : 'Running…'}
          </Button>
        </>
      )}
    </div>
  )
}

interface ValueChartProps {
  path: number[]
  step: number
}

function ValueChart({ path, step }: ValueChartProps) {
  const W = 320
  const H = 160
  const PADX = 8
  const PADY = 12

  const { points, min, max } = useMemo(() => {
    const min = Math.min(...path, START)
    const max = Math.max(...path, START)
    const range = Math.max(max - min, 1)
    const pts = path.map((v, i) => {
      const x = PADX + (i / (path.length - 1)) * (W - PADX * 2)
      const y = H - PADY - ((v - min) / range) * (H - PADY * 2)
      return [x, y] as const
    })
    return { points: pts, min, max }
  }, [path])

  const visible = points.slice(0, step + 1)
  const d =
    visible.length > 1
      ? visible.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
      : ''
  const startY =
    points.length > 0
      ? H - PADY - ((START - min) / Math.max(max - min, 1)) * (H - PADY * 2)
      : H / 2

  return (
    <div className="bg-white rounded-2xl p-3 border-b-2 border-black/5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="none"
      >
        <line
          x1={PADX}
          x2={W - PADX}
          y1={startY}
          y2={startY}
          stroke="rgba(15,23,41,0.15)"
          strokeDasharray="3 4"
        />
        <path d={d} stroke="#58CC02" strokeWidth="2.5" fill="none" />
        {visible.length > 0 && (
          <circle
            cx={visible[visible.length - 1][0]}
            cy={visible[visible.length - 1][1]}
            r="4"
            fill="#58CC02"
          />
        )}
      </svg>
    </div>
  )
}
