import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import { sanitizeFilename } from './utils'
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from './constants'

export type AllowedMimeType = keyof typeof ALLOWED_FILE_TYPES

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds 50MB limit (got ${(file.size / (1024 * 1024)).toFixed(1)}MB)` }
  }

  if (!(file.type in ALLOWED_FILE_TYPES)) {
    return { valid: false, error: 'Only PDF and PPTX files are allowed' }
  }

  return { valid: true }
}

export async function saveUploadedFile(
  file: File,
  topicSlug: string
): Promise<{ filePath: string; fileName: string }> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'resources', topicSlug)
  await mkdir(uploadDir, { recursive: true })

  const timestamp = Date.now()
  const sanitized = sanitizeFilename(file.name)
  const fileName = `${timestamp}-${sanitized}`
  const filePath = path.join(uploadDir, fileName)

  const bytes = await file.arrayBuffer()
  await writeFile(filePath, Buffer.from(bytes))

  return {
    filePath: `/uploads/resources/${topicSlug}/${fileName}`,
    fileName,
  }
}

export async function deleteUploadedFile(filePath: string): Promise<void> {
  const absolutePath = path.join(process.cwd(), 'public', filePath)
  try {
    await unlink(absolutePath)
  } catch {
    // File may already be deleted or not found — ignore
  }
}

export function getResourceType(mimeType: string): 'PDF' | 'PPTX' {
  return ALLOWED_FILE_TYPES[mimeType as AllowedMimeType] as 'PDF' | 'PPTX'
}
