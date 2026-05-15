/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#58CC02',
          dark: '#46A302',
          light: '#89E219',
        },
        wrong: {
          DEFAULT: '#FF4B4B',
          dark: '#D93838',
        },
        xp: {
          DEFAULT: '#FFC800',
          dark: '#E6B400',
        },
        cream: '#FFFBF5',
        ink: '#0F1729',
        // Theme-aware semantic colors (driven by CSS variables)
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        '2xl': '1rem',
      },
      boxShadow: {
        'btn-3d': '0 4px 0 0 rgba(0,0,0,0.15)',
        'btn-3d-press': '0 1px 0 0 rgba(0,0,0,0.15)',
        card: '0 2px 0 0 rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
