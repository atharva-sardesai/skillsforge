'use client'

// NOTE: Client-side DRM is a deterrent only. For production, consider Widevine DRM,
// server-side rendering, or token-gated API-delivered content.

import { useEffect, useRef, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface DRMWrapperProps {
  children: ReactNode
  className?: string
}

export function DRMWrapper({ children, className }: DRMWrapperProps) {
  const { data: session } = useSession()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    const handleVisibilityChange = () => {
      if (document.hidden && el) {
        el.style.filter = 'blur(30px)'
        el.style.transition = 'filter 0.3s ease'
      } else if (el) {
        el.style.filter = 'none'
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block PrintScreen
      if (e.keyCode === 44) {
        e.preventDefault()
        toast.warning('Screen capture is restricted on this platform')
        return false
      }
      // Block Ctrl+P (print)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault()
        toast.warning('Screen capture is restricted on this platform')
        return false
      }
      // Block Ctrl+Shift+I (devtools)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault()
        toast.warning('Screen capture is restricted on this platform')
        return false
      }
      // Block Ctrl+Shift+J
      if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault()
        return false
      }
      // Block Ctrl+U (view source)
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault()
        toast.warning('Screen capture is restricted on this platform')
        return false
      }
      // Block F12
      if (e.key === 'F12') {
        e.preventDefault()
        toast.warning('Screen capture is restricted on this platform')
        return false
      }
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('keydown', handleKeyDown)
    el.addEventListener('contextmenu', handleContextMenu)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('keydown', handleKeyDown)
      el.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  const userEmail = session?.user?.email ?? 'unknown'

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ userSelect: 'none', WebkitUserSelect: 'none', position: 'relative' }}
    >
      {/* Invisible forensic watermark */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              top: `${(i % 5) * 20}%`,
              left: `${Math.floor(i / 5) * 25}%`,
              transform: 'rotate(-45deg)',
              fontSize: '12px',
              color: 'rgba(108,92,231,0.03)',
              whiteSpace: 'nowrap',
              fontFamily: 'monospace',
            }}
          >
            {userEmail}
          </span>
        ))}
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}
