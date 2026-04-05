export const ROLES = {
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN',
} as const

export const DIFFICULTY = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
} as const

export const CONTENT_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const

export const XP_REWARDS = {
  CORRECT_ANSWER: 10,
  QUIZ_COMPLETION: 50,
  PERFECT_SCORE: 100,
} as const

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export const ALLOWED_FILE_TYPES = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
} as const

export const INTERVIEW_RATE_LIMIT = {
  MAX_REQUESTS: 10,
  WINDOW_MS: 24 * 60 * 60 * 1000, // 24 hours
} as const

export const SM2_CONFIG = {
  KNOWN_MULTIPLIER: 2.5,
  UNKNOWN_INTERVAL_DAYS: 1,
  STARTING_INTERVAL_DAYS: 1,
} as const

export const THEME_COLORS = {
  background: '#0A0A0F',
  surface: '#12121A',
  elevated: '#16161F',
  accent: '#6C5CE7',
  success: '#00B894',
  warning: '#FDCB6E',
  danger: '#E17055',
  text: '#E8E8F0',
  muted: '#8888A0',
} as const
