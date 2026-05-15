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
    questions: [
      {
        prompt: "What's the main purpose of an emergency fund?",
        choices: [
          'Pay off credit cards every month',
          'Cover unexpected expenses without going into debt',
          'Get rich in the stock market',
          'Save for retirement',
        ],
        correctIndex: 1,
        explanation:
          'It’s a buffer for surprises — job loss, hospital bill, car repair. It keeps a setback from snowballing into debt.',
      },
      {
        prompt: 'A typical recommendation for size is…',
        choices: [
          'One paycheck',
          '$500 flat',
          '3–6 months of essential expenses',
          'A full year of total spending',
        ],
        correctIndex: 2,
        explanation:
          '3–6 months of essentials (rent, food, insurance, transit) — enough to weather a job loss or a serious mishap without panic.',
      },
      {
        prompt: "Where's the best place to park it?",
        choices: [
          'An index fund — it should grow',
          'A high-yield savings account',
          'Under the mattress',
          'Crypto, for the upside',
        ],
        correctIndex: 1,
        explanation:
          'Liquid AND not at risk of dropping when you need it. A high-yield savings account is accessible, safe, and earns a little interest.',
      },
    ],
  },
  {
    id: 'money-needs-vs-wants',
    track: 'money',
    title: 'Needs vs wants',
    description:
      'The first move in any budget: separate the rent from the rosé.',
    type: 'multiple-choice',
    xp: 10,
    questions: [
      {
        prompt: 'Which of these is a need?',
        choices: [
          'A new phone every year',
          'Streaming subscriptions',
          'Rent',
          'Concert tickets',
        ],
        correctIndex: 2,
        explanation:
          'Needs are things you genuinely can’t go without — shelter, basic food, transit, medicine. Everything else is a want, no matter how lovely.',
      },
      {
        prompt: 'A friend insists their daily coffee is a "need." The right reframe?',
        choices: [
          'They’re right — caffeine is essential',
          'It’s a want, but small wants are fine in a healthy budget',
          'It’s neither — it’s an investment',
          'It’s a need only if they work in an office',
        ],
        correctIndex: 1,
        explanation:
          'Wants aren’t bad — they’re how you enjoy your money. The point of the split is knowing what flexes when money’s tight.',
      },
      {
        prompt: 'A common starting rule for budgeting?',
        choices: [
          'Spend whatever’s left on wants',
          '50% needs, 30% wants, 20% savings',
          'Save what’s left at the end',
          '80% wants, 20% savings',
        ],
        correctIndex: 1,
        explanation:
          '50/30/20 is a starting point — half needs, a third wants, the rest savings or debt. The habit matters more than the exact ratio.',
      },
    ],
  },
  {
    id: 'money-compound-interest',
    track: 'money',
    title: 'Compound interest',
    description: 'Why a dollar saved at 22 beats a dollar saved at 32.',
    type: 'multiple-choice',
    xp: 15,
    questions: [
      {
        prompt: 'Compound interest is interest paid on…',
        choices: [
          'The principal only',
          'The principal AND prior interest',
          'A fixed amount every year',
          'A tax on savings accounts',
        ],
        correctIndex: 1,
        explanation:
          'Your interest earns interest. That’s the difference between linear (simple) and exponential (compound) growth.',
      },
      {
        prompt: 'Two friends save $200/mo. One from 22–32 then stops; the other 32–62. Both earn 7%. At 62, who has more?',
        choices: [
          'The 32–62 saver, by a lot',
          'Roughly equal',
          'The 22–32 saver, despite saving less in total',
          'Whoever picks better stocks',
        ],
        correctIndex: 2,
        explanation:
          'Time is the secret ingredient. The early saver puts in less but their money compounds for 40 years. Starting late, even tripling contributions, doesn’t catch up.',
      },
      {
        prompt: 'The "rule of 72" estimates…',
        choices: [
          'Your retirement spending rate',
          'How many years it takes for money to double at a given rate',
          'The age you should retire',
          'Your max safe withdrawal rate',
        ],
        correctIndex: 1,
        explanation:
          'Divide 72 by your rate. At 7%, money doubles in ~10 years. At 9%, ~8. At 3%, ~24. Quick way to feel the difference rates make.',
      },
    ],
  },
  {
    id: 'money-credit-scores',
    track: 'money',
    title: 'Credit scores 101',
    description: 'A three-digit number that decides your interest rates.',
    type: 'multiple-choice',
    xp: 10,
    questions: [
      {
        prompt: 'A credit score measures…',
        choices: [
          'How wealthy you are',
          'How likely you are to repay borrowed money',
          'How much you earn',
          'How much you save each month',
        ],
        correctIndex: 1,
        explanation:
          'Lenders use it to estimate risk. Higher score = lower perceived risk = better rates on loans, cards, and mortgages.',
      },
      {
        prompt: 'The single biggest factor in a FICO score is…',
        choices: ['Income', 'Age', 'Payment history', 'Number of credit cards'],
        correctIndex: 2,
        explanation:
          'About 35% of your FICO is payment history. Missing a payment hits hardest. Pay on time, every time.',
      },
      {
        prompt: 'The fastest way to lift a low score?',
        choices: [
          'Close old cards you don’t use',
          'Pay down credit card balances',
          'Apply for many new cards',
          'Skip a payment to "reset"',
        ],
        correctIndex: 1,
        explanation:
          'Utilization (balance ÷ limit) is the second-biggest factor. Under 30% helps; under 10% is even better.',
      },
    ],
  },
  {
    id: 'money-roth-vs-traditional',
    track: 'money',
    title: 'Roth vs Traditional',
    description: 'Pay tax now or pay tax later — the retirement-account fork.',
    type: 'multiple-choice',
    xp: 15,
    questions: [
      {
        prompt: 'With a Traditional 401(k) or IRA, you pay tax…',
        choices: [
          'Now, then withdraw tax-free',
          'Later, when you withdraw in retirement',
          'Never',
          'Twice — going in and coming out',
        ],
        correctIndex: 1,
        explanation:
          'Traditional accounts are tax-deferred. You skip tax now (a deduction this year), then pay ordinary income tax on withdrawals later.',
      },
      {
        prompt: 'With a Roth, you pay tax…',
        choices: [
          'Later, on withdrawals',
          'Now — contributions are after-tax, withdrawals are tax-free',
          'Never',
          'Every year on the gains',
        ],
        correctIndex: 1,
        explanation:
          'No deduction now, but you owe nothing on the money OR the growth in retirement. Trade today’s break for a future one.',
      },
      {
        prompt: 'Roth is usually the better bet if you expect to be…',
        choices: [
          'In a higher tax bracket in retirement than today',
          'Out of the workforce next year',
          'Retiring in 5 years',
          'Over 60',
        ],
        correctIndex: 0,
        explanation:
          'Pay tax at today’s rate when you think your rate (or your bracket) will be higher later. Young earners often fit — 22% now beats 32% later.',
      },
    ],
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
    questions: [
      {
        prompt: 'Owning a share of stock means you own…',
        choices: [
          'A loan to the company',
          'A small piece of the company',
          'A future product from the company',
          'A bet on the stock’s price',
        ],
        correctIndex: 1,
        explanation:
          'A share is a tiny ownership slice. If the company makes money and grows, your slice is worth more. If it tanks, so does your slice.',
      },
      {
        prompt: 'What do shareholders typically get from a profitable company?',
        choices: [
          'Free products',
          'Voting rights and possibly dividends',
          'A salary',
          'Tax breaks',
        ],
        correctIndex: 1,
        explanation:
          'As a part-owner, you can vote (one share = one vote, usually) and may receive dividends — cash payouts of profits — if the board declares them.',
      },
      {
        prompt: 'A stock’s price mostly reflects…',
        choices: [
          'The CEO’s mood',
          'Expectations of the company’s future profits',
          'How many people work there',
          'How old the company is',
        ],
        correctIndex: 1,
        explanation:
          'Price is roughly "what investors collectively think future cash flows are worth, today." Profitable companies can still drop on news that growth is slowing.',
      },
    ],
  },
  {
    id: 'markets-bonds-vs-stocks',
    track: 'markets',
    title: 'Bonds vs stocks',
    description: 'Lender vs owner — same company, very different risk.',
    type: 'multiple-choice',
    xp: 10,
    questions: [
      {
        prompt: 'Buying a bond means…',
        choices: [
          'Becoming a part-owner',
          'Lending money in exchange for interest',
          'Buying real estate',
          'Speculating on prices',
        ],
        correctIndex: 1,
        explanation:
          'A bond is debt. The issuer owes you regular interest plus your principal back at maturity. You’re the lender, not the owner.',
      },
      {
        prompt: 'If a company goes bankrupt, who’s paid first?',
        choices: ['Stockholders', 'Bondholders', 'The CEO', 'They split evenly'],
        correctIndex: 1,
        explanation:
          'Debt sits above equity in the capital stack. Bondholders are paid from whatever’s left; stockholders are last. That’s why stocks earn more on average.',
      },
      {
        prompt: 'Long run, stocks vs bonds usually…',
        choices: [
          'Bonds return more but are more volatile',
          'Stocks return more on average and are more volatile',
          'They have the same risk and return',
          'Bonds are always safer in every period',
        ],
        correctIndex: 1,
        explanation:
          'Higher risk, higher expected return. Stocks have historically beaten bonds by 4–5% per year on average — with much wilder swings.',
      },
    ],
  },
  {
    id: 'markets-diversification',
    track: 'markets',
    title: 'Diversification',
    description: 'Why "many eggs, many baskets" is the only free lunch in investing.',
    type: 'multiple-choice',
    xp: 15,
    questions: [
      {
        prompt: '"Diversification" means…',
        choices: [
          'Buying only winners',
          'Spreading money across many investments',
          'Picking the cheapest stocks',
          'Trading frequently',
        ],
        correctIndex: 1,
        explanation:
          'Don’t put it all in one company, industry, or country. When something inevitably breaks somewhere, the rest cushions the hit.',
      },
      {
        prompt: 'Diversification mostly solves…',
        choices: [
          'Bad CEOs',
          'Inflation',
          'Specific-company (idiosyncratic) risk',
          'Recessions',
        ],
        correctIndex: 2,
        explanation:
          'It can’t save you from a market-wide crash. But it nearly eliminates the risk that one bad stock takes you down.',
      },
      {
        prompt: 'A truly diversified portfolio is usually…',
        choices: [
          'One stock you really like',
          'Five stocks in the same industry',
          'Hundreds of stocks across industries and countries',
          '100% bonds',
        ],
        correctIndex: 2,
        explanation:
          'Real diversification means hundreds or thousands of holdings across sectors and geographies. The simplest path: low-cost index funds.',
      },
    ],
  },
  {
    id: 'markets-index-vs-picking',
    track: 'markets',
    title: 'Index vs picking',
    description:
      'Should you buy the haystack or hunt for the needle? The data has thoughts.',
    type: 'multiple-choice',
    xp: 15,
    questions: [
      {
        prompt: 'An index fund…',
        choices: [
          'Picks the best stocks based on analyst calls',
          'Owns the entire index it tracks',
          'Trades daily for profit',
          'Holds only government bonds',
        ],
        correctIndex: 1,
        explanation:
          'It buys every stock in an index (e.g., the S&P 500) in proportion. No picking, no guessing. You get the market’s return minus a tiny fee.',
      },
      {
        prompt: 'Over 15+ years, roughly what share of active funds beat the S&P 500?',
        choices: ['Around 90%', 'Around 50%', 'Around 10–20%', '100% — that’s the point'],
        correctIndex: 2,
        explanation:
          'Most pros underperform a simple index over the long run. Fees compound, and a consistent edge is exceptionally rare.',
      },
      {
        prompt: 'Biggest practical edge of an index fund?',
        choices: [
          'Massive upside vs the market',
          'Low fees and broad diversification',
          'Insurance against losses',
          'Guaranteed returns',
        ],
        correctIndex: 1,
        explanation:
          'You get the market return, ultra-low fees (often <0.1%), instant diversification, and no need to outguess anyone. It’s boring — which is the point.',
      },
    ],
  },
  {
    id: 'markets-pe-ratio',
    track: 'markets',
    title: 'The P/E ratio',
    description: 'Price you pay for every dollar of earnings. Rough but useful.',
    type: 'multiple-choice',
    xp: 15,
    questions: [
      {
        prompt: 'P/E stands for…',
        choices: [
          'Price-to-Earnings',
          'Profit-to-Expense',
          'Performance-to-Equity',
          'Price-to-Equity',
        ],
        correctIndex: 0,
        explanation:
          'Share price ÷ earnings per share. It tells you how many dollars you’re paying for each dollar of profit.',
      },
      {
        prompt: 'A P/E of 20 roughly means…',
        choices: [
          'The stock will return 20% per year',
          'It would take 20 years of current earnings to "earn back" the price',
          'The stock is 20% expensive',
          '20% of profits go to dividends',
        ],
        correctIndex: 1,
        explanation:
          'You’re paying $20 for every $1 of current earnings. If profits don’t change, it’d take 20 years to recoup the price — assuming you got all the profits.',
      },
      {
        prompt: 'A high P/E usually signals that investors expect…',
        choices: [
          'The company is in trouble',
          'Faster future earnings growth',
          'A dividend cut',
          'Zero growth',
        ],
        correctIndex: 1,
        explanation:
          'High P/E = the market expects profits to grow a lot. Sometimes right (Amazon for years), sometimes very wrong (bubbles). P/E alone never tells the full story.',
      },
    ],
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
    title: 'Securitization',
    description:
      'Taking a pile of loans, wrapping them up, and selling slices. Yes, really.',
    type: 'multiple-choice',
    xp: 15,
    questions: [
      {
        prompt: 'Securitization is…',
        choices: [
          'Buying insurance on stocks',
          'Bundling many loans into a single tradable security',
          'Issuing new stock',
          'Selling government bonds',
        ],
        correctIndex: 1,
        explanation:
          'A bank takes thousands of similar loans (mortgages, auto, credit-card receivables), packages them, and sells the cash-flow stream as a bond-like security.',
      },
      {
        prompt: 'Why bother? Banks securitize mainly to…',
        choices: [
          'Make paperwork easier',
          'Offload risk and free up capital to make new loans',
          'Increase customer satisfaction',
          'Pay higher interest to depositors',
        ],
        correctIndex: 1,
        explanation:
          'Once the loans are sold, risk and cash flow move to investors. The bank gets cash back and can recycle it into new loans.',
      },
      {
        prompt: 'Investors in a securitization are buying…',
        choices: [
          'Shares in the bank',
          'A claim on the loan pool’s future cash flows',
          'Real estate directly',
          'Insurance contracts',
        ],
        correctIndex: 1,
        explanation:
          'As loans in the pool pay their monthly bills, cash gets passed through (after fees) to investors. They own a slice of the income stream.',
      },
    ],
  },
  {
    id: 'structured-mbs',
    track: 'structured',
    title: 'MBS 101',
    description:
      'Mortgage-backed securities: thousands of home loans bundled into one bond.',
    type: 'multiple-choice',
    xp: 15,
    questions: [
      {
        prompt: 'An MBS is backed by…',
        choices: [
          'One huge mortgage',
          'A pool of many home mortgages',
          'Auto loans',
          'Government bonds',
        ],
        correctIndex: 1,
        explanation:
          'Thousands of home loans pooled together and sold as one investment. That diversification is much of the appeal.',
      },
      {
        prompt: 'When homeowners pay their monthly mortgage, the money goes to…',
        choices: [
          'The bank that originated the loan',
          'The MBS investors (via the trust)',
          'The Federal Reserve',
          'The original developer',
        ],
        correctIndex: 1,
        explanation:
          'Once the loans are in the MBS, monthly payments flow through the structure to the bond investors. The bank is no longer the holder.',
      },
      {
        prompt: 'A risk unique to MBS is…',
        choices: [
          'Currency risk',
          'Prepayment risk — homeowners refinance and pay off early',
          'Default by the issuer',
          'Stock-market volatility',
        ],
        correctIndex: 1,
        explanation:
          'When rates drop, homeowners refinance, the old loans pay off early, and MBS investors get cash back exactly when reinvesting is least attractive.',
      },
    ],
  },
  {
    id: 'structured-tranches',
    track: 'structured',
    title: 'Tranches & seniority',
    description: 'Senior, mezzanine, equity — same deal, very different seats.',
    type: 'multiple-choice',
    xp: 20,
    questions: [
      {
        prompt: 'A "tranche" is…',
        choices: [
          'A type of bond',
          'A slice of a structured deal, each with its own risk and return',
          'A French pastry',
          'A type of bank account',
        ],
        correctIndex: 1,
        explanation:
          'French for "slice." A securitization is carved into ranked slices, each with its own seniority, coupon, and risk profile.',
      },
      {
        prompt: 'The senior tranche…',
        choices: [
          'Is the riskiest, with highest yield',
          'Gets paid first, with the lowest yield',
          'Is reserved for the bank',
          'Is always tax-free',
        ],
        correctIndex: 1,
        explanation:
          'Senior tranches get paid first from the pool’s cash flows. They’re the safest seat — and they pay the lowest yield because of it.',
      },
      {
        prompt: 'The equity (first-loss) tranche…',
        choices: [
          'Has zero risk',
          'Absorbs losses first, in exchange for the highest yield',
          'Is the same as the senior tranche',
          'Pays a fixed rate forever',
        ],
        correctIndex: 1,
        explanation:
          'The equity tranche takes the first hit when borrowers default. If everything goes well, they earn the most. If it doesn’t, they’re wiped out first.',
      },
    ],
  },
  {
    id: 'structured-waterfall-concept',
    track: 'structured',
    title: 'The waterfall',
    description:
      'Cash falls from the top of the deal — who gets paid before the lights go out?',
    type: 'multiple-choice',
    xp: 20,
    questions: [
      {
        prompt: 'In a structured-finance waterfall, cash flows go to…',
        choices: [
          'All investors at once, pro-rata',
          'The senior tranche first, then down the stack',
          'Whoever calls in first',
          'The bank, who decides daily',
        ],
        correctIndex: 1,
        explanation:
          'Like water through a series of buckets — the senior bucket fills first, then mezzanine, then equity. Each level is paid in full before the next gets a drop.',
      },
      {
        prompt: 'Losses (defaults) flow in the opposite direction. They hit…',
        choices: [
          'The senior tranche first',
          'The equity tranche first, then up the stack',
          'The bank only',
          'Everyone evenly',
        ],
        correctIndex: 1,
        explanation:
          'Equity absorbs losses first. Only after equity is wiped out do losses start eating into mezzanine, then senior. That’s the whole structural game.',
      },
      {
        prompt: 'Equity is sized at 10% of the deal. Defaults reach 8% of the pool. What happens?',
        choices: [
          'Senior is wiped out',
          'Senior AND mezzanine are wiped out',
          'Equity absorbs the loss; senior and mezz untouched',
          'Everyone takes an 8% hit',
        ],
        correctIndex: 2,
        explanation:
          'Equity is the buffer. As long as losses stay below the equity layer’s size, higher tranches don’t feel a thing — even though the pool itself is bleeding.',
      },
    ],
  },
  {
    id: 'structured-why-mbs-exist',
    track: 'structured',
    title: 'Why MBS exist',
    description: 'Banks transferring risk and freeing up capital to lend more.',
    type: 'multiple-choice',
    xp: 20,
    questions: [
      {
        prompt: 'For banks, the primary motivation to issue MBS is…',
        choices: [
          'Avoiding taxes',
          'Freeing up capital and shifting interest-rate / credit risk',
          'Eliminating paperwork',
          'Helping homeowners directly',
        ],
        correctIndex: 1,
        explanation:
          'Holding a mortgage on the balance sheet ties up capital for decades and exposes the bank to rate and default risk. Securitizing transfers all of that.',
      },
      {
        prompt: 'For investors, the appeal is mostly…',
        choices: [
          'Guaranteed profits',
          'Steady cash flows from a diversified loan pool, often with credit enhancements',
          'They never lose value',
          'Tax-free dividends',
        ],
        correctIndex: 1,
        explanation:
          'MBS offer regular cash flows from thousands of borrowers — far smoother than holding any one loan. Senior tranches are often AAA-rated, attractive to pensions and insurers.',
      },
      {
        prompt: 'Broader effect on the economy?',
        choices: [
          'Increases inflation',
          'Expands access to credit by recycling bank capital',
          'Lowers stock prices',
          'Eliminates risk from the system',
        ],
        correctIndex: 1,
        explanation:
          'When banks can sell loans, they have capital to make more. That’s part of why mortgage credit is widely available — and part of why bad structures (subprime, 2008) can break everything.',
      },
    ],
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
