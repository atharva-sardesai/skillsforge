'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

interface BadgeData {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: Date
}

interface BadgeGridProps {
  badges: BadgeData[]
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-3">
        {badges.map((badge) => (
          <Tooltip key={badge.id}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-xl border text-2xl transition-all',
                  badge.earned
                    ? 'border-[#6C5CE7]/40 bg-[#6C5CE7]/10 shadow-[0_0_12px_rgba(108,92,231,0.2)]'
                    : 'border-white/10 bg-white/5 opacity-40 grayscale'
                )}
              >
                {badge.icon}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-[#16161F] border-white/10">
              <p className="font-semibold text-[#E8E8F0]">{badge.name}</p>
              <p className="text-xs text-[#8888A0]">{badge.description}</p>
              {badge.earned && badge.earnedAt && (
                <p className="text-xs text-[#6C5CE7] mt-1">Earned {formatDate(badge.earnedAt)}</p>
              )}
              {!badge.earned && (
                <p className="text-xs text-[#8888A0] mt-1">Not yet earned</p>
              )}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
