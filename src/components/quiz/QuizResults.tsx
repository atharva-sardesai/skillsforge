'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Trophy, Clock, Zap } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { QuizType } from '@/hooks/useQuiz'

interface QuizResultsProps {
  quiz: QuizType
  result: {
    score: number
    correctCount: number
    totalQuestions: number
    passed: boolean
    xpGained: number
    attempt: {
      totalTime: number
      answers: Array<{
        questionId: string
        selectedIndex: number
        isCorrect: boolean
        question: {
          question: string
          options: string[]
          correctIndex: number
          explanation: string | null
        }
      }>
    }
  }
  onRetry: () => void
}

export function QuizResults({ quiz, result, onRetry }: QuizResultsProps) {
  const { score, correctCount, totalQuestions, passed, xpGained, attempt } = result
  const minutes = Math.floor(attempt.totalTime / 60)
  const seconds = attempt.totalTime % 60

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      {/* Score header */}
      <div className={cn(
        'rounded-2xl border p-8 text-center',
        passed ? 'border-[#00B894]/30 bg-[#00B894]/5' : 'border-[#E17055]/30 bg-[#E17055]/5'
      )}>
        <div className="text-6xl mb-4">{passed ? '🏆' : '📚'}</div>
        <h2 className="text-4xl font-bold mb-2" style={{ color: passed ? '#00B894' : '#E17055' }}>
          {score}%
        </h2>
        <p className="text-lg text-[#E8E8F0] font-semibold mb-1">
          {passed ? 'Passed!' : 'Keep Practicing!'}
        </p>
        <p className="text-[#8888A0]">
          {correctCount} of {totalQuestions} questions correct
        </p>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <span className="flex items-center gap-1 text-[#FDCB6E]">
            <Zap className="h-4 w-4" />
            +{xpGained} XP
          </span>
          <span className="flex items-center gap-1 text-[#8888A0]">
            <Clock className="h-4 w-4" />
            {minutes}m {seconds}s
          </span>
        </div>
      </div>

      {/* Question breakdown */}
      <div className="space-y-3">
        <h3 className="font-semibold text-[#E8E8F0]">Question Review</h3>
        {attempt.answers.map((answer, i) => {
          const options = answer.question.options as string[]
          return (
            <div
              key={answer.questionId}
              className={cn(
                'rounded-xl border p-4',
                answer.isCorrect ? 'border-[#00B894]/20 bg-[#00B894]/5' : 'border-[#E17055]/20 bg-[#E17055]/5'
              )}
            >
              <div className="flex items-start gap-3">
                {answer.isCorrect
                  ? <CheckCircle2 className="h-5 w-5 text-[#00B894] flex-shrink-0 mt-0.5" />
                  : <XCircle className="h-5 w-5 text-[#E17055] flex-shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#E8E8F0] mb-2">Q{i + 1}. {answer.question.question}</p>
                  <p className="text-xs text-[#8888A0]">
                    Your answer: <span className={answer.isCorrect ? 'text-[#00B894]' : 'text-[#E17055]'}>
                      {options[answer.selectedIndex]}
                    </span>
                  </p>
                  {!answer.isCorrect && (
                    <p className="text-xs text-[#8888A0]">
                      Correct: <span className="text-[#00B894]">{options[answer.question.correctIndex]}</span>
                    </p>
                  )}
                  {answer.question.explanation && (
                    <p className="text-xs text-[#8888A0] mt-1 italic">{answer.question.explanation}</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex gap-3">
        <Button onClick={onRetry} variant="outline" className="flex-1 border-white/10 text-[#E8E8F0] hover:bg-white/5 bg-transparent">
          Try Again
        </Button>
        <Button asChild className="flex-1 bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white">
          <Link href="/topics">Back to Topics</Link>
        </Button>
      </div>
    </motion.div>
  )
}
