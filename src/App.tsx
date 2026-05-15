import { useState } from 'react'
import { getLessonById } from './data/lessons'
import { DailyChallengeScreen } from './screens/DailyChallenge'
import { Home } from './screens/Home'
import { LessonScreen } from './screens/Lesson'
import { SimulationScreen } from './screens/Simulation'

type Route =
  | { kind: 'home' }
  | { kind: 'lesson'; lessonId: string }
  | { kind: 'daily' }

function App() {
  const [route, setRoute] = useState<Route>({ kind: 'home' })

  const handleStartLesson = (id: string) => {
    setRoute({ kind: 'lesson', lessonId: id })
  }

  const goHome = () => setRoute({ kind: 'home' })

  if (route.kind === 'daily') {
    return <DailyChallengeScreen onComplete={goHome} onExit={goHome} />
  }

  if (route.kind === 'lesson') {
    const lesson = getLessonById(route.lessonId)
    if (lesson?.type === 'multiple-choice') {
      return (
        <LessonScreen lesson={lesson} onComplete={goHome} onExit={goHome} />
      )
    }
    if (lesson?.type === 'simulation') {
      return (
        <SimulationScreen
          lesson={lesson}
          onComplete={goHome}
          onExit={goHome}
        />
      )
    }
  }

  return (
    <Home
      onStartLesson={handleStartLesson}
      onStartDaily={() => setRoute({ kind: 'daily' })}
    />
  )
}

export default App
