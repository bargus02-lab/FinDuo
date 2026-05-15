import { useState } from 'react'
import { getLessonById } from './data/lessons'
import { Home } from './screens/Home'
import { LessonScreen } from './screens/Lesson'
import { SimulationScreen } from './screens/Simulation'

function App() {
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)

  const handleStartLesson = (id: string) => {
    setActiveLessonId(id)
  }

  if (activeLessonId) {
    const lesson = getLessonById(activeLessonId)
    if (lesson?.type === 'multiple-choice') {
      return (
        <LessonScreen
          lesson={lesson}
          onComplete={() => setActiveLessonId(null)}
          onExit={() => setActiveLessonId(null)}
        />
      )
    }
    if (lesson?.type === 'simulation') {
      return (
        <SimulationScreen
          lesson={lesson}
          onComplete={() => setActiveLessonId(null)}
          onExit={() => setActiveLessonId(null)}
        />
      )
    }
  }

  return <Home onStartLesson={handleStartLesson} />
}

export default App
