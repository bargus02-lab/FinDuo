import { MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

interface PageShellProps {
  children: ReactNode
  className?: string
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <MotionConfig reducedMotion="user">
      <div
        className={cn(
          'min-h-full mx-auto w-full max-w-md px-5 py-6 sm:py-10',
          className,
        )}
      >
        {children}
      </div>
    </MotionConfig>
  )
}
