'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { Sidebar } from './Sidebar'
import { useSidebar } from '@/contexts/SidebarContext'

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { isSidebarOpen, closeSidebar } = useSidebar()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-dmh-secondary flex items-center justify-center">
      <div className="text-white">Cargando...</div>
    </div>
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#d5d4d4' }}>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full lg:ml-0" style={{ backgroundColor: '#d5d4d4' }}>
          <div className="max-w-full overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}