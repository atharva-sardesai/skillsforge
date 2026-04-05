import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { flashcardSchema } from '@/lib/validators'

export const dynamic = 'force-dynamic'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    if (session.user.role === 'STUDENT') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

    const { id } = await params
    const body = await req.json()
    const parsed = flashcardSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })
    }

    const flashcard = await prisma.flashcard.update({ where: { id }, data: parsed.data })
    return NextResponse.json({ success: true, data: flashcard })
  } catch (error) {
    console.error('PUT /api/flashcards/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update flashcard' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    if (session.user.role === 'STUDENT') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

    const { id } = await params
    await prisma.flashcard.delete({ where: { id } })
    return NextResponse.json({ success: true, data: { message: 'Flashcard deleted' } })
  } catch (error) {
    console.error('DELETE /api/flashcards/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete flashcard' }, { status: 500 })
  }
}
