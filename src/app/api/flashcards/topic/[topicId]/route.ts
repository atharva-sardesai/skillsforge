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

    const flashcards = await prisma.flashcard.findMany({
      where: {
        topicId,
        ...(isAdmin ? {} : { status: 'PUBLISHED' }),
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    })

    let progressMap: Record<string, { known: boolean; reviewCount: number; nextReviewAt: Date | null }> = {}
    if (!isAdmin) {
      const progress = await prisma.flashcardProgress.findMany({
        where: { userId: session.user.id, flashcard: { topicId } },
      })
      progressMap = Object.fromEntries(
        progress.map((p) => [p.flashcardId, { known: p.known, reviewCount: p.reviewCount, nextReviewAt: p.nextReviewAt }])
      )
    }

    return NextResponse.json({ success: true, data: { flashcards, progressMap } })
  } catch (error) {
    console.error('GET /api/flashcards/topic/[topicId] error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch flashcards' }, { status: 500 })
  }
}
