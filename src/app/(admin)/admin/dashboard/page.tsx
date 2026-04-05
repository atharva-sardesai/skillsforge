'use client'

import { motion } from 'framer-motion'
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard'
import { StudentTable } from '@/components/admin/StudentTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminDashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-6xl"
    >
      <div>
        <h1 className="text-2xl font-bold text-[#E8E8F0]">Admin Dashboard</h1>
        <p className="text-[#8888A0] mt-1">Overview of platform activity and content</p>
      </div>

      <AnalyticsDashboard />

      <Card className="bg-[#16161F] border-white/10">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#E8E8F0]">Recent Students</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentTable />
        </CardContent>
      </Card>
    </motion.div>
  )
}
