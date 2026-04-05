'use client'

import { useQuery, useMutation } from '@tanstack/react-query'

export function useQuizzes(topicId: string) {
  return useQuery({
    queryKey: ['quizzes', topicId],
    queryFn: async () => {
      const res = await fetch(`/api/quiz/topic/${topicId}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data as QuizType[]
    },
    enabled: !!topicId,
  })
}

export function useSubmitQuiz() {
  return useMutation({
    mutationFn: async (payload: {
      quizId: string
      totalTime: number
      answers: Array<{ questionId: string; selectedIndex: number; timeTaken?: number }>
    }) => {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
  })
}

export interface QuizType {
  id: string
  topicId: string
  title: string
  description: string | null
  timeLimit: number | null
  passingScore: number
  status: string
  questions: QuizQuestionType[]
  _count: { attempts: number }
}

export interface QuizQuestionType {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string | null
  difficulty: string
  order: number
}
