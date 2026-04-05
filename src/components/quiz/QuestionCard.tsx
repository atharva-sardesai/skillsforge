'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle } from 'lucide-react'
import type { QuizQuestionType } from '@/hooks/useQuiz'

interface QuestionCardProps {
  question: QuizQuestionType
  selectedIndex: number | null
  isRevealed: boolean
  onSelect: (index: number) => void
}

export function QuestionCard({ question, selectedIndex, isRevealed, onSelect }: QuestionCardProps) {
  const options = question.options as string[]

  return (
    <div className="space-y-4">
      <p className="text-xl font-semibold text-[#E8E8F0] leading-relaxed">{question.question}</p>
      <div className="space-y-3">
        {options.map((option, i) => {
          const isSelected = selectedIndex === i
          const isCorrect = i === question.correctIndex
          let variant: 'default' | 'correct' | 'wrong' | 'dim' = 'default'

          if (isRevealed) {
            if (isCorrect) variant = 'correct'
            else if (isSelected && !isCorrect) variant = 'wrong'
            else variant = 'dim'
          } else if (isSelected) {
            variant = 'correct' // highlight selection before reveal
          }

          return (
            <button
              key={i}
              disabled={isRevealed}
              onClick={() => onSelect(i)}
              className={cn(
                'w-full rounded-xl border p-4 text-left transition-all duration-200 flex items-center gap-3',
                variant === 'default' && !isSelected && 'border-white/10 bg-[#16161F] text-[#E8E8F0] hover:border-[#6C5CE7]/50 hover:bg-[#6C5CE7]/10',
                variant === 'default' && isSelected && 'border-[#6C5CE7] bg-[#6C5CE7]/20 text-[#E8E8F0]',
                variant === 'correct' && 'border-[#00B894] bg-[#00B894]/10 text-[#00B894]',
                variant === 'wrong' && 'border-[#E17055] bg-[#E17055]/10 text-[#E17055]',
                variant === 'dim' && 'border-white/5 bg-white/2 text-[#8888A0] opacity-50',
              )}
            >
              <span className={cn(
                'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border text-sm font-bold',
                variant === 'correct' ? 'border-[#00B894]' : variant === 'wrong' ? 'border-[#E17055]' : 'border-white/20'
              )}>
                {isRevealed && isCorrect ? <CheckCircle2 className="h-4 w-4" /> :
                  isRevealed && isSelected && !isCorrect ? <XCircle className="h-4 w-4" /> :
                    String.fromCharCode(65 + i)}
              </span>
              <span className="font-medium">{option}</span>
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {isRevealed && question.explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl border border-[#6C5CE7]/20 bg-[#6C5CE7]/5 p-4"
          >
            <p className="text-sm font-semibold text-[#6C5CE7] mb-1">Explanation</p>
            <p className="text-sm text-[#E8E8F0]/80">{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
