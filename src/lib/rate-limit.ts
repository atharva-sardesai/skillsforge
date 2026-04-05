import { INTERVIEW_RATE_LIMIT } from './constants'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

export function checkRateLimit(userId: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)

  if (!entry || entry.resetAt <= now) {
    const resetAt = now + INTERVIEW_RATE_LIMIT.WINDOW_MS
    rateLimitMap.set(userId, { count: 1, resetAt })
    return {
      allowed: true,
      remaining: INTERVIEW_RATE_LIMIT.MAX_REQUESTS - 1,
      resetAt,
    }
  }

  if (entry.count >= INTERVIEW_RATE_LIMIT.MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    }
  }

  entry.count += 1
  return {
    allowed: true,
    remaining: INTERVIEW_RATE_LIMIT.MAX_REQUESTS - entry.count,
    resetAt: entry.resetAt,
  }
}
