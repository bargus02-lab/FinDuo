import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect } from 'react'

interface AnimatedNumberProps {
  from?: number
  to: number
  duration?: number
  delay?: number
  className?: string
  prefix?: string
  suffix?: string
}

export function AnimatedNumber({
  from = 0,
  to,
  duration = 1,
  delay = 0,
  className,
  prefix,
  suffix,
}: AnimatedNumberProps) {
  const value = useMotionValue(from)
  const rounded = useTransform(value, (v: number) => {
    const n = Math.round(v)
    return `${prefix ?? ''}${n}${suffix ?? ''}`
  })

  useEffect(() => {
    const controls = animate(value, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
    })
    return () => controls.stop()
  }, [to, duration, delay, value])

  return <motion.span className={className}>{rounded}</motion.span>
}
