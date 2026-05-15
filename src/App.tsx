import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { BottomNav, type Tab } from './components/BottomNav'
import { getLessonById } from './data/lessons'
import { DailyChallengeScreen } from './screens/DailyChallenge'
import { Home } from './screens/Home'
import { Leaderboard } from './screens/Leaderboard'
import { LessonScreen } from './screens/Lesson'
import { Profile } from './screens/Profile'
import { SimulationScreen } from './screens/Simulation'

type FullScreenRoute =
  | { kind: 'lesson'; lessonId: string }
  | { kind: 'daily' }
  | null

function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [full, setFull] = useState<FullScreenRoute>(null)

  const goBack = () => setFull(null)

  if (full?.kind === 'daily') {
    return <DailyChallengeScreen onComplete={goBack} onExit={goBack} />
  }

  if (full?.kind === 'lesson') {
    const lesson = getLessonById(full.lessonId)
    if (lesson?.type === 'multiple-choice') {
      return (
        <LessonScreen lesson={lesson} onComplete={goBack} onExit={goBack} />
      )
    }
    if (lesson?.type === 'simulation') {
      return (
        <SimulationScreen
          lesson={lesson}
          onComplete={goBack}
          onExit={goBack}
        />
      )
    }
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {tab === 'home' && (
            <Home
              onStartLesson={(id) =>
                setFull({ kind: 'lesson', lessonId: id })
              }
              onStartDaily={() => setFull({ kind: 'daily' })}
            />
          )}
          {tab === 'leaderboard' && <Leaderboard />}
          {tab === 'profile' && <Profile />}
        </motion.div>
      </AnimatePresence>
      <BottomNav active={tab} onChange={setTab} />
    </>
  )
}

export default App
