'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Zap, Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) return
    setLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const json = await res.json()

      if (!json.success) {
        toast.error(json.error || 'Registration failed')
        setLoading(false)
        return
      }

      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) {
        toast.error('Account created but sign-in failed. Please log in.')
        router.push('/login')
      } else {
        toast.success('Account created! Welcome to SkillForge!')
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0F] p-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-[#6C5CE7]/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl border border-white/10 bg-[#12121A] p-8 shadow-2xl">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#6C5CE7]">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#E8E8F0]">Create an account</h1>
            <p className="mt-1 text-sm text-[#8888A0]">Join SkillForge and start learning today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[#E8E8F0]">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="bg-[#16161F] border-white/10 text-[#E8E8F0] placeholder:text-[#8888A0] focus:border-[#6C5CE7]"
              />
            </div>
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
                placeholder="Min. 6 characters"
                required
                minLength={6}
                className="bg-[#16161F] border-white/10 text-[#E8E8F0] placeholder:text-[#8888A0] focus:border-[#6C5CE7]"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white font-semibold"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#8888A0]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#6C5CE7] hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
