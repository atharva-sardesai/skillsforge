import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteUploadedFile } from '@/lib/upload'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: Promise<{ resourceId: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { resourceId } = await params

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: { topic: { select: { id: true, name: true, slug: true } } },
    })

    if (!resource) return NextResponse.json({ success: false, error: 'Resource not found' }, { status: 404 })

    // Increment download count
    await prisma.resource.update({
      where: { id: resourceId },
      data: { downloadCount: { increment: 1 } },
    })

    return NextResponse.json({ success: true, data: resource })
  } catch (error) {
    console.error('GET /api/resources/[resourceId] error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch resource' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ resourceId: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    if (session.user.role === 'STUDENT') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

    const { resourceId } = await params
    const body = await req.json()

    const resource = await prisma.resource.update({
      where: { id: resourceId },
      data: {
        title: body.title,
        description: body.description,
        topicId: body.topicId,
        status: body.status,
      },
    })

    return NextResponse.json({ success: true, data: resource })
  } catch (error) {
    console.error('PUT /api/resources/[resourceId] error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update resource' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ resourceId: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    if (session.user.role === 'STUDENT') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

    const { resourceId } = await params

    const resource = await prisma.resource.findUnique({ where: { id: resourceId } })
    if (!resource) return NextResponse.json({ success: false, error: 'Resource not found' }, { status: 404 })

    await deleteUploadedFile(resource.filePath)
    await prisma.resource.delete({ where: { id: resourceId } })

    return NextResponse.json({ success: true, data: { message: 'Resource deleted' } })
  } catch (error) {
    console.error('DELETE /api/resources/[resourceId] error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete resource' }, { status: 500 })
  }
}
