'use client'

import { motion } from 'framer-motion'
import { useTopics } from '@/hooks/useTopics'
import { useProfile } from '@/hooks/useProfile'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { BookOpen, HelpCircle, Library } from 'lucide-react'

export default function TopicsPage() {
  const { data: topics, isLoading } = useTopics()
  const { data: profile } = useProfile()

  const parentTopics = topics?.filter((t: { parentId: string | null }) => !t.parentId) ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-5xl"
    >
      <div>
        <h1 className="text-2xl font-bold text-[#E8E8F0]">Topics</h1>
        <p className="text-[#8888A0] mt-1">Choose a topic to study</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {parentTopics.map((topic: {
            id: string; name: string; icon: string; color: string; description: string;
            _count: { flashcards: number; quizzes: number; resources: number; children: number }
          }, i: number) => {
            const progress = profile?.topicProgress?.find((tp: { topicId: string }) => tp.topicId === topic.id)

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2, boxShadow: '0 0 20px rgba(108,92,231,0.15)' }}
              >
                <Link
                  href={`/topics/${topic.id}`}
                  className="block rounded-xl border border-white/10 bg-[#16161F] p-5 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{topic.icon}</span>
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: topic.color }}
                    />
                  </div>
                  <h2 className="text-base font-bold text-[#E8E8F0] mb-1">{topic.name}</h2>
                  <p className="text-sm text-[#8888A0] mb-4 line-clamp-2">{topic.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8888A0]">Mastery</span>
                      <span style={{ color: topic.color }}>{progress?.masteryScore ?? 0}%</span>
                    </div>
                    <Progress
                      value={progress?.masteryScore ?? 0}
                      className="h-1.5 bg-white/10"
                    />
                  </div>

                  <div className="flex items-center gap-3 mt-4 text-xs text-[#8888A0]">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {topic._count.flashcards}
                    </span>
                    <span className="flex items-center gap-1">
                      <HelpCircle className="h-3 w-3" />
                      {topic._count.quizzes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Library className="h-3 w-3" />
                      {topic._count.resources}
                    </span>
                    {topic._count.children > 0 && (
                      <Badge className="text-[10px] px-1.5 py-0 bg-white/10 text-[#8888A0]">
                        {topic._count.children} subtopics
                      </Badge>
                    )}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
