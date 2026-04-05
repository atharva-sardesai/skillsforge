'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useFlashcards(topicId: string) {
  return useQuery({
    queryKey: ['flashcards', topicId],
    queryFn: async () => {
      const res = await fetch(`/api/flashcards/topic/${topicId}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data as { flashcards: FlashcardType[]; progressMap: Record<string, { known: boolean; reviewCount: number }> }
    },
    enabled: !!topicId,
  })
}

export function useUpdateFlashcardProgress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ flashcardId, known }: { flashcardId: string; known: boolean }) => {
      const res = await fetch('/api/flashcards/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flashcardId, known }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export interface FlashcardType {
  id: string
  topicId: string
  question: string
  answer: string
  hint: string | null
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  order: number
  status: string
}
