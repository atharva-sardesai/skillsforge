import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { quizQuestionSchema } from '@/lib/validators'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest, { params }: { params: Promise<{ quizId: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    if (session.user.role === 'STUDENT') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

    const { quizId } = await params
    const body = await req.json()
    const parsed = quizQuestionSchema.safeParse({ ...body, quizId })
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })
    }

    const question = await prisma.quizQuestion.create({ data: parsed.data })
    return NextResponse.json({ success: true, data: question }, { status: 201 })
  } catch (error) {
    console.error('POST /api/quiz/[quizId]/questions error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create question' }, { status: 500 })
  }
}
