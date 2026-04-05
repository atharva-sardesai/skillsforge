import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: Promise<{ studentId: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    if (session.user.role === 'STUDENT') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

    const { studentId } = await params

    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        topicProgress: {
          include: { topic: { select: { id: true, name: true, icon: true, color: true, parentId: true } } },
          orderBy: { masteryScore: 'desc' },
        },
        quizAttempts: {
          include: {
            quiz: {
              include: { topic: { select: { name: true } } },
            },
          },
          orderBy: { completedAt: 'desc' },
          take: 50,
        },
        badges: { include: { badge: true } },
        _count: { select: { quizAttempts: true, flashcardProgress: true } },
      },
    })

    if (!student) return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 })

    const parentTopics = student.topicProgress.filter((tp) => !tp.topic.parentId)
    const strengths = parentTopics.slice(0, 3)
    const weaknesses = [...parentTopics].sort((a, b) => a.masteryScore - b.masteryScore).slice(0, 3)
    const focusAreas = parentTopics.filter((tp) => tp.masteryScore < 50)

    const totalTimeSpent = student.topicProgress.reduce((sum, tp) => sum + tp.timeSpent, 0)
    const avgQuizScore =
      student.quizAttempts.length > 0
        ? student.quizAttempts.reduce((sum, a) => sum + a.score, 0) / student.quizAttempts.length
        : 0

    const flashcardStats = await prisma.flashcardProgress.aggregate({
      where: { userId: studentId },
      _count: { _all: true },
      _sum: { reviewCount: true },
    })
    const knownCount = await prisma.flashcardProgress.count({
      where: { userId: studentId, known: true },
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeStudent } = student

    return NextResponse.json({
      success: true,
      data: {
        student: safeStudent,
        strengths,
        weaknesses,
        focusAreas,
        summary: {
          totalTimeSpent,
          avgQuizScore: Math.round(avgQuizScore),
          quizzesTaken: student._count.quizAttempts,
          flashcardsReviewed: flashcardStats._count._all,
          flashcardsKnown: knownCount,
          totalReviews: flashcardStats._sum.reviewCount ?? 0,
          badgesEarned: student.badges.length,
        },
      },
    })
  } catch (error) {
    console.error('GET /api/students/[studentId]/report error:', error)
    return NextResponse.json({ success: false, error: 'Failed to generate report' }, { status: 500 })
  }
}
