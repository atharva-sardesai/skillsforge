'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTopics } from '@/hooks/useTopics'
import { ResourceUploader } from '@/components/resources/ResourceUploader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function UploadResourcePage() {
  const { data: topics } = useTopics()
  const router = useRouter()
  const parentTopics = topics?.filter((t: { parentId: string | null }) => !t.parentId) ?? []
  const [topicId, setTopicId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('PUBLISHED')

  const selectedTopic = parentTopics.find((t: { id: string; slug: string }) => t.id === topicId)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm" className="border-white/10 text-[#8888A0] hover:text-[#E8E8F0] bg-transparent">
          <Link href="/admin/content/resources"><ChevronLeft className="h-4 w-4 mr-1" />Resources</Link>
        </Button>
        <h1 className="text-xl font-bold text-[#E8E8F0]">Upload Resource</h1>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#16161F] p-6 space-y-5">
        <div className="space-y-1.5">
          <Label className="text-[#E8E8F0]">Topic *</Label>
          <Select value={topicId} onValueChange={setTopicId}>
            <SelectTrigger className="bg-[#12121A] border-white/10 text-[#E8E8F0]"><SelectValue placeholder="Select topic..." /></SelectTrigger>
            <SelectContent className="bg-[#16161F] border-white/10">
              {parentTopics.map((t: { id: string; name: string; icon: string }) => <SelectItem key={t.id} value={t.id}>{t.icon} {t.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[#E8E8F0]">Title *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resource title..." className="bg-[#12121A] border-white/10 text-[#E8E8F0]" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[#E8E8F0]">Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Brief description..." className="bg-[#12121A] border-white/10 text-[#E8E8F0] resize-none" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[#E8E8F0]">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-[#12121A] border-white/10 text-[#E8E8F0]"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[#16161F] border-white/10">
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {topicId && title && selectedTopic && (
          <ResourceUploader
            topicId={topicId}
            topicSlug={selectedTopic.slug}
            title={title}
            description={description}
            status={status}
            onSuccess={() => router.push('/admin/content/resources')}
          />
        )}

        {(!topicId || !title) && (
          <p className="text-sm text-[#8888A0] text-center">Fill in the topic and title to enable upload</p>
        )}
      </div>
    </motion.div>
  )
}
