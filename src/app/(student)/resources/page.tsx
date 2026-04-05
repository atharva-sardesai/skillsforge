'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useResources } from '@/hooks/useResources'
import { useTopics } from '@/hooks/useTopics'
import { ResourceCard } from '@/components/resources/ResourceCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EmptyState } from '@/components/shared/EmptyState'
import { Search } from 'lucide-react'

export default function ResourcesPage() {
  const [search, setSearch] = useState('')
  const [topicId, setTopicId] = useState('')
  const [type, setType] = useState('')

  const { data: resources, isLoading } = useResources({ search, topicId: topicId || undefined, type: type || undefined })
  const { data: topics } = useTopics()

  const parentTopics = topics?.filter((t: { parentId: string | null }) => !t.parentId) ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-5xl"
    >
      <div>
        <h1 className="text-2xl font-bold text-[#E8E8F0]">Resource Library</h1>
        <p className="text-[#8888A0] mt-1">Browse PDFs and presentations uploaded by instructors</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8888A0]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="pl-9 bg-[#16161F] border-white/10 text-[#E8E8F0] placeholder:text-[#8888A0]"
          />
        </div>
        <Select value={topicId} onValueChange={setTopicId}>
          <SelectTrigger className="w-44 bg-[#16161F] border-white/10 text-[#E8E8F0]">
            <SelectValue placeholder="All Topics" />
          </SelectTrigger>
          <SelectContent className="bg-[#16161F] border-white/10">
            <SelectItem value="">All Topics</SelectItem>
            {parentTopics.map((t: { id: string; name: string; icon: string }) => (
              <SelectItem key={t.id} value={t.id}>{t.icon} {t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-36 bg-[#16161F] border-white/10 text-[#E8E8F0]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="bg-[#16161F] border-white/10">
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="PDF">PDF</SelectItem>
            <SelectItem value="PPTX">PPTX</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl bg-white/5" />)}
        </div>
      ) : !resources?.length ? (
        <EmptyState emoji="📄" title="No resources found" description="Try adjusting your filters or check back later." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource: Parameters<typeof ResourceCard>[0]['resource'], i: number) => (
            <motion.div key={resource.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <ResourceCard resource={resource} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
