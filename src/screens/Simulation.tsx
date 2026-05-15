import { X } from 'lucide-react'
import { useState } from 'react'
import {
  LessonComplete,
  type CompleteSnapshot,
} from '../components/LessonComplete'
import { BudgetAllocator } from '../components/Simulation/BudgetAllocator'
import { PortfolioBuilder } from '../components/Simulation/PortfolioBuilder'
import { WaterfallVisualizer } from '../components/Simulation/WaterfallVisualizer'
import type { Lesson } from '../data/lessons'
import { useGameStore } from '../store/useGameStore'

type Phase = 'playing' | 'complete'

interface SimulationScreenProps {
  lesson: Lesson
  onComplete: () => void
  onExit: () => void
}

export function SimulationScreen({
  lesson,
  onComplete,
  onExit,
}: SimulationScreenProps) {
  const [phase, setPhase] = useState<Phase>('playing')
  const [snapshot, setSnapshot] = useState<CompleteSnapshot | null>(null)

  const handleFinish = () => {
    const state = useGameStore.getState()
    setSnapshot({ xpBefore: state.xp, streakBefore: state.streak })
    state.completeLesson(lesson.id, lesson.xp)
    setPhase('complete')
  }

  if (phase === 'complete' && snapshot) {
    return (
      <LessonComplete
        title={lesson.title}
        headline="Simulation complete"
        snapshot={snapshot}
        xpAfter={snapshot.xpBefore + lesson.xp}
        streakAfter={useGameStore.getState().streak}
        onContinue={onComplete}
      />
    )
  }

  return (
    <div className="min-h-full flex flex-col">
      <header className="px-5 pt-4 pb-3 flex items-center gap-3 max-w-md mx-auto w-full">
        <button
          onClick={onExit}
          aria-label="Exit simulation"
          className="w-9 h-9 rounded-xl bg-white border border-ink/10 flex items-center justify-center text-ink/50 hover:text-ink hover:border-ink/30 transition-colors"
        >
          <X size={18} strokeWidth={3} />
        </button>
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-wider font-bold text-ink/40">
            Simulation
          </div>
          <h1 className="text-base font-extrabold tracking-tight leading-tight">
            {lesson.title}
          </h1>
        </div>
        <div className="text-xs font-bold text-primary">+{lesson.xp} XP</div>
      </header>

      <main className="flex-1 px-5 max-w-md mx-auto w-full pb-10">
        {lesson.simulationId === 'budget' && (
          <BudgetAllocator onFinish={handleFinish} />
        )}
        {lesson.simulationId === 'portfolio' && (
          <PortfolioBuilder onFinish={handleFinish} />
        )}
        {lesson.simulationId === 'waterfall' && (
          <WaterfallVisualizer onFinish={handleFinish} />
        )}
      </main>
    </div>
  )
}
