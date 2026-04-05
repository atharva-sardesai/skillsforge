'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Zap, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      toast.error('Invalid email or password')
    } else {
      toast.success('Welcome back!')
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0F] p-4">
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-[#6C5CE7]/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl border border-white/10 bg-[#12121A] p-8 shadow-2xl">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#6C5CE7]">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#E8E8F0]">Welcome back</h1>
            <p className="mt-1 text-sm text-[#8888A0]">Sign in to your SkillForge account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[#E8E8F0]">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-[#16161F] border-white/10 text-[#E8E8F0] placeholder:text-[#8888A0] focus:border-[#6C5CE7]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[#E8E8F0]">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-[#16161F] border-white/10 text-[#E8E8F0] placeholder:text-[#8888A0] focus:border-[#6C5CE7]"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white font-semibold disabled:opacity-50"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign In
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-[#8888A0]">
            <p>Demo credentials:</p>
            <p className="text-xs mt-1">
              Student: <span className="text-[#6C5CE7]">student@demo.com</span> / student123
            </p>
            <p className="text-xs">
              Admin: <span className="text-[#6C5CE7]">admin@skillforge.dev</span> / admin123
            </p>
          </div>

          <div className="mt-6 text-center text-sm text-[#8888A0]">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#6C5CE7] hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
