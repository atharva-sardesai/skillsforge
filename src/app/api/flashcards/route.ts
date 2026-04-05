import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { flashcardSchema } from '@/lib/validators'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    if (session.user.role === 'STUDENT') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const parsed = flashcardSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })
    }

    const flashcard = await prisma.flashcard.create({ data: parsed.data })
    return NextResponse.json({ success: true, data: flashcard }, { status: 201 })
  } catch (error) {
    console.error('POST /api/flashcards error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create flashcard' }, { status: 500 })
  }
}
