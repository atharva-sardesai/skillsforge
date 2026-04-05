import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import openai from '@/lib/openai'
import { checkRateLimit } from '@/lib/rate-limit'
import { interviewPrepSchema } from '@/lib/validators'

export const dynamic = 'force-dynamic'

const SYSTEM_PROMPT = `You are an expert interview coach. Analyze this job description and:
1. Classify it into one of these categories: Frontend Engineer, Backend Engineer, Full Stack Engineer, Data Scientist, ML Engineer, DevOps/SRE, Cybersecurity Analyst, Product Manager, Cloud Architect, Mobile Developer, QA Engineer, Data Engineer
2. Generate exactly 15 interview questions most likely to be asked for this specific JD.
3. For each question provide: the question text, category (Technical/Behavioral/System Design/Domain), difficulty (Easy/Medium/Hard), and a brief tip for answering.

Respond ONLY in valid JSON, no markdown, no backticks:
{
  "detectedRole": "...",
  "questions": [
    { "question": "...", "category": "...", "difficulty": "...", "tip": "..." }
  ]
}`

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const rateLimit = checkRateLimit(session.user.id)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Rate limit exceeded. You can make 10 requests per day. Resets at ${new Date(rateLimit.resetAt).toLocaleTimeString()}`,
        },
        { status: 429 }
      )
    }

    const body = await req.json()
    const parsed = interviewPrepSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { jobDescription } = parsed.data

    let result: { detectedRole: string; questions: Array<{ question: string; category: string; difficulty: string; tip: string }> }

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: jobDescription },
        ],
      })

      const content = completion.choices[0]?.message?.content
      if (!content) throw new Error('Empty response from OpenAI')

      result = JSON.parse(content)
    } catch (aiError) {
      console.error('OpenAI error:', aiError)
      return NextResponse.json(
        { success: false, error: 'Failed to generate interview questions. Please try again.' },
        { status: 502 }
      )
    }

    // Save session
    const session_ = await prisma.interviewSession.create({
      data: {
        userId: session.user.id,
        jobDescription,
        detectedRole: result.detectedRole,
        questions: result.questions,
      },
    })

    await prisma.user.update({ where: { id: session.user.id }, data: { lastActiveAt: new Date() } })

    return NextResponse.json({
      success: true,
      data: { sessionId: session_.id, ...result, remaining: rateLimit.remaining },
    })
  } catch (error) {
    console.error('POST /api/interview-prep error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
