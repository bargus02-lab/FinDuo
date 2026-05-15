import { useState } from 'react'
import { getLessonById } from './data/lessons'
import { Home } from './screens/Home'
import { LessonScreen } from './screens/Lesson'
import { useGameStore } from './store/useGameStore'

function App() {
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)
  const completeLesson = useGameStore((s) => s.completeLesson)

  const handleStartLesson = (id: string) => {
    const lesson = getLessonById(id)
    if (!lesson) return
    if (lesson.type === 'multiple-choice') {
      setActiveLessonId(id)
    } else {
      // Simulations land in step 8. For now, tapping Start on a sim just
      // marks it complete so the path progresses.
      completeLesson(lesson.id, lesson.xp)
    }
  }

  if (activeLessonId) {
    const lesson = getLessonById(activeLessonId)
    if (lesson && lesson.type === 'multiple-choice') {
      // LessonScreen now owns the store mutation so the complete-phase
      // animations have a snapshot to roll up from.
      return (
        <LessonScreen
          lesson={lesson}
          onComplete={() => setActiveLessonId(null)}
          onExit={() => setActiveLessonId(null)}
        />
      )
    }
    // Fall through to Home if something is off
  }

  return <Home onStartLesson={handleStartLesson} />
}

export default App
