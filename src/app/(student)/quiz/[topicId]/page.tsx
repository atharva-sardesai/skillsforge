'use client'

import { use, useState } from 'react'
import { motion } from 'framer-motion'
import { useQuizzes } from '@/hooks/useQuiz'
import { useTopic } from '@/hooks/useTopics'
import { QuizPlayer } from '@/components/quiz/QuizPlayer'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ChevronLeft, Clock, HelpCircle, Trophy, Layers } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'
import type { QuizType } from '@/hooks/useQuiz'

interface Props {
  params: Promise<{ topicId: string }>
}

export default function QuizPage({ params }: Props) {
  const { topicId } = use(params)
  const { data: quizzes, isLoading } = useQuizzes(topicId)
  const { data: topic } = useTopic(topicId)
  const [selectedQuiz, setSelectedQuiz] = useState<QuizType | null>(null)

  if (selectedQuiz) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-[#8888A0] hover:text-[#E8E8F0] bg-transparent"
            onClick={() => setSelectedQuiz(null)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />Back to Quizzes
          </Button>
          <h1 className="text-xl font-bold text-[#E8E8F0]">{selectedQuiz.title}</h1>
        </div>
        <QuizPlayer quiz={selectedQuiz} />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl"
    >
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm" className="border-white/10 text-[#8888A0] hover:text-[#E8E8F0] bg-transparent">
          <Link href={`/topics/${topicId}`}><ChevronLeft className="h-4 w-4 mr-1" />Back</Link>
        </Button>
        <h1 className="text-xl font-bold text-[#E8E8F0]">
          {topic?.icon} {topic?.name} — Quizzes
        </h1>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl bg-white/5" />)}
        </div>
      ) : !quizzes?.length ? (
        <EmptyState emoji="🎯" title="No quizzes yet" description="No quizzes available for this topic yet." />
      ) : (
        <div className="space-y-3">
          {quizzes.map((quiz: QuizType) => (
            <div
              key={quiz.id}
              className="rounded-xl border border-white/10 bg-[#16161F] p-5 hover:border-[#6C5CE7]/40 transition-colors cursor-pointer"
              onClick={() => setSelectedQuiz(quiz)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h2 className="font-semibold text-[#E8E8F0]">{quiz.title}</h2>
                  {quiz.description && (
                    <p className="text-sm text-[#8888A0] mt-1">{quiz.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-xs text-[#8888A0]">
                    <span className="flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5" />
                      {quiz.questions.length} questions
                    </span>
                    {quiz.timeLimit && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {quiz.timeLimit} minutes
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Trophy className="h-3.5 w-3.5" />
                      Pass: {quiz.passingScore}%
                    </span>
                    <span className="flex items-center gap-1">
                      <HelpCircle className="h-3.5 w-3.5" />
                      {quiz._count.attempts} attempts
                    </span>
                  </div>
                </div>
                <Button className="bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white flex-shrink-0">
                  Start Quiz
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
