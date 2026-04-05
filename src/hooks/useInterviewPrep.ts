'use client'

import { useQuery, useMutation } from '@tanstack/react-query'

export function useInterviewHistory() {
  return useQuery({
    queryKey: ['interview-history'],
    queryFn: async () => {
      const res = await fetch('/api/interview-prep/history')
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
  })
}

export function useGenerateInterviewQuestions() {
  return useMutation({
    mutationFn: async (jobDescription: string) => {
      const res = await fetch('/api/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data as {
        sessionId: string
        detectedRole: string
        remaining: number
        questions: Array<{
          question: string
          category: string
          difficulty: string
          tip: string
        }>
      }
    },
  })
}
