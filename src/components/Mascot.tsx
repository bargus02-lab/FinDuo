import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

export type MascotMood =
  | 'idle'
  | 'thinking'
  | 'correct'
  | 'wrong'
  | 'celebrate'
  | 'wave'

interface MascotProps {
  mood?: MascotMood
  size?: number
  className?: string
}

const COLORS = {
  pink: '#FFB6C1',
  pinkDeep: '#FF8FA0',
  snout: '#FFC4D0',
  shadow: '#E89BAA',
  nostril: '#C97891',
  pupil: '#0F1729',
  gold: '#FFC800',
  coin: '#F2A900',
}

// ─── Tiny utility: blink scheduler ─────────────────────────────────────────
function useBlinker(active: boolean) {
  const [blink, setBlink] = useState(false)
  useEffect(() => {
    if (!active) return
    let pending: ReturnType<typeof setTimeout>
    let cleanup: ReturnType<typeof setTimeout>
    const schedule = () => {
      const wait = 2400 + Math.random() * 2600 // 2.4–5s
      pending = setTimeout(() => {
        setBlink(true)
        cleanup = setTimeout(() => {
          setBlink(false)
          schedule()
        }, 130)
      }, wait)
    }
    schedule()
    return () => {
      clearTimeout(pending)
      clearTimeout(cleanup)
    }
  }, [active])
  return blink
}

// ─── Look targets per mood (subtle eye-tracking) ──────────────────────────
function useLook(mood: MascotMood) {
  return useMemo<{ x: number; y: number }>(() => {
    switch (mood) {
      case 'thinking':
        return { x: 1.6, y: -1.2 }
      case 'wrong':
        return { x: 0, y: 1.4 }
      case 'wave':
        return { x: -1.2, y: 0 }
      default:
        return { x: 0, y: 0 }
    }
  }, [mood])
}

// ─── Body motion presets ───────────────────────────────────────────────────
function bodyAnimFor(mood: MascotMood) {
  switch (mood) {
    case 'correct':
      // Squash → stretch → settle (Disney 12 principles, kinda)
      return {
        scale: [1, 0.95, 1.12, 0.98, 1.05, 1],
        y: [0, 2, -14, -4, -8, 0],
      }
    case 'wrong':
      return {
        rotate: [-2.5, 2.5, -1.5, 1, 0],
        y: [0, 3, 0],
      }
    case 'celebrate':
      return {
        scale: [1, 0.92, 1.15, 1, 1.1, 1],
        y: [0, 4, -22, -6, -16, 0],
        rotate: [0, -10, 8, -6, 4, 0],
      }
    case 'thinking':
      return {
        rotate: [0, -4, -4, -3, -4],
        y: [0, -2, -2, -2, -2],
      }
    case 'wave':
      return {
        scale: [1, 1.06, 1.02, 1.06, 1],
        rotate: [0, -3, 3, -2, 0],
      }
    default:
      return {
        scale: [1, 1.025, 1],
      }
  }
}

function bodyTransitionFor(mood: MascotMood) {
  switch (mood) {
    case 'correct':
      return { duration: 0.7, times: [0, 0.1, 0.32, 0.55, 0.78, 1] }
    case 'wrong':
      return { duration: 0.5 }
    case 'celebrate':
      return { duration: 1.4, ease: [0.2, 0.8, 0.3, 1] as const }
    case 'thinking':
      return { duration: 0.6 }
    case 'wave':
      return { duration: 1 }
    default:
      return { duration: 2.6, repeat: Infinity, ease: 'easeInOut' as const }
  }
}

// ─── Sub-pieces ────────────────────────────────────────────────────────────
function HappyEyes() {
  return (
    <>
      <path
        d="M -15 -10 Q -11 -14 -7 -10"
        stroke={COLORS.pupil}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 7 -10 Q 11 -14 15 -10"
        stroke={COLORS.pupil}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
    </>
  )
}

function NormalEyes({
  blink,
  look,
}: {
  blink: boolean
  look: { x: number; y: number }
}) {
  return (
    <>
      {/* Eye whites */}
      <motion.ellipse
        cx={-11}
        cy={-8}
        rx={5}
        animate={{ ry: blink ? 0.4 : 5.8 }}
        transition={{ duration: 0.08 }}
        fill="white"
      />
      <motion.ellipse
        cx={11}
        cy={-8}
        rx={5}
        animate={{ ry: blink ? 0.4 : 5.8 }}
        transition={{ duration: 0.08 }}
        fill="white"
      />
      {/* Pupils */}
      <motion.g
        animate={{ x: look.x, y: look.y }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      >
        {!blink && (
          <>
            <circle cx={-11} cy={-7} r={2.6} fill={COLORS.pupil} />
            <circle cx={11} cy={-7} r={2.6} fill={COLORS.pupil} />
            <circle cx={-10} cy={-8} r={0.9} fill="white" />
            <circle cx={12} cy={-8} r={0.9} fill="white" />
          </>
        )}
      </motion.g>
    </>
  )
}

function Mouth({ mood }: { mood: MascotMood }) {
  let d = 'M -6 17 Q 0 19.5 6 17'
  let stroke = COLORS.nostril
  let width = 1.6
  if (mood === 'wrong') {
    d = 'M -7 19 Q 0 15.5 7 19'
  } else if (mood === 'correct' || mood === 'celebrate') {
    d = 'M -8 16 Q 0 23 8 16'
    width = 2
  } else if (mood === 'thinking') {
    d = 'M -5 18 Q -1 19 3 17'
  }
  return (
    <motion.path
      d={d}
      stroke={stroke}
      strokeWidth={width}
      fill="none"
      strokeLinecap="round"
      animate={{ d }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    />
  )
}

function Eyebrows({ mood }: { mood: MascotMood }) {
  // Eyebrows accentuate emotion. None in idle.
  if (mood === 'wrong') {
    return (
      <>
        <path
          d="M -16 -17 L -8 -15"
          stroke={COLORS.shadow}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
        <path
          d="M 16 -17 L 8 -15"
          stroke={COLORS.shadow}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      </>
    )
  }
  if (mood === 'thinking') {
    return (
      <>
        <path
          d="M -16 -16 L -8 -17"
          stroke={COLORS.shadow}
          strokeWidth={1.6}
          strokeLinecap="round"
        />
        <path
          d="M 8 -18 L 16 -15"
          stroke={COLORS.shadow}
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      </>
    )
  }
  return null
}

function Hand({ mood }: { mood: MascotMood }) {
  // Visible only in wave + celebrate.
  if (mood !== 'wave' && mood !== 'celebrate') return null
  return (
    <motion.g
      style={{ transformOrigin: '34px -6px' }}
      animate={{ rotate: [0, -20, 20, -15, 10, -5, 0] }}
      transition={{ duration: mood === 'celebrate' ? 1.3 : 0.9 }}
    >
      <circle cx={42} cy={-4} r={5.5} fill={COLORS.pink} />
      <circle
        cx={42}
        cy={-4}
        r={5.5}
        fill="none"
        stroke={COLORS.shadow}
        strokeWidth={1.2}
      />
    </motion.g>
  )
}

function Sparkles({ mood }: { mood: MascotMood }) {
  if (mood !== 'celebrate' && mood !== 'correct') return null
  const count = mood === 'celebrate' ? 10 : 5
  const radius = mood === 'celebrate' ? 42 : 32
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius - 4
        return (
          <motion.path
            key={i}
            d={`M ${x} ${y - 3} L ${x + 1} ${y} L ${x + 4} ${y} L ${x + 1.5} ${y + 2} L ${x + 2} ${y + 5} L ${x} ${y + 3} L ${x - 2} ${y + 5} L ${x - 1.5} ${y + 2} L ${x - 4} ${y} L ${x - 1} ${y}  Z`}
            fill={i % 2 === 0 ? COLORS.gold : COLORS.coin}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.2, 0],
              opacity: [0, 1, 0],
              y: [y, y - 6, y - 4],
            }}
            transition={{
              duration: 0.9,
              delay: 0.05 * i,
              repeat: mood === 'celebrate' ? 1 : 0,
            }}
          />
        )
      })}
    </>
  )
}

function FlyingCoin({ mood }: { mood: MascotMood }) {
  // A coin pops out of the slot on celebrate.
  if (mood !== 'celebrate') return null
  return (
    <motion.g
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: [-2, -28, -32, -28], opacity: [0, 1, 1, 0], rotate: 360 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      style={{ transformOrigin: '0px -30px' }}
    >
      <circle cx={0} cy={-30} r={5.5} fill={COLORS.coin} />
      <circle
        cx={0}
        cy={-30}
        r={5.5}
        fill="none"
        stroke="#B07600"
        strokeWidth={1}
      />
      <text
        x={0}
        y={-27}
        textAnchor="middle"
        fontSize="6"
        fontWeight="900"
        fill="#7A4F00"
      >
        $
      </text>
    </motion.g>
  )
}

// ─── Ears ──────────────────────────────────────────────────────────────────
function EarLeft() {
  return (
    <motion.g
      style={{ transformOrigin: '-26px -22px' }}
      animate={{ rotate: [0, 0, -8, 4, 0, 0, 0] }}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatDelay: Math.random() * 3,
      }}
    >
      <path
        d="M -32 -20 L -26 -34 L -16 -25 Z"
        fill={COLORS.pink}
        stroke={COLORS.shadow}
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <path
        d="M -28 -22 L -25 -30 L -21 -25"
        fill={COLORS.snout}
        stroke="none"
      />
    </motion.g>
  )
}

function EarRight() {
  return (
    <motion.g
      style={{ transformOrigin: '26px -22px' }}
      animate={{ rotate: [0, 0, 0, 0, 6, -3, 0] }}
      transition={{
        duration: 5.5,
        repeat: Infinity,
        repeatDelay: 1 + Math.random() * 3,
      }}
    >
      <path
        d="M 32 -20 L 26 -34 L 16 -25 Z"
        fill={COLORS.pink}
        stroke={COLORS.shadow}
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <path d="M 28 -22 L 25 -30 L 21 -25" fill={COLORS.snout} stroke="none" />
    </motion.g>
  )
}

// ─── Mascot ────────────────────────────────────────────────────────────────
export function Mascot({ mood = 'idle', size = 96, className }: MascotProps) {
  const happyEyes = mood === 'correct' || mood === 'celebrate'
  const blink = useBlinker(!happyEyes && mood !== 'wrong')
  const look = useLook(mood)

  return (
    <svg
      viewBox="-50 -50 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <FlyingCoin mood={mood} />
      <EarLeft />
      <EarRight />
      <motion.g
        animate={bodyAnimFor(mood)}
        transition={bodyTransitionFor(mood)}
        style={{ transformOrigin: '0 8px' }}
      >
        {/* Body */}
        <ellipse cx={0} cy={5} rx={34} ry={31} fill={COLORS.pink} />
        <ellipse
          cx={0}
          cy={5}
          rx={34}
          ry={31}
          fill="none"
          stroke={COLORS.shadow}
          strokeWidth={1.4}
        />

        {/* Belly highlight */}
        <ellipse cx={-8} cy={2} rx={14} ry={10} fill={COLORS.snout} opacity={0.45} />

        {/* Coin slot */}
        <rect x={-7} y={-30} width={14} height={3} rx={1.4} fill={COLORS.shadow} />
        <rect x={-6} y={-29.5} width={12} height={1.2} rx={0.6} fill={COLORS.nostril} opacity={0.55} />

        {/* Cheeks */}
        <ellipse cx={-22} cy={11} rx={4.5} ry={3} fill={COLORS.pinkDeep} opacity={0.55} />
        <ellipse cx={22} cy={11} rx={4.5} ry={3} fill={COLORS.pinkDeep} opacity={0.55} />

        {/* Eyebrows */}
        <Eyebrows mood={mood} />

        {/* Eyes */}
        {happyEyes ? <HappyEyes /> : <NormalEyes blink={blink} look={look} />}

        {/* Snout */}
        <ellipse cx={0} cy={13} rx={13} ry={9.5} fill={COLORS.snout} />
        <ellipse
          cx={0}
          cy={13}
          rx={13}
          ry={9.5}
          fill="none"
          stroke={COLORS.shadow}
          strokeWidth={1}
        />
        <ellipse cx={-4.5} cy={13} rx={1.6} ry={2.3} fill={COLORS.nostril} />
        <ellipse cx={4.5} cy={13} rx={1.6} ry={2.3} fill={COLORS.nostril} />

        {/* Mouth */}
        <Mouth mood={mood} />

        {/* Hand */}
        <Hand mood={mood} />

        {/* Tiny feet (peeking out) */}
        <ellipse cx={-16} cy={34} rx={5} ry={3} fill={COLORS.shadow} />
        <ellipse cx={16} cy={34} rx={5} ry={3} fill={COLORS.shadow} />
      </motion.g>
      <Sparkles mood={mood} />
    </svg>
  )
}
