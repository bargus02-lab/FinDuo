import { motion } from 'framer-motion'
import type { Lesson } from '../data/lessons'
import { staggerChildren, fadeUp } from '../lib/animations'
import { useGameStore } from '../store/useGameStore'
import { LessonNode, type NodeState } from './LessonNode'

const ZIGZAG = [0, -44, -60, -44, 0, 44, 60, 44]

interface LessonPathProps {
  lessons: Lesson[]
  onLessonTap: (lesson: Lesson) => void
}

export function LessonPath({ lessons, onLessonTap }: LessonPathProps) {
  const completed = useGameStore((s) => s.completedLessons)

  const currentIndex = lessons.findIndex((l) => !completed[l.id])

  return (
    <motion.div
      variants={staggerChildren(0.04)}
      initial="initial"
      animate="in"
      className="flex flex-col items-center py-4 gap-7"
    >
      {lessons.map((lesson, i) => {
        const state: NodeState = completed[lesson.id]
          ? 'completed'
          : i === currentIndex || (currentIndex === -1 && i === 0)
            ? 'current'
            : 'locked'
        const offset = ZIGZAG[i % ZIGZAG.length]

        return (
          <motion.div
            key={lesson.id}
            variants={fadeUp}
            style={{ transform: `translateX(${offset}px)` }}
          >
            <LessonNode
              lesson={lesson}
              state={state}
              onClick={() => onLessonTap(lesson)}
            />
          </motion.div>
        )
      })}
    </motion.div>
  )
}
