import { motion } from 'framer-motion'

interface BigCheckProps {
  size?: number
}

export function BigCheck({ size = 120 }: BigCheckProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 16 }}
    >
      <circle cx="32" cy="32" r="30" fill="#58CC02" />
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="none"
        stroke="#46A302"
        strokeWidth="3"
      />
      <motion.path
        d="M19 33 L28 42 L45 24"
        stroke="white"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
      />
    </motion.svg>
  )
}
