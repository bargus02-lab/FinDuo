import type { Variants } from 'framer-motion'

export const easeOutCubic = [0.16, 1, 0.3, 1] as const

export const springPop = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 20,
}

export const pageTransition: Variants = {
  initial: { opacity: 0, x: 24 },
  enter: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: easeOutCubic },
  },
  exit: {
    opacity: 0,
    x: -24,
    transition: { duration: 0.2, ease: easeOutCubic },
  },
}

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 8 },
  in: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easeOutCubic },
  },
}

export const popIn: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  in: {
    scale: 1,
    opacity: 1,
    transition: springPop,
  },
}

export const wrongShake: Variants = {
  rest: { x: 0 },
  shake: {
    x: [-8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.4 },
  },
}

export const correctPulse: Variants = {
  rest: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 0.3, ease: easeOutCubic },
  },
}

export const staggerChildren = (delay = 0.06): Variants => ({
  in: {
    transition: { staggerChildren: delay },
  },
})
