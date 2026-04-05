'use client'

import { Progress } from '@/components/ui/progress'
import { formatDate } from '@/lib/utils'
import { BookOpen, HelpCircle, Clock } from 'lucide-react'

interface TopicProgressData {
  topic: { id: string; name: string; icon: string; color: string }
  masteryScore: number
  flashcardsKnown: number
  flashcardsTotal: number
  quizzesTaken: number
  avgQuizScore: number
  timeSpent: number
  lastAccessedAt: string | null
}

interface ProgressCardsProps {
  topicProgress: TopicProgressData[]
}

export function ProgressCards({ topicProgress }: ProgressCardsProps) {
  if (!topicProgress.length) {
    return (
      <p className="text-center text-[#8888A0] py-8">No topic progress yet. Start studying!</p>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {topicProgress.map((tp) => (
        <div
          key={tp.topic.id}
          className="rounded-xl border border-white/10 bg-[#16161F] p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{tp.topic.icon}</span>
              <h3 className="font-semibold text-[#E8E8F0]">{tp.topic.name}</h3>
            </div>
            <span className="text-lg font-bold" style={{ color: tp.topic.color }}>
              {tp.masteryScore}%
            </span>
          </div>

          <Progress value={tp.masteryScore} className="h-2 bg-white/10" />

          <div className="grid grid-cols-3 gap-2 text-xs text-[#8888A0]">
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span>{tp.flashcardsKnown}/{tp.flashcardsTotal} cards</span>
            </div>
            <div className="flex items-center gap-1">
              <HelpCircle className="h-3 w-3" />
              <span>{tp.quizzesTaken} quizzes</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{Math.floor(tp.timeSpent / 60)}m</span>
            </div>
          </div>

          {tp.lastAccessedAt && (
            <p className="text-xs text-[#8888A0]">Last studied: {formatDate(tp.lastAccessedAt)}</p>
          )}
        </div>
      ))}
    </div>
  )
}
