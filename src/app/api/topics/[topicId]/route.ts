import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { topicSchema } from '@/lib/validators'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: Promise<{ topicId: string }> }) {
  try {
    const { topicId } = await params
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        children: { where: { status: { not: 'ARCHIVED' } }, orderBy: { order: 'asc' } },
        _count: { select: { flashcards: true, quizzes: true, resources: true } },
      },
    })

    if (!topic) return NextResponse.json({ success: false, error: 'Topic not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: topic })
  } catch (error) {
    console.error('GET /api/topics/[topicId] error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch topic' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ topicId: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    if (session.user.role === 'STUDENT') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

    const { topicId } = await params
    const body = await req.json()
    const parsed = topicSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { name, slug, description, icon, color, parentId, order, status } = parsed.data
    const finalSlug = slug || slugify(name)

    const existing = await prisma.topic.findFirst({
      where: { slug: finalSlug, NOT: { id: topicId } },
    })
    if (existing) {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 })
    }

    const topic = await prisma.topic.update({
      where: { id: topicId },
      data: { name, slug: finalSlug, description, icon, color, parentId, order, status },
    })

    return NextResponse.json({ success: true, data: topic })
  } catch (error) {
    console.error('PUT /api/topics/[topicId] error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update topic' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ topicId: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    if (session.user.role === 'STUDENT') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

    const { topicId } = await params
    await prisma.topic.update({
      where: { id: topicId },
      data: { status: 'ARCHIVED' },
    })

    return NextResponse.json({ success: true, data: { message: 'Topic archived' } })
  } catch (error) {
    console.error('DELETE /api/topics/[topicId] error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete topic' }, { status: 500 })
  }
}
