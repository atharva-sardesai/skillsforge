import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { flashcardProgressSchema } from '@/lib/validators'
import { SM2_CONFIG } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const parsed = flashcardProgressSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { flashcardId, known } = parsed.data
    const userId = session.user.id

    const existing = await prisma.flashcardProgress.findUnique({
      where: { userId_flashcardId: { userId, flashcardId } },
    })

    const now = new Date()
    const reviewCount = (existing?.reviewCount ?? 0) + 1
    let intervalDays: number

    if (known) {
      // SM-2 simplified: known = next review in lastInterval * 2.5, starting at 1 day
      const lastInterval = existing
        ? Math.max(
            1,
            existing.nextReviewAt
              ? Math.floor((existing.nextReviewAt.getTime() - (existing.lastReviewedAt?.getTime() ?? now.getTime())) / 86400000)
              : SM2_CONFIG.STARTING_INTERVAL_DAYS
          )
        : SM2_CONFIG.STARTING_INTERVAL_DAYS
      intervalDays = Math.round(lastInterval * SM2_CONFIG.KNOWN_MULTIPLIER)
    } else {
      intervalDays = SM2_CONFIG.UNKNOWN_INTERVAL_DAYS
    }

    const nextReviewAt = new Date(now.getTime() + intervalDays * 86400000)

    const progress = await prisma.flashcardProgress.upsert({
      where: { userId_flashcardId: { userId, flashcardId } },
      create: { userId, flashcardId, known, reviewCount, lastReviewedAt: now, nextReviewAt },
      update: { known, reviewCount, lastReviewedAt: now, nextReviewAt },
    })

    // Update topic progress for flashcard mastery
    const flashcard = await prisma.flashcard.findUnique({ where: { id: flashcardId }, select: { topicId: true } })
    if (flashcard) {
      const totalFlashcards = await prisma.flashcard.count({
        where: { topicId: flashcard.topicId, status: 'PUBLISHED' },
      })
      const knownFlashcards = await prisma.flashcardProgress.count({
        where: { userId, flashcard: { topicId: flashcard.topicId }, known: true },
      })

      const topicProg = await prisma.topicProgress.findUnique({
        where: { userId_topicId: { userId, topicId: flashcard.topicId } },
      })

      const flashcardRatio = totalFlashcards > 0 ? knownFlashcards / totalFlashcards : 0
      const quizComponent = topicProg ? topicProg.avgQuizScore * 0.6 : 0
      const masteryScore = Math.round(quizComponent + flashcardRatio * 100 * 0.4)

      await prisma.topicProgress.upsert({
        where: { userId_topicId: { userId, topicId: flashcard.topicId } },
        create: {
          userId,
          topicId: flashcard.topicId,
          flashcardsKnown: knownFlashcards,
          flashcardsTotal: totalFlashcards,
          masteryScore,
          lastAccessedAt: now,
        },
        update: {
          flashcardsKnown: knownFlashcards,
          flashcardsTotal: totalFlashcards,
          masteryScore,
          lastAccessedAt: now,
        },
      })
    }

    // Update user's last active
    await prisma.user.update({ where: { id: userId }, data: { lastActiveAt: now } })

    return NextResponse.json({ success: true, data: progress })
  } catch (error) {
    console.error('PUT /api/flashcards/progress error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update progress' }, { status: 500 })
  }
}
