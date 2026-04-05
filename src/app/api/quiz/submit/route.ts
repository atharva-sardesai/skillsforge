import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { quizSubmitSchema } from '@/lib/validators'
import { XP_REWARDS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const parsed = quizSubmitSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { quizId, totalTime, answers } = parsed.data
    const userId = session.user.id

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { select: { id: true, correctIndex: true } } },
    })

    if (!quiz) return NextResponse.json({ success: false, error: 'Quiz not found' }, { status: 404 })

    const questionMap = Object.fromEntries(quiz.questions.map((q) => [q.id, q.correctIndex]))
    let correctCount = 0
    const answerData = answers.map((a) => {
      const isCorrect = questionMap[a.questionId] === a.selectedIndex
      if (isCorrect) correctCount++
      return {
        questionId: a.questionId,
        selectedIndex: a.selectedIndex,
        isCorrect,
        timeTaken: a.timeTaken,
      }
    })

    const score = quiz.questions.length > 0 ? Math.round((correctCount / quiz.questions.length) * 100) : 0
    const now = new Date()

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        score,
        totalTime,
        startedAt: new Date(now.getTime() - totalTime * 1000),
        completedAt: now,
        answers: { create: answerData },
      },
      include: { answers: { include: { question: true } } },
    })

    // XP calculation
    let xpGained = correctCount * XP_REWARDS.CORRECT_ANSWER + XP_REWARDS.QUIZ_COMPLETION
    if (score === 100) xpGained += XP_REWARDS.PERFECT_SCORE

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { xp: true, level: true } })
    if (user) {
      const newXp = user.xp + xpGained
      let newLevel = user.level
      while (newXp >= newLevel * 500) newLevel++

      await prisma.user.update({
        where: { id: userId },
        data: { xp: newXp, level: newLevel, lastActiveAt: now },
      })
    }

    // Update topic progress
    const allAttempts = await prisma.quizAttempt.findMany({
      where: { userId, quiz: { topicId: quiz.topicId } },
      select: { score: true },
    })
    const avgScore = allAttempts.length > 0
      ? allAttempts.reduce((sum, a) => sum + a.score, 0) / allAttempts.length
      : score

    const topicProg = await prisma.topicProgress.findUnique({
      where: { userId_topicId: { userId, topicId: quiz.topicId } },
    })

    const flashcardRatio = topicProg && topicProg.flashcardsTotal > 0
      ? topicProg.flashcardsKnown / topicProg.flashcardsTotal
      : 0
    const masteryScore = Math.round(avgScore * 0.6 + flashcardRatio * 100 * 0.4)

    await prisma.topicProgress.upsert({
      where: { userId_topicId: { userId, topicId: quiz.topicId } },
      create: {
        userId,
        topicId: quiz.topicId,
        masteryScore,
        quizzesTaken: 1,
        avgQuizScore: score,
        lastAccessedAt: now,
      },
      update: {
        masteryScore,
        quizzesTaken: allAttempts.length,
        avgQuizScore: avgScore,
        lastAccessedAt: now,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        attempt,
        score,
        correctCount,
        totalQuestions: quiz.questions.length,
        passed: score >= quiz.passingScore,
        xpGained,
      },
    })
  } catch (error) {
    console.error('POST /api/quiz/submit error:', error)
    return NextResponse.json({ success: false, error: 'Failed to submit quiz' }, { status: 500 })
  }
}
