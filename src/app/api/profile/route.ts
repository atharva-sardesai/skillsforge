import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const userId = session.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        topicProgress: {
          include: { topic: { select: { id: true, name: true, icon: true, color: true, parentId: true } } },
          orderBy: { masteryScore: 'desc' },
        },
        quizAttempts: {
          include: { quiz: { include: { topic: { select: { name: true, icon: true } } } } },
          orderBy: { completedAt: 'desc' },
          take: 10,
        },
        badges: { include: { badge: true }, orderBy: { earnedAt: 'desc' } },
        _count: { select: { quizAttempts: true, interviewSessions: true } },
      },
    })

    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

    const allBadges = await prisma.badge.findMany()
    const earnedBadgeIds = new Set(user.badges.map((ub) => ub.badgeId))
    const badgesWithStatus = allBadges.map((badge) => ({
      ...badge,
      earned: earnedBadgeIds.has(badge.id),
      earnedAt: user.badges.find((ub) => ub.badgeId === badge.id)?.earnedAt,
    }))

    const flashcardStats = await prisma.flashcardProgress.aggregate({
      where: { userId },
      _count: { _all: true },
    })
    const knownCount = await prisma.flashcardProgress.count({ where: { userId, known: true } })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user

    return NextResponse.json({
      success: true,
      data: {
        ...safeUser,
        badges: badgesWithStatus,
        flashcardStats: { reviewed: flashcardStats._count._all, known: knownCount },
      },
    })
  } catch (error) {
    console.error('GET /api/profile error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 })
  }
}
