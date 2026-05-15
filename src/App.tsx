import { motion } from 'framer-motion'
import { Flame, Lock, Sparkles, TrendingUp } from 'lucide-react'
import { Button } from './components/Button'
import { Card } from './components/Card'
import { PageShell } from './components/PageShell'
import { fadeUp, popIn, staggerChildren } from './lib/animations'

function App() {
  return (
    <PageShell>
      <motion.header
        variants={fadeUp}
        initial="initial"
        animate="in"
        className="text-center mb-8"
      >
        <motion.div
          variants={popIn}
          initial="initial"
          animate="in"
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white mb-4 shadow-card"
        >
          <Sparkles size={32} strokeWidth={2.5} />
        </motion.div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1">FinDuo</h1>
        <p className="text-ink/60 text-sm">Design system preview</p>
      </motion.header>

      <motion.section
        variants={staggerChildren(0.06)}
        initial="initial"
        animate="in"
        className="grid grid-cols-3 gap-3 mb-8"
      >
        {[
          { icon: Flame, label: 'Streak', color: 'text-xp' },
          { icon: TrendingUp, label: 'XP', color: 'text-primary' },
          { icon: Lock, label: 'Levels', color: 'text-ink/40' },
        ].map((item) => (
          <motion.div key={item.label} variants={fadeUp}>
            <Card className="text-center">
              <item.icon
                className={`w-6 h-6 mx-auto mb-1 ${item.color}`}
                strokeWidth={2.5}
              />
              <div className="text-xs font-semibold text-ink/70">
                {item.label}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      <section className="space-y-3">
        <Button variant="primary" className="w-full">
          Start learning
        </Button>
        <Button variant="secondary" className="w-full">
          Continue lesson
        </Button>
        <Button variant="danger" className="w-full">
          Reset progress
        </Button>
        <div className="flex justify-center pt-2">
          <Button variant="ghost" size="md">
            More options
          </Button>
        </div>
      </section>

      <p className="text-xs text-ink/40 mt-10 text-center">
        Step 3 of 12 · design system foundation
      </p>
    </PageShell>
  )
}

export default App
