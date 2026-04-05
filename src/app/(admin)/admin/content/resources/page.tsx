'use client'

import { motion } from 'framer-motion'
import { useResources, useDeleteResource } from '@/hooks/useResources'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatFileSize, formatDate } from '@/lib/utils'
import { FileText, Presentation, Trash2, Plus } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function AdminResourcesPage() {
  const { data: resources, isLoading } = useResources()
  const deleteMutation = useDeleteResource()

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Resource deleted')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete')
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#E8E8F0]">Resources</h1>
          <p className="text-[#8888A0] mt-1">Manage uploaded PDFs and presentations</p>
        </div>
        <Button asChild className="bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white">
          <Link href="/admin/content/resources/upload"><Plus className="mr-1.5 h-4 w-4" />Upload Resource</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 bg-white/5 rounded-xl" />)}</div>
      ) : !resources?.length ? (
        <EmptyState emoji="📚" title="No resources uploaded" description="Upload your first PDF or PPTX resource." action={{ label: 'Upload Resource', onClick: () => {} }} />
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          {resources.map((r: {
            id: string; title: string; type: 'PDF' | 'PPTX'; fileSize: number;
            downloadCount: number; status: string; createdAt: string;
            topic: { name: string; icon: string }
          }) => (
            <div key={r.id} className="flex items-center gap-4 p-4 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${r.type === 'PDF' ? 'bg-[#E17055]/20' : 'bg-[#FDCB6E]/20'}`}>
                {r.type === 'PDF' ? <FileText className="h-4 w-4 text-[#E17055]" /> : <Presentation className="h-4 w-4 text-[#FDCB6E]" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#E8E8F0] truncate">{r.title}</p>
                <p className="text-xs text-[#8888A0]">{r.topic.icon} {r.topic.name} • {formatFileSize(r.fileSize)} • {r.downloadCount} downloads • {formatDate(r.createdAt)}</p>
              </div>
              <Badge className={r.type === 'PDF' ? 'bg-[#E17055]/20 text-[#E17055]' : 'bg-[#FDCB6E]/20 text-[#FDCB6E]'}>{r.type}</Badge>
              <Badge className={r.status === 'PUBLISHED' ? 'bg-[#00B894]/20 text-[#00B894]' : 'bg-white/10 text-[#8888A0]'}>{r.status}</Badge>
              <Button variant="ghost" size="sm" className="text-[#E17055] hover:bg-[#E17055]/10 flex-shrink-0" onClick={() => handleDelete(r.id, r.title)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
