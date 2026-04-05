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
import { Plus, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export default function AdminQuizzesPage() {
  const queryClient = useQueryClient()
  const { data: topics } = useTopics()
  const [selectedTopicId, setSelectedTopicId] = useState('')
  const [open, setOpen] = useState(false)
  const [questionOpen, setQuestionOpen] = useState(false)
  const [selectedQuizId, setSelectedQuizId] = useState('')
  const [form, setForm] = useState({ title: '', description: '', timeLimit: '', passingScore: '70', status: 'PUBLISHED' })
  const [qForm, setQForm] = useState({ question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '', difficulty: 'MEDIUM', order: 0 })

  const parentTopics = topics?.filter((t: { parentId: string | null }) => !t.parentId) ?? []

  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['admin-quizzes', selectedTopicId],
    queryFn: async () => {
      if (!selectedTopicId) return []
      const res = await fetch(`/api/quiz/topic/${selectedTopicId}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    enabled: !!selectedTopicId,
  })

  const createQuizMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/quiz', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, topicId: selectedTopicId, timeLimit: form.timeLimit ? parseInt(form.timeLimit) : null, passingScore: parseInt(form.passingScore) }) })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] }); toast.success('Quiz created!'); setOpen(false); setForm({ title: '', description: '', timeLimit: '', passingScore: '70', status: 'PUBLISHED' }) },
    onError: (e: Error) => toast.error(e.message),
  })

  const addQuestionMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/quiz/${selectedQuizId}/questions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(qForm) })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] }); toast.success('Question added!'); setQuestionOpen(false); setQForm({ question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '', difficulty: 'MEDIUM', order: 0 }) },
    onError: (e: Error) => toast.error(e.message),
  })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#E8E8F0]">Quizzes</h1>
          <p className="text-[#8888A0] mt-1">Create and manage quizzes</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled={!selectedTopicId} className="bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white"><Plus className="mr-1.5 h-4 w-4" />New Quiz</Button>
          </DialogTrigger>
          <DialogContent className="bg-[#16161F] border-white/10 text-[#E8E8F0]">
            <DialogHeader><DialogTitle>Create Quiz</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5"><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} className="bg-[#12121A] border-white/10 text-[#E8E8F0]" /></div>
              <div className="space-y-1.5"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="bg-[#12121A] border-white/10 text-[#E8E8F0] resize-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Time Limit (min, blank=none)</Label><Input type="number" value={form.timeLimit} onChange={(e) => setForm(f => ({ ...f, timeLimit: e.target.value }))} min={1} className="bg-[#12121A] border-white/10 text-[#E8E8F0]" /></div>
                <div className="space-y-1.5"><Label>Passing Score (%)</Label><Input type="number" value={form.passingScore} onChange={(e) => setForm(f => ({ ...f, passingScore: e.target.value }))} min={0} max={100} className="bg-[#12121A] border-white/10 text-[#E8E8F0]" /></div>
              </div>
              <Button onClick={() => createQuizMutation.mutate()} disabled={!form.title || createQuizMutation.isPending} className="w-full bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white">{createQuizMutation.isPending ? 'Creating...' : 'Create Quiz'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
        <SelectTrigger className="w-64 bg-[#16161F] border-white/10 text-[#E8E8F0]"><SelectValue placeholder="Select a topic..." /></SelectTrigger>
        <SelectContent className="bg-[#16161F] border-white/10">
          {parentTopics.map((t: { id: string; name: string; icon: string }) => <SelectItem key={t.id} value={t.id}>{t.icon} {t.name}</SelectItem>)}
        </SelectContent>
      </Select>

      {!selectedTopicId ? (
        <EmptyState emoji="🎯" title="Select a topic" description="Choose a topic to view and manage its quizzes." />
      ) : isLoading ? (
        <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 bg-white/5 rounded-xl" />)}</div>
      ) : !quizzes?.length ? (
        <EmptyState emoji="📝" title="No quizzes" description="Create your first quiz for this topic." action={{ label: 'Create Quiz', onClick: () => setOpen(true) }} />
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz: { id: string; title: string; description: string | null; questions: unknown[]; _count: { attempts: number }; passingScore: number; status: string }) => (
            <div key={quiz.id} className="rounded-xl border border-white/10 bg-[#16161F] p-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-[#E8E8F0]">{quiz.title}</h2>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#00B894]/20 text-[#00B894]">{quiz.questions.length} questions</Badge>
                  <Badge className="bg-white/10 text-[#8888A0]">{quiz._count.attempts} attempts</Badge>
                </div>
              </div>
              {quiz.description && <p className="text-sm text-[#8888A0] mb-3">{quiz.description}</p>}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10 text-[#E8E8F0] bg-transparent hover:bg-white/5"
                  onClick={() => { setSelectedQuizId(quiz.id); setQuestionOpen(true) }}
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />Add Question
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Question Dialog */}
      <Dialog open={questionOpen} onOpenChange={setQuestionOpen}>
        <DialogContent className="bg-[#16161F] border-white/10 text-[#E8E8F0] max-w-lg">
          <DialogHeader><DialogTitle>Add Question</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5"><Label>Question *</Label><Textarea value={qForm.question} onChange={(e) => setQForm(f => ({ ...f, question: e.target.value }))} rows={3} className="bg-[#12121A] border-white/10 text-[#E8E8F0] resize-none" /></div>
            {qForm.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="radio" checked={qForm.correctIndex === i} onChange={() => setQForm(f => ({ ...f, correctIndex: i }))} className="accent-[#00B894]" />
                <Input value={opt} onChange={(e) => { const opts = [...qForm.options]; opts[i] = e.target.value; setQForm(f => ({ ...f, options: opts })) }} placeholder={`Option ${String.fromCharCode(65 + i)}`} className="bg-[#12121A] border-white/10 text-[#E8E8F0]" />
              </div>
            ))}
            <div className="space-y-1.5"><Label>Explanation (optional)</Label><Textarea value={qForm.explanation} onChange={(e) => setQForm(f => ({ ...f, explanation: e.target.value }))} rows={2} className="bg-[#12121A] border-white/10 text-[#E8E8F0] resize-none" /></div>
            <div className="space-y-1.5"><Label>Difficulty</Label>
              <Select value={qForm.difficulty} onValueChange={(v) => setQForm(f => ({ ...f, difficulty: v }))}>
                <SelectTrigger className="bg-[#12121A] border-white/10 text-[#E8E8F0]"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#16161F] border-white/10">
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => addQuestionMutation.mutate()} disabled={!qForm.question || qForm.options.some(o => !o) || addQuestionMutation.isPending} className="w-full bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white">{addQuestionMutation.isPending ? 'Adding...' : 'Add Question'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
