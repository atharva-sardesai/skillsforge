import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const adminRoutes = ['/admin']
const protectedRoutes = ['/dashboard', '/topics', '/flashcards', '/quiz', '/interview-prep', '/resources', '/profile']
const authRoutes = ['/login', '/register']

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const pathname = nextUrl.pathname

  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r))
  const isProtectedRoute = protectedRoutes.some((r) => pathname.startsWith(r))
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r))

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && session?.user) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  // Require auth for protected student routes
  if (isProtectedRoute && !session?.user) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  // Require admin role for admin routes
  if (isAdminRoute) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/login', nextUrl))
    }
    if ((session.user as { role?: string })?.role === 'STUDENT') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|uploads|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
