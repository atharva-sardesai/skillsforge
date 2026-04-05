'use client'

import { motion } from 'framer-motion'
import { StudentTable } from '@/components/admin/StudentTable'

export default function AdminStudentsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-6xl"
    >
      <div>
        <h1 className="text-2xl font-bold text-[#E8E8F0]">Students</h1>
        <p className="text-[#8888A0] mt-1">Manage and view all registered students</p>
      </div>
      <StudentTable />
    </motion.div>
  )
}
