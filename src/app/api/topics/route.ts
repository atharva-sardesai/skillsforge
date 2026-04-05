import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { topicSchema } from '@/lib/validators'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const topics = await prisma.topic.findMany({
      where: { status: { not: 'ARCHIVED' } },
      include: {
        _count: {
          select: {
            flashcards: true,
            quizzes: true,
            resources: true,
            children: true,
          },
        },
      },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    })

    return NextResponse.json({ success: true, data: topics })
  } catch (error) {
    console.error('GET /api/topics error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch topics' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    if (session.user.role === 'STUDENT') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const parsed = topicSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { name, slug, description, icon, color, parentId, order, status } = parsed.data
    const finalSlug = slug || slugify(name)

    const existing = await prisma.topic.findUnique({ where: { slug: finalSlug } })
    if (existing) {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 })
    }

    const topic = await prisma.topic.create({
      data: { name, slug: finalSlug, description, icon, color, parentId, order, status },
    })

    return NextResponse.json({ success: true, data: topic }, { status: 201 })
  } catch (error) {
    console.error('POST /api/topics error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create topic' }, { status: 500 })
  }
}
