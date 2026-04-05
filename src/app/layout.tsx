import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'SkillForge — Master Tech Interviews',
  description: 'AI-powered interview prep, expert-crafted flashcards, quizzes, and study resources — all in one platform.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full dark" style={{ colorScheme: 'dark' }}>
      <body className="h-full bg-[#0A0A0F] text-[#E8E8F0] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
