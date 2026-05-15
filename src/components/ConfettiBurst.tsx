import { motion } from 'framer-motion'
import { useMemo } from 'react'

const COLORS = ['#58CC02', '#FFC800', '#FF4B4B', '#1CB0F6', '#CE82FF', '#FF9600']

interface ConfettiBurstProps {
  count?: number
  duration?: number
  spread?: number
}

interface Particle {
  id: number
  angle: number
  distance: number
  delay: number
  color: string
  rotate: number
  width: number
  height: number
}

export function ConfettiBurst({
  count = 70,
  duration = 1.8,
  spread = 320,
}: ConfettiBurstProps) {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        angle:
          (Math.PI * 2 * i) / count +
          (Math.random() - 0.5) * (Math.PI / count),
        distance: spread * (0.6 + Math.random() * 0.5),
        delay: Math.random() * 0.18,
        color: COLORS[i % COLORS.length],
        rotate: (Math.random() - 0.5) * 720,
        width: 6 + Math.random() * 4,
        height: 9 + Math.random() * 8,
      })),
    [count, spread],
  )

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      {particles.map((p) => {
        const dx = Math.cos(p.angle) * p.distance
        const dy = Math.sin(p.angle) * p.distance + 140
        return (
          <motion.span
            key={p.id}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
            animate={{ x: dx, y: dy, rotate: p.rotate, opacity: 0, scale: 0.4 }}
            transition={{
              duration,
              delay: p.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              background: p.color,
              width: p.width,
              height: p.height,
            }}
            className="absolute rounded-sm"
          />
        )
      })}
    </div>
  )
}
