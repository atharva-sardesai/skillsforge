'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useTopics } from '@/hooks/useTopics'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { Plus, Trash2, Upload } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export default function AdminFlashcardsPage() {
  const queryClient = useQueryClient()
  const { data: topics } = useTopics()
  const [selectedTopicId, setSelectedTopicId] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ question: '', answer: '', hint: '', difficulty: 'MEDIUM', order: 0 })

  const parentTopics = topics?.filter((t: { parentId: string | null }) => !t.parentId) ?? []

  const { data: flashcardData, isLoading } = useQuery({
    queryKey: ['admin-flashcards', selectedTopicId],
    queryFn: async () => {
      if (!selectedTopicId) return { flashcards: [], progressMap: {} }
      const res = await fetch(`/api/flashcards/topic/${selectedTopicId}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    enabled: !!selectedTopicId,
  })

  const createMutation = useMutation({
    mutationFn: async (data: typeof form & { topicId: string }) => {
      const res = await fetch('/api/flashcards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-flashcards', selectedTopicId] })
      queryClient.invalidateQueries({ queryKey: ['topics'] })
      toast.success('Flashcard created!')
      setOpen(false)
      setForm({ question: '', answer: '', hint: '', difficulty: 'MEDIUM', order: 0 })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/flashcards/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-flashcards', selectedTopicId] }); toast.success('Deleted') },
    onError: (e: Error) => toast.error(e.message),
  })

  const flashcards = flashcardData?.flashcards ?? []

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#E8E8F0]">Flashcards</h1>
          <p className="text-[#8888A0] mt-1">Create and manage flashcard decks</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled={!selectedTopicId} className="bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white">
              <Plus className="mr-1.5 h-4 w-4" />New Flashcard
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#16161F] border-white/10 text-[#E8E8F0]">
            <DialogHeader><DialogTitle>Create Flashcard</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Question *</Label>
                <Textarea value={form.question} onChange={(e) => setForm(f => ({ ...f, question: e.target.value }))} rows={3} className="bg-[#12121A] border-white/10 text-[#E8E8F0] resize-none" />
              </div>
              <div className="space-y-1.5">
                <Label>Answer *</Label>
                <Textarea value={form.answer} onChange={(e) => setForm(f => ({ ...f, answer: e.target.value }))} rows={3} className="bg-[#12121A] border-white/10 text-[#E8E8F0] resize-none" />
              </div>
              <div className="space-y-1.5">
                <Label>Hint (optional)</Label>
                <Input value={form.hint} onChange={(e) => setForm(f => ({ ...f, hint: e.target.value }))} className="bg-[#12121A] border-white/10 text-[#E8E8F0]" />
              </div>
              <div className="space-y-1.5">
                <Label>Difficulty</Label>
                <Select value={form.difficulty} onValueChange={(v) => setForm(f => ({ ...f, difficulty: v }))}>
                  <SelectTrigger className="bg-[#12121A] border-white/10 text-[#E8E8F0]"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#16161F] border-white/10">
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => createMutation.mutate({ ...form, topicId: selectedTopicId })}
                disabled={!form.question || !form.answer || createMutation.isPending}
                className="w-full bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Flashcard'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
        <SelectTrigger className="w-64 bg-[#16161F] border-white/10 text-[#E8E8F0]">
          <SelectValue placeholder="Select a topic..." />
        </SelectTrigger>
        <SelectContent className="bg-[#16161F] border-white/10">
          {parentTopics.map((t: { id: string; name: string; icon: string }) => (
            <SelectItem key={t.id} value={t.id}>{t.icon} {t.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!selectedTopicId ? (
        <EmptyState emoji="📚" title="Select a topic" description="Choose a topic above to view and manage its flashcards." />
      ) : isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 bg-white/5 rounded-xl" />)}</div>
      ) : !flashcards.length ? (
        <EmptyState emoji="📝" title="No flashcards" description="Create your first flashcard for this topic." action={{ label: 'Create Flashcard', onClick: () => setOpen(true) }} />
      ) : (
        <div className="space-y-3">
          {flashcards.map((fc: { id: string; question: string; answer: string; difficulty: string; status: string }) => (
            <div key={fc.id} className="rounded-xl border border-white/10 bg-[#16161F] p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#E8E8F0] mb-1 line-clamp-2">{fc.question}</p>
                <p className="text-xs text-[#8888A0] line-clamp-1">{fc.answer}</p>
                <div className="flex gap-2 mt-2">
                  <Badge className={fc.difficulty === 'EASY' ? 'bg-[#00B894]/20 text-[#00B894]' : fc.difficulty === 'HARD' ? 'bg-[#E17055]/20 text-[#E17055]' : 'bg-[#FDCB6E]/20 text-[#FDCB6E]'}>{fc.difficulty}</Badge>
                  <Badge className="bg-white/10 text-[#8888A0]">{fc.status}</Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-[#E17055] hover:bg-[#E17055]/10" onClick={() => deleteMutation.mutate(fc.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
