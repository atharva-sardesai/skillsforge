'use client'

import { create } from 'zustand'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string | null
  difficulty: string
  order: number
}

interface QuizAnswer {
  questionId: string
  selectedIndex: number
  isCorrect: boolean
  timeTaken?: number
}

interface QuizState {
  quizId: string | null
  questions: QuizQuestion[]
  currentIndex: number
  answers: QuizAnswer[]
  startTime: number | null
  questionStartTime: number | null
  isRevealed: boolean
  isCompleted: boolean

  startQuiz: (quizId: string, questions: QuizQuestion[]) => void
  submitAnswer: (questionId: string, selectedIndex: number) => void
  nextQuestion: () => void
  completeQuiz: () => void
  resetQuiz: () => void
}

export const useQuizStore = create<QuizState>((set, get) => ({
  quizId: null,
  questions: [],
  currentIndex: 0,
  answers: [],
  startTime: null,
  questionStartTime: null,
  isRevealed: false,
  isCompleted: false,

  startQuiz: (quizId, questions) => {
    set({
      quizId,
      questions,
      currentIndex: 0,
      answers: [],
      startTime: Date.now(),
      questionStartTime: Date.now(),
      isRevealed: false,
      isCompleted: false,
    })
  },

  submitAnswer: (questionId, selectedIndex) => {
    const { questions, currentIndex, questionStartTime, answers } = get()
    const currentQ = questions[currentIndex]
    const isCorrect = currentQ.correctIndex === selectedIndex
    const timeTaken = questionStartTime ? Math.floor((Date.now() - questionStartTime) / 1000) : undefined

    set({
      answers: [
        ...answers,
        { questionId, selectedIndex, isCorrect, timeTaken },
      ],
      isRevealed: true,
    })
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get()
    if (currentIndex < questions.length - 1) {
      set({
        currentIndex: currentIndex + 1,
        isRevealed: false,
        questionStartTime: Date.now(),
      })
    } else {
      set({ isCompleted: true })
    }
  },

  completeQuiz: () => set({ isCompleted: true }),

  resetQuiz: () => set({
    quizId: null,
    questions: [],
    currentIndex: 0,
    answers: [],
    startTime: null,
    questionStartTime: null,
    isRevealed: false,
    isCompleted: false,
  }),
}))
