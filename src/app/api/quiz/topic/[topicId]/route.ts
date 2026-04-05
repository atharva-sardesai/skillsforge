import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: Promise<{ topicId: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { topicId } = await params
    const isAdmin = session.user.role !== 'STUDENT'

    const quizzes = await prisma.quiz.findMany({
      where: {
        topicId,
        ...(isAdmin ? {} : { status: 'PUBLISHED' }),
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            question: true,
            options: true,
            correctIndex: true,
            explanation: true,
            difficulty: true,
            order: true,
          },
        },
        _count: { select: { attempts: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: quizzes })
  } catch (error) {
    console.error('GET /api/quiz/topic/[topicId] error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch quizzes' }, { status: 500 })
  }
}
