'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { JDInput } from '@/components/interview/JDInput'
import { QuestionList } from '@/components/interview/QuestionList'
import { useGenerateInterviewQuestions, useInterviewHistory } from '@/hooks/useInterviewPrep'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { History } from 'lucide-react'

export default function InterviewPrepPage() {
  const [result, setResult] = useState<{
    detectedRole: string
    remaining: number
    questions: Array<{ question: string; category: string; difficulty: string; tip: string }>
  } | null>(null)

  const generateMutation = useGenerateInterviewQuestions()
  const { data: history, isLoading: historyLoading } = useInterviewHistory()

  const handleSubmit = async (jd: string) => {
    try {
      const data = await generateMutation.mutateAsync(jd)
      setResult(data)
      toast.success('Interview questions generated!')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to generate questions')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl"
    >
      <div>
        <h1 className="text-2xl font-bold text-[#E8E8F0]">Interview Prep</h1>
        <p className="text-[#8888A0] mt-1">
          Paste a job description to generate tailored interview questions using AI
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-white/10 bg-[#16161F] p-6">
            {generateMutation.isPending ? (
              <div className="space-y-4">
                <p className="text-sm text-[#8888A0] text-center">🤖 Analyzing job description...</p>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-xl bg-white/5" />
                ))}
              </div>
            ) : result ? (
              <QuestionList questions={result.questions} detectedRole={result.detectedRole} />
            ) : (
              <JDInput
                onSubmit={handleSubmit}
                isLoading={generateMutation.isPending}
                remaining={10}
              />
            )}
          </div>

          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button
                onClick={() => { setResult(null); generateMutation.reset() }}
                className="text-sm text-[#6C5CE7] hover:underline"
              >
                ← Analyze a different JD
              </button>
            </motion.div>
          )}
        </div>

        {/* History sidebar */}
        <div>
          <Card className="bg-[#16161F] border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#E8E8F0] flex items-center gap-2">
                <History className="h-4 w-4" />
                Past Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 bg-white/5" />)}
                </div>
              ) : !history?.length ? (
                <p className="text-xs text-[#8888A0] text-center py-4">No past sessions yet</p>
              ) : (
                <div className="space-y-2">
                  {history.map((session: { id: string; detectedRole: string; createdAt: string; questions: unknown[] }) => (
                    <div
                      key={session.id}
                      className="rounded-lg p-2.5 hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => setResult({
                        detectedRole: session.detectedRole,
                        remaining: 10,
                        questions: session.questions as Array<{ question: string; category: string; difficulty: string; tip: string }>,
                      })}
                    >
                      <p className="text-xs font-medium text-[#E8E8F0] truncate">{session.detectedRole}</p>
                      <p className="text-xs text-[#8888A0] mt-0.5">{formatDate(session.createdAt)}</p>
                      <Badge className="text-[10px] px-1.5 py-0 mt-1 bg-[#6C5CE7]/20 text-[#6C5CE7]">
                        {(session.questions as unknown[]).length} questions
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
