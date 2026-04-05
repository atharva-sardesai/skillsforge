'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { DRMWrapper } from '@/components/shared/DRMWrapper'
import { QuestionCard } from './QuestionCard'
import { QuizTimer } from './QuizTimer'
import { QuizResults } from './QuizResults'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useQuizStore } from '@/stores/quizStore'
import { useSubmitQuiz } from '@/hooks/useQuiz'
import { toast } from 'sonner'
import type { QuizType } from '@/hooks/useQuiz'

interface QuizPlayerProps {
  quiz: QuizType
}

export function QuizPlayer({ quiz }: QuizPlayerProps) {
  const {
    questions, currentIndex, answers, startTime, isRevealed, isCompleted,
    startQuiz, submitAnswer, nextQuestion, resetQuiz,
  } = useQuizStore()

  const submitQuiz = useSubmitQuiz()

  useEffect(() => {
    if (questions.length === 0) {
      startQuiz(quiz.id, quiz.questions as Parameters<typeof startQuiz>[1])
    }
  }, [quiz, questions.length, startQuiz])

  const handleExpire = () => {
    toast.warning('Time\'s up! Submitting quiz...')
    handleComplete()
  }

  const handleComplete = async () => {
    if (submitQuiz.isPending) return
    const totalTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
    try {
      await submitQuiz.mutateAsync({
        quizId: quiz.id,
        totalTime,
        answers: answers.map((a) => ({
          questionId: a.questionId,
          selectedIndex: a.selectedIndex,
          timeTaken: a.timeTaken,
        })),
      })
    } catch (e) {
      toast.error('Failed to submit quiz')
    }
  }

  useEffect(() => {
    if (isCompleted && !submitQuiz.data && !submitQuiz.isPending) {
      handleComplete()
    }
  }, [isCompleted])

  if (submitQuiz.data) {
    return (
      <QuizResults
        quiz={quiz}
        result={submitQuiz.data}
        onRetry={() => { resetQuiz(); submitQuiz.reset() }}
      />
    )
  }

  if (questions.length === 0) {
    return <div className="flex items-center justify-center h-64 text-[#8888A0]">Loading quiz...</div>
  }

  const currentQ = questions[currentIndex]
  const currentAnswer = answers.find((a) => a.questionId === currentQ?.id)
  const progress = ((currentIndex) / questions.length) * 100
  const isLast = currentIndex === questions.length - 1

  return (
    <DRMWrapper className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#8888A0]">
          Question <span className="font-bold text-[#E8E8F0]">{currentIndex + 1}</span> of {questions.length}
        </span>
        <div className="flex items-center gap-3">
          {quiz.timeLimit && !isCompleted && (
            <QuizTimer totalSeconds={quiz.timeLimit * 60} onExpire={handleExpire} />
          )}
        </div>
      </div>

      <Progress value={progress} className="h-1.5 bg-white/10" />

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <QuestionCard
          question={currentQ}
          selectedIndex={currentAnswer?.selectedIndex ?? null}
          isRevealed={isRevealed}
          onSelect={(index) => {
            if (!isRevealed) submitAnswer(currentQ.id, index)
          }}
        />
      </motion.div>

      {isRevealed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {isLast ? (
            <Button
              onClick={() => nextQuestion()}
              disabled={submitQuiz.isPending}
              className="w-full bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white"
            >
              {submitQuiz.isPending ? 'Submitting...' : 'Finish Quiz'}
            </Button>
          ) : (
            <Button onClick={nextQuestion} className="w-full bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white">
              Next Question →
            </Button>
          )}
        </motion.div>
      )}
    </DRMWrapper>
  )
}
