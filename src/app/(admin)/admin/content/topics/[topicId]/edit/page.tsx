'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useTopic, useTopics } from '@/hooks/useTopics'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { slugify } from '@/lib/utils'

interface Props { params: Promise<{ topicId: string }> }

export default function EditTopicPage({ params }: Props) {
  const { topicId } = use(params)
  const router = useRouter()
  const { data: topic, isLoading } = useTopic(topicId)
  const { data: allTopics } = useTopics()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', icon: '', color: '', parentId: '', status: 'PUBLISHED', order: 0 })

  useEffect(() => {
    if (topic) {
      setForm({
        name: topic.name,
        description: topic.description,
        icon: topic.icon,
        color: topic.color,
        parentId: topic.parentId ?? '',
        status: topic.status,
        order: topic.order,
      })
    }
  }, [topic])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/topics/${topicId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, slug: slugify(form.name), parentId: form.parentId || null }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success('Topic updated!')
      router.push('/admin/content/topics')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const parentTopics = allTopics?.filter((t: { parentId: string | null; id: string }) => !t.parentId && t.id !== topicId) ?? []

  if (isLoading) return <Skeleton className="h-96 rounded-2xl bg-white/5" />

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm" className="border-white/10 text-[#8888A0] hover:text-[#E8E8F0] bg-transparent">
          <Link href="/admin/content/topics"><ChevronLeft className="h-4 w-4 mr-1" />Topics</Link>
        </Button>
        <h1 className="text-xl font-bold text-[#E8E8F0]">Edit Topic</h1>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-[#16161F] p-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-[#E8E8F0]">Topic Name *</Label>
            <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required className="bg-[#12121A] border-white/10 text-[#E8E8F0]" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[#E8E8F0]">Icon (emoji)</Label>
            <Input value={form.icon} onChange={(e) => setForm(f => ({ ...f, icon: e.target.value }))} maxLength={4} className="bg-[#12121A] border-white/10 text-[#E8E8F0]" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[#E8E8F0]">Description *</Label>
          <Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3} required className="bg-[#12121A] border-white/10 text-[#E8E8F0] resize-none" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-[#E8E8F0]">Color</Label>
            <div className="flex gap-2">
              <Input type="color" value={form.color} onChange={(e) => setForm(f => ({ ...f, color: e.target.value }))} className="h-9 w-12 p-0.5 bg-[#12121A] border-white/10 cursor-pointer" />
              <Input value={form.color} onChange={(e) => setForm(f => ({ ...f, color: e.target.value }))} className="bg-[#12121A] border-white/10 text-[#E8E8F0] font-mono" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[#E8E8F0]">Parent Topic</Label>
            <Select value={form.parentId} onValueChange={(v) => setForm(f => ({ ...f, parentId: v }))}>
              <SelectTrigger className="bg-[#12121A] border-white/10 text-[#E8E8F0]"><SelectValue placeholder="None (root)" /></SelectTrigger>
              <SelectContent className="bg-[#16161F] border-white/10">
                <SelectItem value="">None (root)</SelectItem>
                {parentTopics.map((t: { id: string; name: string; icon: string }) => <SelectItem key={t.id} value={t.id}>{t.icon} {t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[#E8E8F0]">Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm(f => ({ ...f, status: v }))}>
              <SelectTrigger className="bg-[#12121A] border-white/10 text-[#E8E8F0]"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#16161F] border-white/10">
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => router.back()} className="border-white/10 text-[#E8E8F0] bg-transparent hover:bg-white/5">Cancel</Button>
          <Button type="submit" disabled={saving} className="bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white">{saving ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </form>
    </motion.div>
  )
}
