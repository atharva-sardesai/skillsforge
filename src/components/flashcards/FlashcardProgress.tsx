'use client'

import { Progress } from '@/components/ui/progress'
import { CheckCircle2, XCircle } from 'lucide-react'

interface FlashcardProgressProps {
  known: number
  total: number
  current: number
}

export function FlashcardProgress({ known, total, current }: FlashcardProgressProps) {
  const percentage = total > 0 ? Math.round((known / total) * 100) : 0

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#8888A0]">Card {current} of {total}</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[#00B894]">
            <CheckCircle2 className="h-4 w-4" />
            {known} known
          </span>
          <span className="flex items-center gap-1 text-[#E17055]">
            <XCircle className="h-4 w-4" />
            {total - known} to review
          </span>
        </div>
      </div>
      <Progress value={percentage} className="h-2 bg-white/10" />
      <p className="text-center text-xs text-[#8888A0]">{percentage}% mastered</p>
    </div>
  )
}
