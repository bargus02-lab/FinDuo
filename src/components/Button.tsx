import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'md' | 'lg'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

const variants: Record<
  Variant,
  { bg: string; text: string; hover: string; shadowColor: string }
> = {
  primary: {
    bg: 'bg-primary',
    text: 'text-white',
    hover: 'hover:bg-primary-light',
    shadowColor: '#46A302',
  },
  secondary: {
    bg: 'bg-white',
    text: 'text-ink',
    hover: 'hover:bg-ink/5',
    shadowColor: 'rgba(15,23,41,0.18)',
  },
  danger: {
    bg: 'bg-wrong',
    text: 'text-white',
    hover: 'hover:opacity-95',
    shadowColor: '#D93838',
  },
  ghost: {
    bg: 'bg-transparent',
    text: 'text-ink',
    hover: 'hover:bg-ink/5',
    shadowColor: 'transparent',
  },
}

const sizes: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
}

export function Button({
  variant = 'primary',
  size = 'lg',
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const v = variants[variant]
  const restingShadow =
    variant === 'ghost' ? 'none' : `0 4px 0 0 ${v.shadowColor}`

  return (
    <motion.button
      style={{ boxShadow: restingShadow }}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={
        disabled
          ? undefined
          : {
              y: 4,
              boxShadow: `0 0 0 0 ${v.shadowColor}`,
              transition: { duration: 0.06 },
            }
      }
      disabled={disabled}
      className={cn(
        'font-extrabold uppercase tracking-wide rounded-xl select-none',
        'transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        sizes[size],
        v.bg,
        v.text,
        !disabled && v.hover,
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}
