'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Lightbulb } from 'lucide-react'
import type { FlashcardType } from '@/hooks/useFlashcards'

interface FlashcardCardProps {
  card: FlashcardType
  isFlipped: boolean
  onFlip: () => void
}

const difficultyColors = {
  EASY: 'bg-[#00B894]/20 text-[#00B894]',
  MEDIUM: 'bg-[#FDCB6E]/20 text-[#FDCB6E]',
  HARD: 'bg-[#E17055]/20 text-[#E17055]',
}

export function FlashcardCard({ card, isFlipped, onFlip }: FlashcardCardProps) {
  const [showHint, setShowHint] = useState(false)

  return (
    <div
      className="relative h-72 w-full cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={onFlip}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative h-full w-full"
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#16161F] p-6 text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Badge className={cn('mb-4', difficultyColors[card.difficulty])}>
            {card.difficulty}
          </Badge>
          <p className="text-xl font-semibold text-[#E8E8F0] leading-relaxed">{card.question}</p>
          <p className="mt-4 text-sm text-[#8888A0]">Click to reveal answer</p>

          {card.hint && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowHint(!showHint) }}
              className="mt-4 flex items-center gap-1 text-xs text-[#FDCB6E] hover:opacity-80 transition-opacity"
            >
              <Lightbulb className="h-3 w-3" />
              {showHint ? card.hint : 'Show hint'}
            </button>
          )}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-[#6C5CE7]/30 bg-[#16161F] p-6 text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <Badge className="mb-4 bg-[#6C5CE7]/20 text-[#6C5CE7]">Answer</Badge>
          <p className="text-lg text-[#E8E8F0] leading-relaxed">{card.answer}</p>
          <p className="mt-4 text-sm text-[#8888A0]">Click to go back</p>
        </div>
      </motion.div>
    </div>
  )
}
