import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateFile, saveUploadedFile, getResourceType } from '@/lib/upload'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    if (session.user.role === 'STUDENT') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const topicId = formData.get('topicId') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string | null
    const status = (formData.get('status') as string) || 'PUBLISHED'

    if (!file) return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    if (!topicId) return NextResponse.json({ success: false, error: 'Topic is required' }, { status: 400 })
    if (!title) return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 })

    const validation = validateFile(file)
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 })
    }

    const topic = await prisma.topic.findUnique({ where: { id: topicId }, select: { slug: true } })
    if (!topic) return NextResponse.json({ success: false, error: 'Topic not found' }, { status: 404 })

    const { filePath, fileName } = await saveUploadedFile(file, topic.slug)
    const resourceType = getResourceType(file.type)

    const resource = await prisma.resource.create({
      data: {
        topicId,
        title,
        description: description || null,
        type: resourceType,
        fileName,
        filePath,
        fileSize: file.size,
        uploadedBy: session.user.id,
        status: status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
      },
      include: { topic: { select: { id: true, name: true, slug: true } } },
    })

    return NextResponse.json({ success: true, data: resource }, { status: 201 })
  } catch (error) {
    console.error('POST /api/resources/upload error:', error)
    return NextResponse.json({ success: false, error: 'Failed to upload resource' }, { status: 500 })
  }
}
