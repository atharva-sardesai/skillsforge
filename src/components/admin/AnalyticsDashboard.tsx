'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, Activity, Library, Trophy } from 'lucide-react'

export function AnalyticsDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const [studentsRes, resourcesRes] = await Promise.all([
        fetch('/api/students?limit=1'),
        fetch('/api/resources'),
      ])
      const students = await studentsRes.json()
      const resources = await resourcesRes.json()
      return {
        totalStudents: students.data?.total ?? 0,
        totalResources: resources.data?.length ?? 0,
      }
    },
  })

  const stats = [
    { label: 'Total Students', value: data?.totalStudents ?? 0, icon: Users, color: '#6C5CE7' },
    { label: 'Resources Uploaded', value: data?.totalResources ?? 0, icon: Library, color: '#00B894' },
    { label: 'Active Today', value: '—', icon: Activity, color: '#FDCB6E' },
    { label: 'Avg Quiz Score', value: '—', icon: Trophy, color: '#E17055' },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="bg-[#16161F] border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#8888A0]">{stat.label}</CardTitle>
              <Icon className="h-4 w-4" style={{ color: stat.color }} />
            </CardHeader>
            <CardContent>
              {isLoading
                ? <Skeleton className="h-8 w-16" />
                : <p className="text-2xl font-bold text-[#E8E8F0]">{stat.value}</p>}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
