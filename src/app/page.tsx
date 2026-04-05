'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  BookOpen, Mic2, Library, HelpCircle, BarChart3, Shield,
  ChevronRight, Zap, Star, ArrowRight, CheckCircle
} from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Smart Flashcards',
    description: 'Study with spaced-repetition flashcards. Flip, swipe, and master any topic at your pace.',
    color: '#6C5CE7',
  },
  {
    icon: Mic2,
    title: 'AI Interview Prep',
    description: 'Paste any job description and get 15 tailored interview questions powered by GPT-4o-mini.',
    color: '#0984E3',
  },
  {
    icon: Library,
    title: 'Resource Library',
    description: 'Access expert-curated PDFs and presentations, all in one organized library.',
    color: '#00B894',
  },
  {
    icon: HelpCircle,
    title: 'Practice Quizzes',
    description: 'Test your knowledge with timed quizzes, instant feedback, and detailed explanations.',
    color: '#FDCB6E',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Visualize your mastery with radar charts, streaks, XP, and achievement badges.',
    color: '#E17055',
  },
  {
    icon: Shield,
    title: 'Admin Portal',
    description: 'Full content management suite for instructors — create, manage, and track student progress.',
    color: '#00CEC9',
  },
]

const steps = [
  { number: '1', title: 'Sign Up', desc: 'Create your free account in seconds' },
  { number: '2', title: 'Study & Practice', desc: 'Flashcards, quizzes, and AI interview prep' },
  { number: '3', title: 'Ace Your Interview', desc: 'Walk in confident and prepared' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E8E8F0]">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#0A0A0F]/90 backdrop-blur-sm px-6 h-16">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6C5CE7]">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold">SkillForge</span>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="text-[#8888A0] hover:text-[#E8E8F0]">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild className="bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white">
            <Link href="/register">Get Started Free</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        {/* Animated background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#6C5CE7]/15 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-[#0984E3]/15 blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#00B894]/5 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mx-auto max-w-4xl px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#6C5CE7]/30 bg-[#6C5CE7]/10 px-4 py-1.5 text-sm text-[#6C5CE7]"
          >
            <Star className="h-3.5 w-3.5 fill-[#6C5CE7]" />
            AI-Powered Interview Preparation
          </motion.div>

          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Master{' '}
            <span className="bg-gradient-to-r from-[#6C5CE7] via-[#0984E3] to-[#00B894] bg-clip-text text-transparent">
              Tech Interviews.
            </span>
            <br />
            Learn Deep Skills.
          </h1>

          <p className="mb-10 mx-auto max-w-2xl text-xl text-[#8888A0] leading-relaxed">
            AI-powered interview prep, expert-crafted flashcards, quizzes, and study resources —
            all in one platform built for ambitious developers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white px-8 h-12 text-base font-semibold">
              <Link href="/register">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 text-[#E8E8F0] hover:bg-white/5 px-8 h-12 text-base bg-transparent">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-[#8888A0]">
            {['Free to start', 'No credit card required', 'Cancel anytime'].map((text) => (
              <span key={text} className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-[#00B894]" />
                {text}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-bold mb-4">Everything you need to land your dream job</h2>
            <p className="text-[#8888A0] text-lg max-w-2xl mx-auto">
              A complete learning ecosystem — from flashcards to AI-powered interview coaching
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4, boxShadow: `0 0 25px ${feature.color}20` }}
                  className="rounded-2xl border border-white/10 bg-[#12121A] p-6 transition-all duration-200"
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: feature.color }} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[#E8E8F0]">{feature.title}</h3>
                  <p className="text-[#8888A0] text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-[#12121A]">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-[#8888A0] text-lg">Three simple steps to interview success</p>
          </motion.div>

          <div className="flex flex-col md:flex-row items-start gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="flex-1 flex flex-col items-center text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#6C5CE7] text-white text-2xl font-extrabold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-[#E8E8F0] mb-2">{step.title}</h3>
                  <p className="text-[#8888A0]">{step.desc}</p>
                </motion.div>
                {i < steps.length - 1 && (
                  <div className="hidden md:flex items-center absolute">
                    <ChevronRight className="h-8 w-8 text-[#6C5CE7]/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to ace your next interview?</h2>
          <p className="text-[#8888A0] text-lg mb-8">Join thousands of developers who study smarter with SkillForge</p>
          <Button asChild size="lg" className="bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white px-10 h-12 text-base font-semibold">
            <Link href="/register">Start Learning For Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#6C5CE7]">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-[#E8E8F0]">SkillForge</span>
          </div>
          <p className="text-sm text-[#8888A0]">© {new Date().getFullYear()} SkillForge. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-[#8888A0]">
            <Link href="/login" className="hover:text-[#E8E8F0] transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-[#E8E8F0] transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
