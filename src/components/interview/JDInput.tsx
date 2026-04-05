'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-react'

interface JDInputProps {
  onSubmit: (jd: string) => void
  isLoading: boolean
  remaining?: number
}

export function JDInput({ onSubmit, isLoading, remaining }: JDInputProps) {
  const [jd, setJd] = useState('')

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-[#E8E8F0] mb-2 block">
          Paste a Job Description
        </label>
        <Textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the full job description here. Include role requirements, responsibilities, required skills, and qualifications for the best results..."
          rows={12}
          className="bg-[#16161F] border-white/10 text-[#E8E8F0] placeholder:text-[#8888A0] resize-none focus:border-[#6C5CE7]"
        />
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-xs text-[#8888A0]">{jd.length} characters (min 50)</p>
          {remaining !== undefined && (
            <p className="text-xs text-[#8888A0]">{remaining} generations remaining today</p>
          )}
        </div>
      </div>
      <Button
        onClick={() => onSubmit(jd)}
        disabled={jd.length < 50 || isLoading}
        className="w-full bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing JD with AI...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Interview Questions
          </>
        )}
      </Button>
    </div>
  )
}
