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

  const handleLessonComplete = (lessonId: string) => {
    const lesson = getLessonById(lessonId)
    if (lesson) completeLesson(lesson.id, lesson.xp)
    setActiveLessonId(null)
  }

  if (activeLessonId) {
    const lesson = getLessonById(activeLessonId)
    if (lesson && lesson.type === 'multiple-choice') {
      return (
        <LessonScreen
          lesson={lesson}
          onComplete={() => handleLessonComplete(lesson.id)}
          onExit={() => setActiveLessonId(null)}
        />
      )
    }
    // Fall through to Home if something is off
  }

  return <Home onStartLesson={handleStartLesson} />
}

export default App
