import type { Track } from '../store/useGameStore'

export type LessonType = 'multiple-choice' | 'simulation'
export type SimulationId = 'budget' | 'portfolio' | 'waterfall'

export interface Question {
  prompt: string
  choices: string[]
  correctIndex: number
  explanation: string
}

export interface Lesson {
  id: string
  track: Track
  title: string
  description: string
  type: LessonType
  xp: number
  questions?: Question[]
  simulationId?: SimulationId
}

export const LESSONS: Lesson[] = [
  // ─── Money Basics ─────────────────────────────────────────────────────────
  {
    id: 'money-emergency-fund',
    track: 'money',
    title: 'Emergency fund',
    description:
      'A cushion of cash for the unexpected — job loss, a busted car, a hospital bill.',
    type: 'multiple-choice',
    xp: 10,
  },
  {
    id: 'money-needs-vs-wants',
    track: 'money',
    title: 'Needs vs wants',
    description:
      'The first move in any budget: separate the rent from the rosé.',
    type: 'multiple-choice',
    xp: 10,
  },
  {
    id: 'money-compound-interest',
    track: 'money',
    title: 'Compound interest',
    description: 'Why a dollar saved at 22 beats a dollar saved at 32.',
    type: 'multiple-choice',
    xp: 15,
  },
  {
    id: 'money-credit-scores',
    track: 'money',
    title: 'Credit scores 101',
    description: 'A three-digit number that decides your interest rates.',
    type: 'multiple-choice',
    xp: 10,
  },
  {
    id: 'money-roth-vs-traditional',
    track: 'money',
    title: 'Roth vs Traditional',
    description: 'Pay tax now or pay tax later — the retirement-account fork.',
    type: 'multiple-choice',
    xp: 15,
  },
  {
    id: 'money-budget-allocator',
    track: 'money',
    title: 'Build a budget',
    description: 'Drag the sliders to split a paycheck. See your health meter respond.',
    type: 'simulation',
    simulationId: 'budget',
    xp: 25,
  },

  // ─── Markets ──────────────────────────────────────────────────────────────
  {
    id: 'markets-what-is-stock',
    track: 'markets',
    title: 'What is a stock?',
    description: 'A claim on a slice of a real business. Tiny but real.',
    type: 'multiple-choice',
    xp: 10,
  },
  {
    id: 'markets-bonds-vs-stocks',
    track: 'markets',
    title: 'Bonds vs stocks',
    description: 'Lender vs owner — same company, very different risk.',
    type: 'multiple-choice',
    xp: 10,
  },
  {
    id: 'markets-diversification',
    track: 'markets',
    title: 'Diversification',
    description: 'Why "many eggs, many baskets" is the only free lunch in investing.',
    type: 'multiple-choice',
    xp: 15,
  },
  {
    id: 'markets-index-vs-picking',
    track: 'markets',
    title: 'Index funds vs picking',
    description:
      'Should you buy the haystack or hunt for the needle? The data has thoughts.',
    type: 'multiple-choice',
    xp: 15,
  },
  {
    id: 'markets-pe-ratio',
    track: 'markets',
    title: 'The P/E ratio',
    description: 'Price you pay for every dollar of earnings. Rough but useful.',
    type: 'multiple-choice',
    xp: 15,
  },
  {
    id: 'markets-portfolio-builder',
    track: 'markets',
    title: 'Build a portfolio',
    description: 'Pick 3 of 6 assets, then watch a fast-forward chart play it out.',
    type: 'simulation',
    simulationId: 'portfolio',
    xp: 25,
  },

  // ─── Structured Finance ───────────────────────────────────────────────────
  {
    id: 'structured-securitization',
    track: 'structured',
    title: 'What is securitization?',
    description:
      'Taking a pile of loans, wrapping them up, and selling slices. Yes, really.',
    type: 'multiple-choice',
    xp: 15,
  },
  {
    id: 'structured-mbs',
    track: 'structured',
    title: 'MBS 101',
    description:
      'Mortgage-backed securities: thousands of home loans bundled into one bond.',
    type: 'multiple-choice',
    xp: 15,
  },
  {
    id: 'structured-tranches',
    track: 'structured',
    title: 'Tranches & seniority',
    description: 'Senior, mezzanine, equity — same deal, very different seats.',
    type: 'multiple-choice',
    xp: 20,
  },
  {
    id: 'structured-waterfall-concept',
    track: 'structured',
    title: 'The waterfall',
    description:
      'Cash falls from the top of the deal — who gets paid before the lights go out?',
    type: 'multiple-choice',
    xp: 20,
  },
  {
    id: 'structured-why-mbs-exist',
    track: 'structured',
    title: 'Why MBS exist',
    description: 'Banks transferring risk and freeing up capital to lend more.',
    type: 'multiple-choice',
    xp: 20,
  },
  {
    id: 'structured-waterfall-sim',
    track: 'structured',
    title: 'Trace the waterfall',
    description:
      'Drag deal parameters, watch money pour through Senior → Mezz → Equity.',
    type: 'simulation',
    simulationId: 'waterfall',
    xp: 30,
  },
]

export function lessonsForTrack(track: Track): Lesson[] {
  return LESSONS.filter((l) => l.track === track)
}

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id)
}
