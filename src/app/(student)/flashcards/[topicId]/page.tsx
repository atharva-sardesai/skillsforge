'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import { useFlashcards } from '@/hooks/useFlashcards'
import { useTopic } from '@/hooks/useTopics'
import { FlashcardDeck } from '@/components/flashcards/FlashcardDeck'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'

interface Props {
  params: Promise<{ topicId: string }>
}

export default function FlashcardsPage({ params }: Props) {
  const { topicId } = use(params)
  const { data: flashcardData, isLoading } = useFlashcards(topicId)
  const { data: topic } = useTopic(topicId)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm" className="border-white/10 text-[#8888A0] hover:text-[#E8E8F0] bg-transparent">
          <Link href={`/topics/${topicId}`}><ChevronLeft className="h-4 w-4 mr-1" />Back</Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold text-[#E8E8F0]">
            {topic?.icon} {topic?.name} — Flashcards
          </h1>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-72 rounded-2xl bg-white/5" />
          <div className="flex gap-4">
            <Skeleton className="h-10 flex-1 bg-white/5" />
            <Skeleton className="h-10 flex-1 bg-white/5" />
          </div>
        </div>
      ) : !flashcardData?.flashcards.length ? (
        <EmptyState
          emoji="📚"
          title="No flashcards yet"
          description="This topic doesn't have any flashcards yet. Check back later!"
        />
      ) : (
        <FlashcardDeck
          flashcards={flashcardData.flashcards}
          progressMap={flashcardData.progressMap}
        />
      )}
    </motion.div>
  )
}
