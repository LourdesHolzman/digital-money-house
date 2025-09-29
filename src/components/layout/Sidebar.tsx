'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const menuItems = [
    { href: '/dashboard', label: 'Inicio', active: pathname === '/dashboard' },
    { href: '/activity', label: 'Actividad', active: pathname === '/activity' },
    { href: '/profile', label: 'Tu perfil', active: pathname === '/profile' },
    { href: '/add-money', label: 'Cargar dinero', active: pathname === '/add-money' },
    { href: '/pay-services', label: 'Pagar Servicios', active: pathname === '/pay-services' },
    { href: '/payment-methods', label: 'Tarjetas', active: pathname === '/payment-methods' },
  ]

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 min-h-screen flex flex-col bg-dmh-primary transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-black hover:bg-black/10 p-2 rounded"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 pt-2 lg:pt-8">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`block px-6 py-3 text-sm transition-colors text-black hover:bg-black/10 ${
                    item.active ? 'font-extrabold' : 'font-semibold'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-black/10 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </nav>
      </div>
    </>
  )
}