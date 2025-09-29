'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { useSidebar } from '@/contexts/SidebarContext'

export function Header() {
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuthStore()
  const { toggleSidebar } = useSidebar()

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const isAuthPage = pathname === '/login' || pathname === '/register'

  if (!isAuthenticated || isAuthPage) {
    return (
      <header className="bg-dmh-secondary border-b border-dmh-secondary-light">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <img
                  src="/Logo0.png"
                  alt="Digital Money House"
                  className="h-8 w-auto cursor-pointer"
                />
              </Link>
            </div>
            {!isAuthPage && (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:text-dmh-primary cursor-pointer">
                    Ingresar
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-dmh-primary text-dmh-secondary hover:bg-dmh-primary-dark cursor-pointer">
                    Crear cuenta
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-dmh-secondary border-b border-dmh-secondary-light">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard">
              <img
                src="/Logo0.png"
                alt="Digital Money House"
                className="h-8 w-auto cursor-pointer"
              />
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-3">
              <Link href="/profile">
                <div className="px-3 py-1 bg-dmh-primary rounded-lg flex items-center justify-center text-dmh-secondary font-bold text-sm cursor-pointer hover:bg-dmh-primary-dark transition-colors duration-200">
                  {getInitials(user.firstName + ' ' + user.lastName)}
                </div>
              </Link>
              <Link href="/profile">
                <span className="text-white font-medium text-base hidden sm:block cursor-pointer hover:text-dmh-primary transition-colors">
                  Hola, {user.firstName} {user.lastName}
                </span>
              </Link>

              {/* Hamburger Menu Button - Only visible on mobile/tablet */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 text-white hover:text-dmh-primary ml-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}