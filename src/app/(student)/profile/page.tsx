'use client'

import { motion } from 'framer-motion'
import { useProfile } from '@/hooks/useProfile'
import { SpiderChart } from '@/components/profile/SpiderChart'
import { StreakCalendar } from '@/components/profile/StreakCalendar'
import { BadgeGrid } from '@/components/profile/BadgeGrid'
import { ProgressCards } from '@/components/profile/ProgressCards'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getInitials, getLevelProgress, xpForNextLevel, formatRelativeTime } from '@/lib/utils'
import { Flame, Zap, Trophy, BookOpen } from 'lucide-react'

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile()

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-32 rounded-2xl bg-white/5" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-2xl bg-white/5" />
          <Skeleton className="h-80 rounded-2xl bg-white/5" />
        </div>
      </div>
    )
  }

  if (!profile) return null

  const parentTopics = profile.topicProgress?.filter((tp: { topic: { parentId: string | null } }) => !tp.topic.parentId) ?? []
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
      {/* Profile Header */}
      <div className="rounded-2xl border border-white/10 bg-[#16161F] p-6">
        <div className="flex items-start gap-5">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-[#6C5CE7] text-white text-xl font-bold">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#E8E8F0]">{profile.name}</h1>
            <p className="text-[#8888A0]">{profile.email}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-[#6C5CE7]" />
                <span className="text-sm font-bold text-[#E8E8F0]">Level {profile.level}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-[#E17055]" />
                <span className="text-sm text-[#E8E8F0]">{profile.streakDays} day streak</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-[#FDCB6E]" />
                <span className="text-sm text-[#E8E8F0]">{profile.xp.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-xs text-[#8888A0]">
            <span>Level {profile.level}</span>
            <span>{profile.xp} / {xpForNextLevel(profile.level)} XP</span>
            <span>Level {profile.level + 1}</span>
          </div>
          <Progress value={getLevelProgress(profile.xp, profile.level)} className="h-2 bg-white/10" />
          <p className="text-xs text-center text-[#8888A0]">
            {xpForNextLevel(profile.level) - profile.xp} XP to next level
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Spider Chart */}
        {spiderData.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#16161F] p-6">
            <h2 className="text-base font-semibold text-[#E8E8F0] mb-4">Skill Mastery</h2>
            <SpiderChart data={spiderData} />
          </div>
        )}

        {/* Badges */}
        <div className="rounded-2xl border border-white/10 bg-[#16161F] p-6">
          <h2 className="text-base font-semibold text-[#E8E8F0] mb-4">Badges</h2>
          <BadgeGrid badges={profile.badges ?? []} />
        </div>
      </div>

      {/* Streak Calendar */}
      <div className="rounded-2xl border border-white/10 bg-[#16161F] p-6">
        <h2 className="text-base font-semibold text-[#E8E8F0] mb-4">Activity (Last 12 Weeks)</h2>
        <StreakCalendar activeDays={
          profile.quizAttempts?.map((a: { completedAt: string | null }) => a.completedAt ?? '').filter(Boolean) ?? []
        } />
      </div>

      {/* Topic Progress */}
      <div className="rounded-2xl border border-white/10 bg-[#16161F] p-6">
        <h2 className="text-base font-semibold text-[#E8E8F0] mb-4">Topic Progress</h2>
        <ProgressCards topicProgress={parentTopics} />
      </div>

      {/* Recent Quizzes */}
      {profile.quizAttempts?.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#16161F] p-6">
          <h2 className="text-base font-semibold text-[#E8E8F0] mb-4">Recent Quiz Attempts</h2>
          <div className="space-y-2">
            {profile.quizAttempts.slice(0, 8).map((attempt: {
              id: string; score: number; completedAt: string | null;
              quiz: { title: string; passingScore: number; topic: { name: string; icon: string } }
            }) => (
              <div key={attempt.id} className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-white/5 transition-colors">
                <span className="text-lg">{attempt.quiz.topic.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#E8E8F0] truncate">{attempt.quiz.title}</p>
                  <p className="text-xs text-[#8888A0]">
                    {attempt.quiz.topic.name} • {attempt.completedAt ? formatRelativeTime(attempt.completedAt) : ''}
                  </p>
                </div>
                <Badge className={attempt.score >= attempt.quiz.passingScore
                  ? 'bg-[#00B894]/20 text-[#00B894]'
                  : 'bg-[#E17055]/20 text-[#E17055]'}>
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
