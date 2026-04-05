'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  category: string
  className?: string
}

const categoryColors: Record<string, string> = {
  Technical: 'bg-[#6C5CE7]/20 text-[#6C5CE7]',
  Behavioral: 'bg-[#00B894]/20 text-[#00B894]',
  'System Design': 'bg-[#FDCB6E]/20 text-[#FDCB6E]',
  Domain: 'bg-[#0984E3]/20 text-[#0984E3]',
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <Badge className={cn(categoryColors[category] ?? 'bg-white/10 text-[#E8E8F0]', className)}>
      {category}
    </Badge>
  )
}
