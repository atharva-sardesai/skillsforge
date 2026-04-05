import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const topicSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  parentId: z.string().optional().nullable(),
  order: z.number().int().default(0),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
})

export const flashcardSchema = z.object({
  topicId: z.string().min(1, 'Topic is required'),
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  hint: z.string().optional().nullable(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
  order: z.number().int().default(0),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
})

export const flashcardProgressSchema = z.object({
  flashcardId: z.string().min(1),
  known: z.boolean(),
})

export const quizSchema = z.object({
  topicId: z.string().min(1, 'Topic is required'),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional().nullable(),
  timeLimit: z.number().int().positive().optional().nullable(),
  passingScore: z.number().int().min(0).max(100).default(70),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
})

export const quizQuestionSchema = z.object({
  quizId: z.string().min(1),
  question: z.string().min(1, 'Question is required'),
  options: z.array(z.string()).length(4, 'Exactly 4 options required'),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().optional().nullable(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
  order: z.number().int().default(0),
})

export const quizSubmitSchema = z.object({
  quizId: z.string().min(1),
  totalTime: z.number().int().min(0),
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      selectedIndex: z.number().int().min(0).max(3),
      timeTaken: z.number().int().min(0).optional(),
    })
  ),
})

export const interviewPrepSchema = z.object({
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters').max(10000),
})

export const resourceSchema = z.object({
  topicId: z.string().min(1, 'Topic is required'),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
})

export const studentFilterSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['name', 'email', 'level', 'xp', 'streakDays', 'lastActiveAt', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})
