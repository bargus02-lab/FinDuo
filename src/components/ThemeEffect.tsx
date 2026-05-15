import { useEffect } from 'react'
import { useGameStore } from '../store/useGameStore'

const ALL_THEME_CLASSES = ['theme-dark', 'theme-sunset', 'theme-terminal']

export function ThemeEffect() {
  const theme = useGameStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove(...ALL_THEME_CLASSES)
    if (theme !== 'light') {
      root.classList.add(`theme-${theme}`)
    }
  }, [theme])

  return null
}
