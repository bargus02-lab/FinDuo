import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-4 border-b-2 border-black/5 shadow-card',
        'dark:bg-white/5 dark:border-white/10',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
