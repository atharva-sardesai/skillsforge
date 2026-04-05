import { StudentSidebar } from '@/components/layout/StudentSidebar'
import { Navbar } from '@/components/layout/Navbar'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0F]">
      <StudentSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
