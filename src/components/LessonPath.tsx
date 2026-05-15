import { motion } from 'framer-motion'
import { Fragment } from 'react'
import type { Lesson } from '../data/lessons'
import { fadeUp, staggerChildren } from '../lib/animations'
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
      className="flex flex-col items-center py-4"
    >
      {lessons.map((lesson, i) => {
        const state: NodeState = completed[lesson.id]
          ? 'completed'
          : i === currentIndex || (currentIndex === -1 && i === 0)
            ? 'current'
            : 'locked'
        const offset = ZIGZAG[i % ZIGZAG.length]
        const isLast = i === lessons.length - 1

        return (
          <Fragment key={lesson.id}>
            <motion.div
              variants={fadeUp}
              style={{ transform: `translateX(${offset}px)` }}
              className="my-3"
            >
              <LessonNode
                lesson={lesson}
                state={state}
                onClick={() => onLessonTap(lesson)}
              />
            </motion.div>
            {!isLast && <Connector />}
          </Fragment>
        )
      })}
    </motion.div>
  )
}

function Connector() {
  return (
    <div className="flex flex-col items-center gap-1 my-1" aria-hidden>
      <div className="w-1.5 h-1.5 rounded-full bg-fg/15" />
      <div className="w-1.5 h-1.5 rounded-full bg-fg/15" />
      <div className="w-1.5 h-1.5 rounded-full bg-fg/15" />
    </div>
  )
}
