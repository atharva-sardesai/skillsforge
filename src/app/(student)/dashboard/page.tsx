'use client'

import { motion } from 'framer-motion'
import { useProfile } from '@/hooks/useProfile'
import { useTopics } from '@/hooks/useTopics'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getLevelProgress, xpForNextLevel, formatRelativeTime } from '@/lib/utils'
import { BookOpen, Zap, Flame, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: topics, isLoading: topicsLoading } = useTopics()

  const parentTopics = topics?.filter((t: { parentId: string | null }) => !t.parentId) ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-6xl"
    >
      <div>
        <h1 className="text-2xl font-bold text-[#E8E8F0]">
          {profileLoading ? 'Welcome back!' : `Welcome back, ${profile?.name?.split(' ')[0]}! 👋`}
        </h1>
        <p className="text-[#8888A0] mt-1">Here's your learning overview</p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Level', value: profile?.level, icon: Zap, color: '#6C5CE7', suffix: '' },
          { label: 'Total XP', value: profile?.xp?.toLocaleString(), icon: Trophy, color: '#FDCB6E', suffix: '' },
          { label: 'Day Streak', value: profile?.streakDays, icon: Flame, color: '#E17055', suffix: 'd' },
          { label: 'Topics Active', value: profile?.topicProgress?.length, icon: BookOpen, color: '#00B894', suffix: '' },
        ].map((stat) => (
          <Card key={stat.label} className="bg-[#16161F] border-white/10">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-medium text-[#8888A0]">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
            </CardHeader>
            <CardContent>
              {profileLoading
                ? <Skeleton className="h-8 w-16 bg-white/10" />
                : <p className="text-2xl font-bold text-[#E8E8F0]">{stat.value ?? 0}{stat.suffix}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* XP Progress */}
      {profile && (
        <Card className="bg-[#16161F] border-white/10">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#E8E8F0]">Level {profile.level} Progress</span>
              <span className="text-sm text-[#8888A0]">{profile.xp} / {xpForNextLevel(profile.level)} XP</span>
            </div>
            <Progress value={getLevelProgress(profile.xp, profile.level)} className="h-2 bg-white/10" />
            <p className="text-xs text-[#8888A0] mt-1.5">
              {xpForNextLevel(profile.level) - profile.xp} XP to Level {profile.level + 1}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Continue Learning */}
        <Card className="bg-[#16161F] border-white/10">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#E8E8F0]">Continue Learning</CardTitle>
          </CardHeader>
          <CardContent>
            {topicsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full bg-white/10" />
                ))}
              </div>
            ) : parentTopics.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-[#8888A0] mb-3">No topics available yet</p>
                <Button asChild size="sm" className="bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white">
                  <Link href="/topics">Browse Topics</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {parentTopics.slice(0, 4).map((topic: { id: string; name: string; icon: string; color: string; _count: { flashcards: number; quizzes: number } }) => {
                  const progress = profile?.topicProgress?.find((tp: { topicId: string }) => tp.topicId === topic.id)
                  return (
                    <Link
                      key={topic.id}
                      href={`/topics/${topic.id}`}
                      className="flex items-center gap-3 rounded-lg p-3 hover:bg-white/5 transition-colors group"
                    >
                      <span className="text-2xl">{topic.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#E8E8F0] truncate">{topic.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress
                            value={progress?.masteryScore ?? 0}
                            className="h-1 flex-1 bg-white/10"
                          />
                          <span className="text-xs text-[#8888A0] flex-shrink-0">{progress?.masteryScore ?? 0}%</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#8888A0] group-hover:text-[#6C5CE7] transition-colors" />
                    </Link>
                  )
                })}
                <Button asChild variant="outline" size="sm" className="w-full mt-2 border-white/10 text-[#8888A0] hover:text-[#E8E8F0] bg-transparent">
                  <Link href="/topics">View All Topics</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Quiz Attempts */}
        <Card className="bg-[#16161F] border-white/10">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#E8E8F0]">Recent Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            {profileLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-white/10" />
                ))}
              </div>
            ) : !profile?.quizAttempts?.length ? (
              <div className="text-center py-6">
                <p className="text-[#8888A0] mb-3">No quizzes taken yet</p>
                <Button asChild size="sm" className="bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white">
                  <Link href="/topics">Start a Quiz</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {profile.quizAttempts.slice(0, 5).map((attempt: {
                  id: string; score: number; completedAt: string | null;
                  quiz: { title: string; topic: { name: string; icon: string }; passingScore: number }
                }) => (
                  <div key={attempt.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/5 transition-colors">
                    <span className="text-xl">{attempt.quiz.topic.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#E8E8F0] truncate">{attempt.quiz.title}</p>
                      <p className="text-xs text-[#8888A0]">{attempt.quiz.topic.name} • {attempt.completedAt ? formatRelativeTime(attempt.completedAt) : ''}</p>
                    </div>
                    <Badge className={attempt.score >= attempt.quiz.passingScore
                      ? 'bg-[#00B894]/20 text-[#00B894]'
                      : 'bg-[#E17055]/20 text-[#E17055]'}>
                      {attempt.score}%
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
