'use client'

import { useState, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { Upload, FileText, Presentation, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface ResourceUploaderProps {
  topicId: string
  topicSlug: string
  title: string
  description?: string
  status: string
  onSuccess: () => void
}

export function ResourceUploader({ topicId, topicSlug: _, title, description, status, onSuccess }: ResourceUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
    if (!allowed.includes(f.type)) {
      toast.error('Only PDF and PPTX files are allowed')
      return
    }
    if (f.size > 50 * 1024 * 1024) {
      toast.error('File must be under 50MB')
      return
    }
    setFile(f)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [])

  const handleUpload = async () => {
    if (!file || !title) return
    setUploading(true)
    setProgress(10)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('topicId', topicId)
    formData.append('title', title)
    if (description) formData.append('description', description)
    formData.append('status', status)

    try {
      setProgress(40)
      const res = await fetch('/api/resources/upload', { method: 'POST', body: formData })
      setProgress(90)
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setProgress(100)
      toast.success('Resource uploaded successfully!')
      setFile(null)
      onSuccess()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 cursor-pointer transition-colors',
          isDragging ? 'border-[#6C5CE7] bg-[#6C5CE7]/10' : 'border-white/20 hover:border-white/40',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.pptx"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
        {file ? (
          <div className="flex items-center gap-3 text-center">
            {file.type.includes('pdf')
              ? <FileText className="h-8 w-8 text-[#E17055]" />
              : <Presentation className="h-8 w-8 text-[#FDCB6E]" />}
            <div className="text-left">
              <p className="font-medium text-[#E8E8F0]">{file.name}</p>
              <p className="text-sm text-[#8888A0]">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null) }}
              className="ml-4 rounded-full p-1 hover:bg-white/10"
            >
              <X className="h-4 w-4 text-[#8888A0]" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="h-10 w-10 text-[#8888A0] mb-3" />
            <p className="font-medium text-[#E8E8F0]">Drop a file here or click to browse</p>
            <p className="text-sm text-[#8888A0] mt-1">PDF or PPTX, max 50MB</p>
          </>
        )}
      </div>

      {progress > 0 && (
        <div className="space-y-1">
          <Progress value={progress} className="h-1.5 bg-white/10" />
          <p className="text-xs text-[#8888A0]">Uploading... {progress}%</p>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || uploading || !title}
        className="w-full bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload Resource'}
      </Button>
    </div>
  )
}
