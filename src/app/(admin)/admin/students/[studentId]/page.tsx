'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { SpiderChart } from '@/components/profile/SpiderChart'
import { BadgeGrid } from '@/components/profile/BadgeGrid'
import { ProgressCards } from '@/components/profile/ProgressCards'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { ChevronLeft, Flame, Trophy, Zap, FileText } from 'lucide-react'
import { getInitials, getLevelProgress, xpForNextLevel, formatRelativeTime, formatDate } from '@/lib/utils'

interface Props {
  params: Promise<{ studentId: string }>
}

export default function StudentDetailPage({ params }: Props) {
  const { studentId } = use(params)

  const { data: student, isLoading } = useQuery({
    queryKey: ['admin-student', studentId],
    queryFn: async () => {
      const res = await fetch(`/api/students/${studentId}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
  })

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

  if (!student) return <p className="text-[#8888A0]">Student not found</p>

  const parentTopics = student.topicProgress?.filter((tp: { topic: { parentId: string | null } }) => !tp.topic.parentId) ?? []
  const spiderData = parentTopics.map((tp: { topic: { name: string; icon: string }; masteryScore: number }) => ({
    topic: tp.topic.name,
    icon: tp.topic.icon,
    mastery: tp.masteryScore,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl"
    >
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm" className="border-white/10 text-[#8888A0] hover:text-[#E8E8F0] bg-transparent">
          <Link href="/admin/students"><ChevronLeft className="h-4 w-4 mr-1" />Students</Link>
        </Button>
        <Button asChild size="sm" className="bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white ml-auto">
          <Link href={`/admin/reports?studentId=${studentId}`}>
            <FileText className="mr-1.5 h-4 w-4" />Generate Report
          </Link>
        </Button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#16161F] p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-[#6C5CE7] text-white text-lg font-bold">
              {getInitials(student.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#E8E8F0]">{student.name}</h1>
            <p className="text-[#8888A0] text-sm">{student.email}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-sm"><Zap className="h-4 w-4 text-[#6C5CE7]" />Level {student.level}</span>
              <span className="flex items-center gap-1 text-sm"><Trophy className="h-4 w-4 text-[#FDCB6E]" />{student.xp?.toLocaleString()} XP</span>
              <span className="flex items-center gap-1 text-sm"><Flame className="h-4 w-4 text-[#E17055]" />{student.streakDays}d streak</span>
            </div>
            <Progress value={getLevelProgress(student.xp, student.level)} className="h-1.5 bg-white/10 mt-2 max-w-48" />
          </div>
          <div className="text-right text-xs text-[#8888A0]">
            <p>Joined {formatDate(student.createdAt)}</p>
            <p>Last active: {student.lastActiveAt ? formatRelativeTime(student.lastActiveAt) : 'Never'}</p>
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

        <div className="rounded-2xl border border-white/10 bg-[#16161F] p-6">
          <h2 className="text-base font-semibold text-[#E8E8F0] mb-4">Badges ({student.badges?.length ?? 0})</h2>
          <BadgeGrid badges={student.badges?.map((ub: { badge: { id: string; name: string; description: string; icon: string }; earnedAt: string }) => ({ ...ub.badge, earned: true, earnedAt: new Date(ub.earnedAt) })) ?? []} />
        </div>
      </div>

      {parentTopics.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#16161F] p-6">
          <h2 className="text-base font-semibold text-[#E8E8F0] mb-4">Topic Progress</h2>
          <ProgressCards topicProgress={parentTopics} />
        </div>
      )}

      {student.quizAttempts?.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#16161F] p-6">
          <h2 className="text-base font-semibold text-[#E8E8F0] mb-4">Recent Quiz Attempts</h2>
          <div className="space-y-2">
            {student.quizAttempts.slice(0, 10).map((attempt: {
              id: string; score: number; completedAt: string | null;
              quiz: { title: string; passingScore: number; topic: { name: string; icon: string } }
            }) => (
              <div key={attempt.id} className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-white/5">
                <span className="text-lg">{attempt.quiz.topic.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#E8E8F0]">{attempt.quiz.title}</p>
                  <p className="text-xs text-[#8888A0]">{attempt.quiz.topic.name} • {attempt.completedAt ? formatRelativeTime(attempt.completedAt) : ''}</p>
                </div>
                <Badge className={attempt.score >= attempt.quiz.passingScore ? 'bg-[#00B894]/20 text-[#00B894]' : 'bg-[#E17055]/20 text-[#E17055]'}>
                  {attempt.score}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
