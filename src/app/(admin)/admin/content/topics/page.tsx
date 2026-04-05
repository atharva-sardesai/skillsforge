'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useTopics } from '@/hooks/useTopics'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared/EmptyState'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Plus, BookOpen, HelpCircle, Library } from 'lucide-react'
import Link from 'next/link'

export default function AdminTopicsPage() {
  const { data: topics, isLoading } = useTopics()
  const queryClient = useQueryClient()

  const parentTopics = topics?.filter((t: { parentId: string | null }) => !t.parentId) ?? []

  const handleStatusChange = async (topicId: string, status: string) => {
    try {
      const res = await fetch(`/api/topics/${topicId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      queryClient.invalidateQueries({ queryKey: ['topics'] })
      toast.success('Topic status updated')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to update')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-5xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#E8E8F0]">Topics</h1>
          <p className="text-[#8888A0] mt-1">Manage learning topics and subtopics</p>
        </div>
        <Button asChild className="bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white">
          <Link href="/admin/content/topics/new"><Plus className="mr-1.5 h-4 w-4" />New Topic</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl bg-white/5" />)}
        </div>
      ) : !parentTopics.length ? (
        <EmptyState emoji="📚" title="No topics yet" description="Create your first topic to get started." action={{ label: 'Create Topic', onClick: () => {} }} />
      ) : (
        <div className="space-y-3">
          {parentTopics.map((topic: {
            id: string; name: string; icon: string; description: string; status: string; color: string;
            _count: { flashcards: number; quizzes: number; resources: number; children: number }
          }) => (
            <div key={topic.id} className="rounded-xl border border-white/10 bg-[#16161F] p-4 flex items-center gap-4">
              <span className="text-2xl">{topic.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-[#E8E8F0]">{topic.name}</h2>
                  <Badge className={
                    topic.status === 'PUBLISHED' ? 'bg-[#00B894]/20 text-[#00B894]' :
                    topic.status === 'DRAFT' ? 'bg-[#FDCB6E]/20 text-[#FDCB6E]' :
                    'bg-white/10 text-[#8888A0]'
                  }>{topic.status}</Badge>
                </div>
                <p className="text-sm text-[#8888A0] truncate">{topic.description}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-[#8888A0]">
                  <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{topic._count.flashcards} flashcards</span>
                  <span className="flex items-center gap-1"><HelpCircle className="h-3 w-3" />{topic._count.quizzes} quizzes</span>
                  <span className="flex items-center gap-1"><Library className="h-3 w-3" />{topic._count.resources} resources</span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button asChild variant="outline" size="sm" className="border-white/10 text-[#E8E8F0] bg-transparent hover:bg-white/5">
                  <Link href={`/admin/content/topics/${topic.id}/edit`}>Edit</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
