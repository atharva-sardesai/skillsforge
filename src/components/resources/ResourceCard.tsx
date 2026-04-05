'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Presentation, Download, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatFileSize, formatDate } from '@/lib/utils'
import { ResourceViewer } from './ResourceViewer'

interface ResourceCardProps {
  resource: {
    id: string
    title: string
    description: string | null
    type: 'PDF' | 'PPTX'
    fileName: string
    filePath: string
    fileSize: number
    downloadCount: number
    createdAt: string
    topic: { name: string; icon: string; color: string }
  }
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const [viewerOpen, setViewerOpen] = useState(false)

  const handleDownload = async () => {
    await fetch(`/api/resources/${resource.id}`)
    window.open(resource.filePath, '_blank')
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -2, boxShadow: '0 0 20px rgba(108,92,231,0.15)' }}
        className="rounded-xl border border-white/10 bg-[#16161F] p-4 transition-all duration-200 flex flex-col gap-3"
      >
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${resource.type === 'PDF' ? 'bg-[#E17055]/20' : 'bg-[#FDCB6E]/20'}`}>
            {resource.type === 'PDF'
              ? <FileText className="h-5 w-5 text-[#E17055]" />
              : <Presentation className="h-5 w-5 text-[#FDCB6E]" />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#E8E8F0] truncate">{resource.title}</h3>
            {resource.description && (
              <p className="text-xs text-[#8888A0] mt-0.5 line-clamp-2">{resource.description}</p>
            )}
          </div>
          <Badge className={resource.type === 'PDF' ? 'bg-[#E17055]/20 text-[#E17055]' : 'bg-[#FDCB6E]/20 text-[#FDCB6E]'}>
            {resource.type}
          </Badge>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="text-xs" style={{ backgroundColor: `${resource.topic.color}20`, color: resource.topic.color }}>
            {resource.topic.icon} {resource.topic.name}
          </Badge>
          <span className="text-xs text-[#8888A0]">{formatFileSize(resource.fileSize)}</span>
          <span className="text-xs text-[#8888A0]">•</span>
          <span className="text-xs text-[#8888A0]">{resource.downloadCount} downloads</span>
          <span className="text-xs text-[#8888A0]">•</span>
          <span className="text-xs text-[#8888A0]">{formatDate(resource.createdAt)}</span>
        </div>

        <div className="flex gap-2">
          {resource.type === 'PDF' && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-white/10 text-[#E8E8F0] hover:bg-white/5 bg-transparent"
              onClick={() => setViewerOpen(true)}
            >
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              View
            </Button>
          )}
          <Button
            size="sm"
            className="flex-1 bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white"
            onClick={handleDownload}
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Download
          </Button>
        </div>
      </motion.div>

      {viewerOpen && (
        <ResourceViewer
          filePath={resource.filePath}
          title={resource.title}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  )
}
