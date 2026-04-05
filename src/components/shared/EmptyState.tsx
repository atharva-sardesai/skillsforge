'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  emoji?: string
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ emoji = '📭', title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <span className="mb-4 text-5xl">{emoji}</span>
      <h3 className="mb-2 text-lg font-semibold text-[#E8E8F0]">{title}</h3>
      {description && <p className="mb-6 max-w-sm text-sm text-[#8888A0]">{description}</p>}
      {action && (
        <Button onClick={action.onClick} className="bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white">
          {action.label}
        </Button>
      )}
    </div>
  )
}
