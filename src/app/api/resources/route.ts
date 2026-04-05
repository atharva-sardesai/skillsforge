import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { resourceSchema } from '@/lib/validators'
import { validateFile, saveUploadedFile, getResourceType } from '@/lib/upload'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const topicId = searchParams.get('topicId')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const isAdmin = session.user.role !== 'STUDENT'

    const resources = await prisma.resource.findMany({
      where: {
        ...(isAdmin ? {} : { status: 'PUBLISHED' }),
        ...(topicId ? { topicId } : {}),
        ...(type ? { type: type as 'PDF' | 'PPTX' } : {}),
        ...(search ? { title: { contains: search, mode: 'insensitive' } } : {}),
      },
      include: {
        topic: { select: { id: true, name: true, slug: true, icon: true, color: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: resources })
  } catch (error) {
    console.error('GET /api/resources error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch resources' }, { status: 500 })
  }
}
