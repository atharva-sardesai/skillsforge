'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { FlashcardCard } from './FlashcardCard'
import { FlashcardProgress } from './FlashcardProgress'
import { DRMWrapper } from '@/components/shared/DRMWrapper'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateFlashcardProgress, type FlashcardType } from '@/hooks/useFlashcards'
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react'

interface FlashcardDeckProps {
  flashcards: FlashcardType[]
  progressMap: Record<string, { known: boolean; reviewCount: number }>
}

export function FlashcardDeck({ flashcards, progressMap }: FlashcardDeckProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [knownSet, setKnownSet] = useState<Set<string>>(
    new Set(Object.entries(progressMap).filter(([, p]) => p.known).map(([id]) => id))
  )
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL')
  const [direction, setDirection] = useState(0)
  const updateProgress = useUpdateFlashcardProgress()

  const filtered = difficultyFilter === 'ALL'
    ? flashcards
    : flashcards.filter((f) => f.difficulty === difficultyFilter)

  const currentCard = filtered[currentIndex]

  const handleKnow = useCallback(async () => {
    if (!currentCard) return
    const newKnown = new Set(knownSet).add(currentCard.id)
    setKnownSet(newKnown)
    await updateProgress.mutateAsync({ flashcardId: currentCard.id, known: true })
    toast.success('Marked as known!')
    setDirection(1)
    setIsFlipped(false)
    setCurrentIndex((i) => Math.min(i + 1, filtered.length - 1))
  }, [currentCard, knownSet, updateProgress, filtered.length])

  const handleReview = useCallback(async () => {
    if (!currentCard) return
    const newKnown = new Set(knownSet)
    newKnown.delete(currentCard.id)
    setKnownSet(newKnown)
    await updateProgress.mutateAsync({ flashcardId: currentCard.id, known: false })
    toast.info('Added to review queue')
    setDirection(1)
    setIsFlipped(false)
    setCurrentIndex((i) => Math.min(i + 1, filtered.length - 1))
  }, [currentCard, knownSet, updateProgress, filtered.length])

  const handleReset = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setDirection(0)
  }

  if (!filtered.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-2xl mb-2">📚</p>
        <p className="text-[#8888A0]">No flashcards found for this filter</p>
      </div>
    )
  }

  const isComplete = currentIndex >= filtered.length

  return (
    <DRMWrapper className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <Select value={difficultyFilter} onValueChange={(v) => { setDifficultyFilter(v); setCurrentIndex(0); setIsFlipped(false) }}>
          <SelectTrigger className="w-36 bg-[#16161F] border-white/10 text-[#E8E8F0]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#16161F] border-white/10">
            <SelectItem value="ALL">All levels</SelectItem>
            <SelectItem value="EASY">Easy</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HARD">Hard</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={handleReset} className="border-white/10 text-[#8888A0] hover:text-[#E8E8F0] bg-transparent">
          <RotateCcw className="h-4 w-4 mr-1" /> Restart
        </Button>
      </div>

      <FlashcardProgress
        known={knownSet.size}
        total={filtered.length}
        current={Math.min(currentIndex + 1, filtered.length)}
      />

      {isComplete ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-72 rounded-2xl border border-[#00B894]/30 bg-[#00B894]/5 text-center p-8"
        >
          <p className="text-5xl mb-4">🎉</p>
          <h3 className="text-2xl font-bold text-[#00B894] mb-2">Deck Complete!</h3>
          <p className="text-[#8888A0] mb-4">
            You know {knownSet.size} of {filtered.length} cards
          </p>
          <Button onClick={handleReset} className="bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white">
            Review Again
          </Button>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ x: direction * 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -direction * 200, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FlashcardCard
              card={currentCard}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
            />
          </motion.div>
        </AnimatePresence>
      )}

      {!isComplete && isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4"
        >
          <Button
            onClick={handleReview}
            variant="outline"
            className="flex-1 border-[#E17055]/30 text-[#E17055] hover:bg-[#E17055]/10 bg-transparent"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Review Again
          </Button>
          <Button
            onClick={handleKnow}
            className="flex-1 bg-[#00B894] hover:bg-[#00A884] text-white"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            I Know This
          </Button>
        </motion.div>
      )}
    </DRMWrapper>
  )
}
