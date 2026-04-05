'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials, formatDate, formatRelativeTime } from '@/lib/utils'
import { Search, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'

export function StudentTable() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-students', { search, page }],
    queryFn: async () => {
      const params = new URLSearchParams({ search, page: String(page), limit: '20' })
      const res = await fetch(`/api/students?${params}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
  })

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8888A0]" />
        <Input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search by name or email..."
          className="pl-9 bg-[#16161F] border-white/10 text-[#E8E8F0] placeholder:text-[#8888A0]"
        />
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-[#8888A0]">Student</TableHead>
              <TableHead className="text-[#8888A0]">Level</TableHead>
              <TableHead className="text-[#8888A0]">XP</TableHead>
              <TableHead className="text-[#8888A0]">Streak</TableHead>
              <TableHead className="text-[#8888A0]">Last Active</TableHead>
              <TableHead className="text-[#8888A0]">Joined</TableHead>
              <TableHead className="text-[#8888A0] w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-white/10">
                    <TableCell><Skeleton className="h-9 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell />
                  </TableRow>
                ))
              : data?.students.map((s: {
                  id: string; name: string; email: string; image?: string;
                  level: number; xp: number; streakDays: number;
                  lastActiveAt: string | null; createdAt: string
                }) => (
                  <TableRow
                    key={s.id}
                    className="border-white/10 hover:bg-white/5 cursor-pointer"
                    onClick={() => router.push(`/admin/students/${s.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-[#6C5CE7] text-white text-xs">
                            {getInitials(s.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-[#E8E8F0]">{s.name}</p>
                          <p className="text-xs text-[#8888A0]">{s.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-[#6C5CE7]/20 text-[#6C5CE7]">Lv {s.level}</Badge>
                    </TableCell>
                    <TableCell className="text-[#E8E8F0] font-mono">{s.xp.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="text-[#FDCB6E]">🔥 {s.streakDays}d</span>
                    </TableCell>
                    <TableCell className="text-sm text-[#8888A0]">
                      {s.lastActiveAt ? formatRelativeTime(s.lastActiveAt) : 'Never'}
                    </TableCell>
                    <TableCell className="text-sm text-[#8888A0]">{formatDate(s.createdAt)}</TableCell>
                    <TableCell>
                      <ChevronRight className="h-4 w-4 text-[#8888A0]" />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#8888A0]">
            Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, data.total)} of {data.total} students
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="border-white/10 text-[#E8E8F0] bg-transparent hover:bg-white/5"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === data.totalPages}
              onClick={() => setPage(p => p + 1)}
              className="border-white/10 text-[#E8E8F0] bg-transparent hover:bg-white/5"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
