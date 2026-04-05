'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CategoryBadge } from './CategoryBadge'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Question {
  question: string
  category: string
  difficulty: string
  tip: string
}

interface QuestionListProps {
  questions: Question[]
  detectedRole: string
}

const difficultyColors: Record<string, string> = {
  Easy: 'bg-[#00B894]/20 text-[#00B894]',
  Medium: 'bg-[#FDCB6E]/20 text-[#FDCB6E]',
  Hard: 'bg-[#E17055]/20 text-[#E17055]',
}

const categories = ['Technical', 'Behavioral', 'System Design', 'Domain']

export function QuestionList({ questions, detectedRole }: QuestionListProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const toggleExpanded = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const filtered = activeCategory === 'All'
    ? questions
    : questions.filter((q) => q.category === activeCategory)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#E8E8F0]">Generated Questions</h2>
          <p className="text-sm text-[#8888A0]">Detected role: <span className="text-[#6C5CE7] font-medium">{detectedRole}</span></p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                activeCategory === cat
                  ? 'bg-[#6C5CE7] text-white'
                  : 'bg-white/5 text-[#8888A0] hover:text-[#E8E8F0]'
              )}
            >
              {cat} {cat !== 'All' && `(${questions.filter((q) => q.category === cat).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {filtered.map((q, i) => {
          const globalIndex = questions.indexOf(q)
          const isExpanded = expanded.has(globalIndex)
          return (
            <motion.div
              key={globalIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border border-white/10 bg-[#16161F] overflow-hidden"
            >
              <button
                className="w-full flex items-start gap-3 p-4 text-left hover:bg-white/5 transition-colors"
                onClick={() => toggleExpanded(globalIndex)}
              >
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#6C5CE7]/20 text-xs font-bold text-[#6C5CE7]">
                  {globalIndex + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#E8E8F0] leading-relaxed">{q.question}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <CategoryBadge category={q.category} />
                    <Badge className={cn('text-xs', difficultyColors[q.difficulty] ?? 'bg-white/10 text-[#E8E8F0]')}>
                      {q.difficulty}
                    </Badge>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="h-4 w-4 text-[#8888A0] flex-shrink-0 mt-1" /> : <ChevronDown className="h-4 w-4 text-[#8888A0] flex-shrink-0 mt-1" />}
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="px-4 pb-4"
                >
                  <div className="flex items-start gap-2 rounded-lg bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 p-3">
                    <Lightbulb className="h-4 w-4 text-[#6C5CE7] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#E8E8F0]/80">{q.tip}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
