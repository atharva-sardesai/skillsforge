'use client'

import { signOut, useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User, Settings } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import Link from 'next/link'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#12121A] px-6">
      <div />
      <div className="flex items-center gap-4">
        {session?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-white/5 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image ?? ''} />
                  <AvatarFallback className="bg-[#6C5CE7] text-white text-xs font-bold">
                    {getInitials(session.user.name ?? session.user.email ?? 'U')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-[#E8E8F0] leading-none">{session.user.name}</p>
                  <p className="text-xs text-[#8888A0] mt-0.5">{session.user.email}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#16161F] border-white/10">
              <DropdownMenuLabel className="text-[#8888A0]">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer text-[#E8E8F0] focus:bg-white/5">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="cursor-pointer text-[#E17055] focus:bg-[#E17055]/10 focus:text-[#E17055]"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
