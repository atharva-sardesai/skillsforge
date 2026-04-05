'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { StudentTable } from '@/components/admin/StudentTable'
import { SpiderChart } from '@/components/profile/SpiderChart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { PrinterIcon, ChevronLeft } from 'lucide-react'

export default function AdminReportsPage() {
  const [studentId, setStudentId] = useState<string | null>(null)

  const { data: report, isLoading } = useQuery({
    queryKey: ['student-report', studentId],
    queryFn: async () => {
      const res = await fetch(`/api/students/${studentId}/report`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    enabled: !!studentId,
  })

  if (studentId && (isLoading || report)) {
    if (isLoading) {
      return (
        <div className="space-y-6 max-w-4xl">
          <Skeleton className="h-8 w-32 bg-white/5" />
          <Skeleton className="h-40 rounded-2xl bg-white/5" />
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-80 rounded-2xl bg-white/5" />
            <Skeleton className="h-80 rounded-2xl bg-white/5" />
          </div>
        </div>
      )
    }

    const { student, strengths, weaknesses, focusAreas, summary } = report
    const parentTopics = student.topicProgress?.filter((tp: { topic: { parentId: string | null } }) => !tp.topic.parentId) ?? []
    const spiderData = parentTopics.map((tp: { topic: { name: string; icon: string }; masteryScore: number }) => ({
      topic: tp.topic.name,
      icon: tp.topic.icon,
      mastery: tp.masteryScore,
    }))

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" className="border-white/10 text-[#8888A0] hover:text-[#E8E8F0] bg-transparent" onClick={() => setStudentId(null)}>
            <ChevronLeft className="h-4 w-4 mr-1" />Back
          </Button>
          <Button className="bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white" onClick={() => window.print()}>
            <PrinterIcon className="mr-1.5 h-4 w-4" />Print Report
          </Button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#16161F] p-6 print:border-0 print:bg-white">
          <h1 className="text-xl font-bold text-[#E8E8F0] mb-1">Student Report</h1>
          <p className="text-[#8888A0] text-sm">Generated {formatDate(new Date())}</p>
          <Separator className="my-4 bg-white/10" />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-lg font-bold text-[#E8E8F0]">{student.name}</p>
              <p className="text-[#8888A0] text-sm">{student.email}</p>
              <p className="text-[#8888A0] text-sm">Level {student.level} • {student.xp?.toLocaleString()} XP</p>
              <p className="text-[#8888A0] text-sm">Last active: {student.lastActiveAt ? formatRelativeTime(student.lastActiveAt) : 'Never'}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Quizzes Taken', value: summary.quizzesTaken },
                { label: 'Avg Score', value: `${summary.avgQuizScore}%` },
                { label: 'Cards Known', value: summary.flashcardsKnown },
                { label: 'Badges', value: summary.badgesEarned },
              ].map((s) => (
                <div key={s.label} className="rounded-lg bg-white/5 p-3 text-center">
                  <p className="text-lg font-bold text-[#E8E8F0]">{s.value}</p>
                  <p className="text-xs text-[#8888A0]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {spiderData.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-[#16161F] p-6">
              <h2 className="text-base font-semibold text-[#E8E8F0] mb-4">Skill Mastery</h2>
              <SpiderChart data={spiderData} />
            </div>
          )}

          <div className="space-y-4">
            <div className="rounded-xl border border-[#00B894]/20 bg-[#00B894]/5 p-4">
              <h3 className="font-semibold text-[#00B894] mb-2">Strengths</h3>
              {strengths.map((s: { topic: { name: string; icon: string }; masteryScore: number }) => (
                <p key={s.topic.name} className="text-sm text-[#E8E8F0]">{s.topic.icon} {s.topic.name}: <span className="text-[#00B894]">{s.masteryScore}%</span></p>
              ))}
              {!strengths.length && <p className="text-sm text-[#8888A0]">No data yet</p>}
            </div>
            <div className="rounded-xl border border-[#E17055]/20 bg-[#E17055]/5 p-4">
              <h3 className="font-semibold text-[#E17055] mb-2">Areas to Improve</h3>
              {weaknesses.map((w: { topic: { name: string; icon: string }; masteryScore: number }) => (
                <p key={w.topic.name} className="text-sm text-[#E8E8F0]">{w.topic.icon} {w.topic.name}: <span className="text-[#E17055]">{w.masteryScore}%</span></p>
              ))}
              {!weaknesses.length && <p className="text-sm text-[#8888A0]">No data yet</p>}
            </div>
            {focusAreas.length > 0 && (
              <div className="rounded-xl border border-[#FDCB6E]/20 bg-[#FDCB6E]/5 p-4">
                <h3 className="font-semibold text-[#FDCB6E] mb-2">Recommended Focus Areas</h3>
                {focusAreas.map((f: { topic: { name: string; icon: string }; masteryScore: number }) => (
                  <p key={f.topic.name} className="text-sm text-[#E8E8F0]">{f.topic.icon} {f.topic.name}: {f.masteryScore}%</p>
                ))}
              </div>
            )}
          </div>
        </div>

        {student.quizAttempts?.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#16161F] p-6">
            <h2 className="text-base font-semibold text-[#E8E8F0] mb-4">Quiz History</h2>
            <div className="space-y-2">
              {student.quizAttempts.slice(0, 15).map((a: { id: string; score: number; completedAt: string | null; quiz: { title: string; passingScore: number; topic: { name: string } } }) => (
                <div key={a.id} className="flex items-center gap-3 text-sm">
                  <span className="text-[#8888A0] w-32 flex-shrink-0">{a.completedAt ? formatDate(a.completedAt) : ''}</span>
                  <span className="flex-1 text-[#E8E8F0] truncate">{a.quiz.title} ({a.quiz.topic.name})</span>
                  <Badge className={a.score >= a.quiz.passingScore ? 'bg-[#00B894]/20 text-[#00B894]' : 'bg-[#E17055]/20 text-[#E17055]'}>{a.score}%</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-[#E8E8F0]">Reports</h1>
        <p className="text-[#8888A0] mt-1">Select a student to generate their progress report</p>
      </div>
      <StudentTable />
    </motion.div>
  )
}
