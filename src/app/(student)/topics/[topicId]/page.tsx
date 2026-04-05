'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import { useTopic } from '@/hooks/useTopics'
import { useFlashcards } from '@/hooks/useFlashcards'
import { useQuizzes } from '@/hooks/useQuiz'
import { useResources } from '@/hooks/useResources'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { EmptyState } from '@/components/shared/EmptyState'
import { BookOpen, HelpCircle, Library, ChevronLeft, Clock, Layers } from 'lucide-react'

interface Props {
  params: Promise<{ topicId: string }>
}

export default function TopicDetailPage({ params }: Props) {
  const { topicId } = use(params)
  const { data: topic, isLoading } = useTopic(topicId)
  const { data: flashcardData } = useFlashcards(topicId)
  const { data: quizzes } = useQuizzes(topicId)
  const { data: resources } = useResources({ topicId })

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-8 w-48 bg-white/5" />
        <Skeleton className="h-32 w-full rounded-xl bg-white/5" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl bg-white/5" />)}
        </div>
      </div>
    )
  }

  if (!topic) return <p className="text-[#8888A0]">Topic not found</p>

  const flashcards = flashcardData?.flashcards ?? []
  const quizList = quizzes ?? []
  const resourceList = resources ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl"
    >
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm" className="border-white/10 text-[#8888A0] hover:text-[#E8E8F0] bg-transparent">
          <Link href="/topics"><ChevronLeft className="h-4 w-4 mr-1" />Topics</Link>
        </Button>
      </div>

      {/* Topic Header */}
      <div className="rounded-2xl border border-white/10 bg-[#16161F] p-6">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{topic.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-[#E8E8F0]">{topic.name}</h1>
            <p className="text-[#8888A0] mt-1">{topic.description}</p>
          </div>
        </div>

        {topic.children?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-[#8888A0] self-center">Subtopics:</span>
            {topic.children.map((child: { id: string; name: string; icon: string }) => (
              <Link key={child.id} href={`/topics/${child.id}`}>
                <Badge className="bg-white/10 text-[#E8E8F0] hover:bg-white/20 cursor-pointer">
                  {child.icon} {child.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Action Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Flashcards */}
        <div className="rounded-xl border border-white/10 bg-[#16161F] p-5 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#6C5CE7]" />
            <h2 className="font-semibold text-[#E8E8F0]">Flashcards</h2>
          </div>
          {flashcards.length === 0 ? (
            <EmptyState emoji="📚" title="No flashcards yet" className="py-6" />
          ) : (
            <>
              <p className="text-3xl font-bold text-[#E8E8F0]">{flashcards.length}</p>
              <p className="text-sm text-[#8888A0]">cards to study</p>
              <Button asChild className="w-full bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white">
                <Link href={`/flashcards/${topicId}`}>Study Now</Link>
              </Button>
            </>
          )}
        </div>

        {/* Quizzes */}
        <div className="rounded-xl border border-white/10 bg-[#16161F] p-5 space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#00B894]" />
            <h2 className="font-semibold text-[#E8E8F0]">Quizzes</h2>
          </div>
          {quizList.length === 0 ? (
            <EmptyState emoji="🎯" title="No quizzes yet" className="py-6" />
          ) : (
            <div className="space-y-2">
              {quizList.slice(0, 2).map((quiz: { id: string; title: string; timeLimit: number | null; questions: Array<unknown>; passingScore: number }) => (
                <Link key={quiz.id} href={`/quiz/${topicId}`}>
                  <div className="rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors cursor-pointer">
                    <p className="text-sm font-medium text-[#E8E8F0] truncate">{quiz.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[#8888A0]">
                      <Layers className="h-3 w-3" />
                      {quiz.questions.length} questions
                      {quiz.timeLimit && (
                        <>
                          <Clock className="h-3 w-3" />
                          {quiz.timeLimit}m
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Resources */}
        <div className="rounded-xl border border-white/10 bg-[#16161F] p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Library className="h-5 w-5 text-[#FDCB6E]" />
            <h2 className="font-semibold text-[#E8E8F0]">Resources</h2>
          </div>
          {resourceList.length === 0 ? (
            <EmptyState emoji="📄" title="No resources yet" className="py-6" />
          ) : (
            <>
              <p className="text-3xl font-bold text-[#E8E8F0]">{resourceList.length}</p>
              <p className="text-sm text-[#8888A0]">files available</p>
              <Button asChild variant="outline" className="w-full border-white/10 text-[#E8E8F0] hover:bg-white/5 bg-transparent">
                <Link href={`/resources?topic=${topicId}`}>View All</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
