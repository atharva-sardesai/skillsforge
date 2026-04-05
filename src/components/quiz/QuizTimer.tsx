'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuizTimerProps {
  totalSeconds: number
  onExpire: () => void
}

export function QuizTimer({ totalSeconds, onExpire }: QuizTimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds)

  useEffect(() => {
    if (remaining <= 0) { onExpire(); return }
    const interval = setInterval(() => setRemaining((r) => r - 1), 1000)
    return () => clearInterval(interval)
  }, [remaining, onExpire])

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const isLow = remaining <= 30

  return (
    <div className={cn(
      'flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-sm font-bold transition-colors',
      isLow ? 'bg-[#E17055]/20 text-[#E17055] animate-pulse' : 'bg-white/5 text-[#E8E8F0]'
    )}>
      <Clock className="h-4 w-4" />
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  )
}
