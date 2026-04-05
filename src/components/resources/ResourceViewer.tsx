'use client'

import { DRMWrapper } from '@/components/shared/DRMWrapper'
import { X } from 'lucide-react'

interface ResourceViewerProps {
  filePath: string
  title: string
  onClose: () => void
}

export function ResourceViewer({ filePath, title, onClose }: ResourceViewerProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0A0A0F]">
      <div className="flex h-14 items-center justify-between border-b border-white/10 px-4 flex-shrink-0">
        <h2 className="font-semibold text-[#E8E8F0] truncate">{title}</h2>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5 text-[#E8E8F0]" />
        </button>
      </div>
      <DRMWrapper className="flex-1 overflow-hidden">
        <iframe
          src={filePath}
          className="h-full w-full"
          title={title}
          style={{ border: 'none' }}
        />
      </DRMWrapper>
    </div>
  )
}
