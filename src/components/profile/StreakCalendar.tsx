'use client'

import { cn } from '@/lib/utils'

interface StreakCalendarProps {
  // Array of ISO date strings for days with activity
  activeDays: string[]
}

function getLast84Days(): Date[] {
  const days: Date[] = []
  const today = new Date()
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push(d)
  }
  return days
}

export function StreakCalendar({ activeDays }: StreakCalendarProps) {
  const days = getLast84Days()
  const activeSet = new Set(activeDays.map((d) => d.split('T')[0]))

  const weeks: Date[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => {
              const key = day.toISOString().split('T')[0]
              const isActive = activeSet.has(key)
              return (
                <div
                  key={key}
                  title={key}
                  className={cn(
                    'h-3 w-3 rounded-sm transition-colors',
                    isActive ? 'bg-[#6C5CE7]' : 'bg-white/10'
                  )}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-[#8888A0]">
        <span>Less</span>
        <div className="h-3 w-3 rounded-sm bg-white/10" />
        <div className="h-3 w-3 rounded-sm bg-[#6C5CE7]/40" />
        <div className="h-3 w-3 rounded-sm bg-[#6C5CE7]/70" />
        <div className="h-3 w-3 rounded-sm bg-[#6C5CE7]" />
        <span>More</span>
      </div>
    </div>
  )
}
