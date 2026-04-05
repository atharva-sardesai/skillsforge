import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const importSchema = z.object({
  topicId: z.string().min(1),
  flashcards: z.array(
    z.object({
      question: z.string().min(1),
      answer: z.string().min(1),
      hint: z.string().optional(),
      difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
    })
  ).min(1).max(500),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    if (session.user.role === 'STUDENT') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const parsed = importSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { topicId, flashcards } = parsed.data

    const created = await prisma.flashcard.createMany({
      data: flashcards.map((fc, i) => ({
        topicId,
        question: fc.question,
        answer: fc.answer,
        hint: fc.hint,
        difficulty: fc.difficulty,
        order: i,
        status: 'PUBLISHED',
      })),
    })

    return NextResponse.json({ success: true, data: { count: created.count } }, { status: 201 })
  } catch (error) {
    console.error('POST /api/flashcards/import error:', error)
    return NextResponse.json({ success: false, error: 'Failed to import flashcards' }, { status: 500 })
  }
}
