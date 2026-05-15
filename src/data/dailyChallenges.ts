import type { Question } from './lessons'

export const DAILY_QUESTIONS: Question[] = [
  {
    prompt: 'A 401(k) employer match is sometimes called…',
    choices: ['Free money', 'A loan', 'Insurance', 'A bonus tax'],
    correctIndex: 0,
    explanation:
      'A match is money added to your retirement at no cost. Skipping it is leaving cash on the table.',
  },
  {
    prompt: 'To beat inflation long-term, most investors…',
    choices: [
      'Hold only cash',
      'Invest in assets like stocks that have historically outpaced inflation',
      'Buy lottery tickets',
      'Pay off all debt first',
    ],
    correctIndex: 1,
    explanation:
      'Cash loses purchasing power every year inflation is positive. Stocks tend to grow faster than inflation over decades.',
  },
  {
    prompt: '"Pay yourself first" means…',
    choices: [
      'Tip yourself 20%',
      'Automate savings before discretionary spending',
      'Take a bonus every payday',
      'Refund yourself at year-end',
    ],
    correctIndex: 1,
    explanation:
      'Set up an automatic transfer that moves savings out of checking on payday. What you don’t see, you don’t spend.',
  },
  {
    prompt: 'A higher interest rate on a credit card means…',
    choices: [
      'Lower minimum payments',
      'Compounding works against you faster',
      'Easier rewards',
      'The card is safer',
    ],
    correctIndex: 1,
    explanation:
      'Carrying a balance on a high-APR card grows fast. The card isn’t the problem; carrying a balance on it is.',
  },
  {
    prompt: 'The expense ratio of a fund is…',
    choices: [
      'Its P/E ratio',
      'The annual fee, as a % of your investment',
      'The tax rate',
      'The fund’s return',
    ],
    correctIndex: 1,
    explanation:
      'A 1% expense ratio on $10k is $100/year, every year. Over 30 years, fees can quietly eat 25%+ of returns.',
  },
  {
    prompt: 'Dollar-cost averaging is…',
    choices: [
      'Buying everything at once',
      'Investing a fixed amount on a fixed schedule, regardless of price',
      'Timing the market perfectly',
      'Selling at the highs',
    ],
    correctIndex: 1,
    explanation:
      'You buy more shares when prices are low and fewer when high. Removes timing — useful because nobody consistently times the market.',
  },
  {
    prompt: 'Your net worth is…',
    choices: [
      'Your annual salary',
      'Assets minus liabilities',
      'Money in your checking account',
      'Your home’s value',
    ],
    correctIndex: 1,
    explanation:
      'Everything you own minus everything you owe. The truest one-number measure of financial position.',
  },
  {
    prompt: 'A "bear market" usually means…',
    choices: [
      'The market is up sharply',
      'The market is down at least 20% from its peak',
      'Bonds are rallying',
      'The Fed is cutting rates',
    ],
    correctIndex: 1,
    explanation:
      'A 20% drop from peak. They feel scary but historically average ~9–12 months, short relative to the bull markets that follow.',
  },
  {
    prompt: 'The "risk-free rate" is best approximated by…',
    choices: [
      'Short-term U.S. Treasury yields',
      'The stock market average',
      'The CEO’s salary',
      'The price of gold',
    ],
    correctIndex: 0,
    explanation:
      'Short-term Treasuries are backed by the U.S. government with minimal default risk — the baseline that other investment returns are measured against.',
  },
  {
    prompt: 'The "time value of money" says…',
    choices: [
      'Older money is worth more',
      'A dollar today is worth more than a dollar tomorrow',
      'All currencies are equal',
      'Time has no value in finance',
    ],
    correctIndex: 1,
    explanation:
      'A dollar today can be invested to grow. Foundation of present value, discount rates, and every calculation about future cash flows.',
  },
]

export function getDailyQuestion(date: Date = new Date()): Question {
  const start = new Date(date.getFullYear(), 0, 0)
  const dayOfYear = Math.floor(
    (date.valueOf() - start.valueOf()) / 86_400_000,
  )
  return DAILY_QUESTIONS[dayOfYear % DAILY_QUESTIONS.length]
}

export function secondsToMidnight(date: Date = new Date()): number {
  const tomorrow = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1,
  )
  return Math.max(0, Math.floor((tomorrow.valueOf() - date.valueOf()) / 1000))
}

export function formatTimeRemaining(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}
