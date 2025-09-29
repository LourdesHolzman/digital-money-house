'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  if (!user) {
    return null // AuthenticatedLayout handles the auth check
  }

  const activities = [
    { id: 1, description: 'Transferiste a Rodrigo', amount: -1265.57, date: 'Sábado' },
    { id: 2, description: 'Transfereriste a Consorcio', amount: -1265.57, date: 'Sábado' },
    { id: 3, description: 'Ingresaste dinero', amount: 1265.57, date: 'Sábado' },
    { id: 4, description: 'Te transfirieron dinero', amount: 1265.57, date: 'Sábado' },
  ]

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <Card className="bg-dmh-secondary text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="text-center lg:text-left">
                <h2 className="text-lg font-medium mb-2">Dinero disponible</h2>
                <div className="text-2xl sm:text-3xl font-bold border-2 border-dmh-primary rounded-full px-4 sm:px-6 py-2 inline-block">
                  {formatCurrency(user.balance)}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto lg:mt-2 items-center sm:items-start">
                <button
                  className="text-white font-normal hover:underline text-center sm:text-left cursor-pointer bg-transparent border-none p-0 m-0"
                  onClick={() => router.push('/payment-methods')}
                >
                  Ver tarjetas
                </button>
                <button
                  className="text-black font-normal bg-dmh-primary border-2 border-dmh-primary hover:bg-dmh-primary-dark hover:border-dmh-primary-dark px-4 py-2 rounded cursor-pointer transition-colors text-center"
                  onClick={() => router.push('/profile#cvu')}
                >
                  Ver CVU
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/add-money">
            <Card className="bg-dmh-primary hover:bg-dmh-primary-dark transition-colors cursor-pointer mobile-card">
              <CardContent className="p-4 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl font-bold text-dmh-secondary">Cargar dinero</h3>
              </CardContent>
            </Card>
          </Link>

          <Link href="/pay-services">
            <Card className="bg-dmh-primary hover:bg-dmh-primary-dark transition-colors cursor-pointer mobile-card">
              <CardContent className="p-4 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl font-bold text-dmh-secondary">Pago de servicios</h3>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar en tu actividad"
            className="w-full px-4 py-3 pl-10 rounded-lg border border-dmh-gray-300 focus:outline-none focus:ring-2 focus:ring-dmh-primary"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dmh-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-dmh-secondary">Tu actividad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-dmh-gray-200 last:border-b-0 gap-2">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="w-3 h-3 bg-dmh-primary rounded-full flex-shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-dmh-secondary text-sm sm:text-base truncate">{activity.description}</div>
                    <div className="text-xs sm:text-sm text-dmh-gray-500">{activity.date}</div>
                  </div>
                </div>
                <div className={`font-semibold text-sm sm:text-base flex-shrink-0 ${activity.amount > 0 ? 'text-dmh-primary' : 'text-dmh-secondary'}`}>
                  {activity.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(activity.amount))}
                </div>
              </div>
            ))}

            <div className="pt-4">
              <Link href="/activity">
                <Button
                  variant="ghost"
                  className="w-full text-dmh-secondary hover:bg-dmh-gray-100 justify-between text-sm sm:text-base mobile-btn"
                >
                  Ver toda tu actividad
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}