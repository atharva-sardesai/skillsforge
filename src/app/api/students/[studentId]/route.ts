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
        },
        quizAttempts: {
          include: { quiz: { include: { topic: { select: { name: true } } } } },
          orderBy: { completedAt: 'desc' },
          take: 20,
        },
        badges: { include: { badge: true }, orderBy: { earnedAt: 'desc' } },
        _count: { select: { quizAttempts: true, flashcardProgress: true, interviewSessions: true } },
      },
    })

    if (!student) return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 })
    if (student.role !== 'STUDENT') return NextResponse.json({ success: false, error: 'Not a student' }, { status: 400 })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeStudent } = student

    return NextResponse.json({ success: true, data: safeStudent })
  } catch (error) {
    console.error('GET /api/students/[studentId] error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch student' }, { status: 500 })
  }
}
