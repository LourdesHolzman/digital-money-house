'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Transaction } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

// Expanded mock transactions for better testing
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    operationNumber: 'OP001234567',
    userId: '1',
    type: 'deposit',
    amount: 50000,
    description: 'Recarga con tarjeta terminada en 1234',
    destination: 'Digital Money House',
    status: 'completed',
    paymentMethodId: 'demo-card-1',
    createdAt: new Date(), // today
  },
  {
    id: '2',
    operationNumber: 'OP001234568',
    userId: '1',
    type: 'payment',
    amount: -15000,
    description: 'Pago de servicio Edesur',
    destination: 'Edesur S.A.',
    status: 'completed',
    serviceId: '1',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: '3',
    operationNumber: 'OP001234569',
    userId: '1',
    type: 'deposit',
    amount: 25000,
    description: 'Recarga con tarjeta terminada en 5678',
    destination: 'Digital Money House',
    status: 'completed',
    paymentMethodId: 'demo-card-2',
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
  },
  {
    id: '4',
    operationNumber: 'OP001234570',
    userId: '1',
    type: 'payment',
    amount: -8500,
    description: 'Pago de servicio Metrogas',
    destination: 'Metrogas S.A.',
    status: 'completed',
    serviceId: '2',
    createdAt: new Date(Date.now() - 259200000), // 3 days ago
  },
  {
    id: '5',
    operationNumber: 'OP001234571',
    userId: '1',
    type: 'payment',
    amount: -3200,
    description: 'Pago de servicio AySA',
    destination: 'AySA',
    status: 'failed',
    serviceId: '3',
    createdAt: new Date(Date.now() - 432000000), // 5 days ago
  },
  {
    id: '6',
    operationNumber: 'OP001234572',
    userId: '1',
    type: 'deposit',
    amount: 75000,
    description: 'Recarga con transferencia bancaria',
    destination: 'Digital Money House',
    status: 'completed',
    createdAt: new Date(Date.now() - 518400000), // 6 days ago
  },
  {
    id: '7',
    operationNumber: 'OP001234573',
    userId: '1',
    type: 'payment',
    amount: -12300,
    description: 'Pago de Netflix',
    destination: 'Netflix Inc.',
    status: 'completed',
    serviceId: '4',
    createdAt: new Date(Date.now() - 604800000), // 1 week ago
  },
  {
    id: '8',
    operationNumber: 'OP001234574',
    userId: '1',
    type: 'payment',
    amount: -45000,
    description: 'Pago de Spotify Premium',
    destination: 'Spotify AB',
    status: 'completed',
    serviceId: '5',
    createdAt: new Date(Date.now() - 1209600000), // 2 weeks ago
  },
  {
    id: '9',
    operationNumber: 'OP001234575',
    userId: '1',
    type: 'deposit',
    amount: 120000,
    description: 'Recarga con tarjeta terminada en 9876',
    destination: 'Digital Money House',
    status: 'completed',
    paymentMethodId: 'demo-card-3',
    createdAt: new Date(Date.now() - 1814400000), // 3 weeks ago
  },
  {
    id: '10',
    operationNumber: 'OP001234576',
    userId: '1',
    type: 'payment',
    amount: -2500,
    description: 'Pago de Mercado Libre',
    destination: 'MercadoLibre',
    status: 'completed',
    serviceId: '6',
    createdAt: new Date(Date.now() - 2592000000), // 1 month ago
  },
  {
    id: '11',
    operationNumber: 'OP001234577',
    userId: '1',
    type: 'deposit',
    amount: 90000,
    description: 'Recarga con tarjeta terminada en 4567',
    destination: 'Digital Money House',
    status: 'completed',
    paymentMethodId: 'demo-card-4',
    createdAt: new Date(Date.now() - 5184000000), // 2 months ago
  },
  {
    id: '12',
    operationNumber: 'OP001234578',
    userId: '1',
    type: 'payment',
    amount: -18700,
    description: 'Pago de Movistar',
    destination: 'Movistar Argentina',
    status: 'completed',
    serviceId: '7',
    createdAt: new Date(Date.now() - 7776000000), // 3 months ago
  },
]

type DateFilter = 'all' | 'today' | 'yesterday' | 'week' | 'fifteen_days' | 'month' | 'three_months'
type TypeFilter = 'all' | 'deposit' | 'payment'
type AmountFilter = 'all' | '0-1000' | '1000-5000' | '5000-20000' | '20000-100000' | '100000+'

export default function ActivityPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])

  // Filter states
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [amountFilter, setAmountFilter] = useState<AmountFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Simulate loading transactions
    setTimeout(() => {
      const userTransactions = MOCK_TRANSACTIONS.filter(t => t.userId === user?.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setTransactions(userTransactions)
    }, 500)
  }, [isAuthenticated, user?.id, router])

  // Apply filters whenever transactions or filter states change
  useEffect(() => {
    let filtered = [...transactions]

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter)
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.createdAt)

        switch (dateFilter) {
          case 'today':
            return transactionDate >= today
          case 'yesterday':
            const yesterday = new Date(today.getTime() - 86400000)
            return transactionDate >= yesterday && transactionDate < today
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 86400000)
            return transactionDate >= weekAgo
          case 'fifteen_days':
            const fifteenDaysAgo = new Date(today.getTime() - 15 * 86400000)
            return transactionDate >= fifteenDaysAgo
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 86400000)
            return transactionDate >= monthAgo
          case 'three_months':
            const threeMonthsAgo = new Date(today.getTime() - 90 * 86400000)
            return transactionDate >= threeMonthsAgo
          default:
            return true
        }
      })
    }

    // Amount filter
    if (amountFilter !== 'all') {
      filtered = filtered.filter(t => {
        const absAmount = Math.abs(t.amount)

        switch (amountFilter) {
          case '0-1000':
            return absAmount <= 1000
          case '1000-5000':
            return absAmount > 1000 && absAmount <= 5000
          case '5000-20000':
            return absAmount > 5000 && absAmount <= 20000
          case '20000-100000':
            return absAmount > 20000 && absAmount <= 100000
          case '100000+':
            return absAmount > 100000
          default:
            return true
        }
      })
    }

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.operationNumber.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredTransactions(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [transactions, typeFilter, dateFilter, amountFilter, searchQuery])

  const clearAllFilters = () => {
    setTypeFilter('all')
    setDateFilter('all')
    setAmountFilter('all')
    setSearchQuery('')
    setCurrentPage(1)
  }

  const hasActiveFilters = typeFilter !== 'all' || dateFilter !== 'all' || amountFilter !== 'all' || searchQuery.trim() !== ''

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

  const getTransactionIcon = (type: string, status: string) => {
    if (status === 'failed') {
      return (
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )
    }

    if (type === 'deposit') {
      return (
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="12" y1="6" x2="12" y2="18" strokeLinecap="round" strokeWidth={2} />
            <line x1="6" y1="12" x2="18" y2="12" strokeLinecap="round" strokeWidth={2} />
          </svg>
        </div>
      )
    }

    return (
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    }

    const labels = {
      completed: 'Completado',
      pending: 'Pendiente',
      failed: 'Fallido',
    }

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  if (!isAuthenticated || !user) {
    return <div>Cargando...</div>
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dmh-secondary">
            Tu Actividad
          </h1>
          <p className="text-dmh-gray-600 mt-2">
            Historial completo de tus transacciones con filtros avanzados
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-dmh-primary">Total Ingresado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  transactions
                    .filter(t => t.type === 'deposit' && t.status === 'completed')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-dmh-primary">Total Pagado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  Math.abs(
                    transactions
                      .filter(t => t.type === 'payment' && t.status === 'completed')
                      .reduce((sum, t) => sum + t.amount, 0)
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-dmh-secondary">Total Transacciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transactions.length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-dmh-secondary">Historial de Transacciones</CardTitle>
            <CardDescription className="text-dmh-gray-700">
              Filtra y revisa todas tus operaciones (mostrando {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} de {filteredTransactions.length})
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="mb-6">
              <Input
                placeholder="Buscar por descripción, destino o número de operación..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Filters */}
            <div className="space-y-4 mb-6">
              {/* Type Filters */}
              <div>
                <label className="block text-sm font-medium text-dmh-gray-700 mb-2">Tipo de operación</label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={typeFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTypeFilter('all')}
                  >
                    Todas
                  </Button>
                  <Button
                    variant={typeFilter === 'deposit' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTypeFilter('deposit')}
                  >
                    Ingresos
                  </Button>
                  <Button
                    variant={typeFilter === 'payment' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTypeFilter('payment')}
                  >
                    Egresos
                  </Button>
                </div>
              </div>

              {/* Date Filters */}
              <div>
                <label className="block text-sm font-medium text-dmh-gray-700 mb-2">Período</label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={dateFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateFilter('all')}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={dateFilter === 'today' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateFilter('today')}
                  >
                    Hoy
                  </Button>
                  <Button
                    variant={dateFilter === 'yesterday' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateFilter('yesterday')}
                  >
                    Ayer
                  </Button>
                  <Button
                    variant={dateFilter === 'week' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateFilter('week')}
                  >
                    Última semana
                  </Button>
                  <Button
                    variant={dateFilter === 'fifteen_days' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateFilter('fifteen_days')}
                  >
                    Últimos 15 días
                  </Button>
                  <Button
                    variant={dateFilter === 'month' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateFilter('month')}
                  >
                    Último mes
                  </Button>
                  <Button
                    variant={dateFilter === 'three_months' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateFilter('three_months')}
                  >
                    Últimos 3 meses
                  </Button>
                </div>
              </div>

              {/* Amount Filters */}
              <div>
                <label className="block text-sm font-medium text-dmh-gray-700 mb-2">Monto aproximado</label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={amountFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAmountFilter('all')}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={amountFilter === '0-1000' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAmountFilter('0-1000')}
                  >
                    $0 a $1.000
                  </Button>
                  <Button
                    variant={amountFilter === '1000-5000' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAmountFilter('1000-5000')}
                  >
                    $1.000 a $5.000
                  </Button>
                  <Button
                    variant={amountFilter === '5000-20000' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAmountFilter('5000-20000')}
                  >
                    $5.000 a $20.000
                  </Button>
                  <Button
                    variant={amountFilter === '20000-100000' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAmountFilter('20000-100000')}
                  >
                    $20.000 a $100.000
                  </Button>
                  <Button
                    variant={amountFilter === '100000+' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAmountFilter('100000+')}
                  >
                    Más de $100.000
                  </Button>
                </div>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Borrar filtros
                  </Button>
                </div>
              )}
            </div>

            {/* Transactions List */}
            <div className="space-y-4">
              {currentTransactions.length === 0 ? (
                <div className="text-center py-8 text-dmh-gray-500">
                  <p>No hay transacciones para mostrar</p>
                  <p className="text-sm mt-2">
                    {hasActiveFilters ? 'Intenta cambiar los filtros' : 'Comienza agregando saldo a tu billetera o pagando servicios'}
                  </p>
                </div>
              ) : (
                currentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-dmh-gray-200 rounded-lg hover:bg-dmh-gray-50 cursor-pointer"
                    onClick={() => router.push(`/activity/${transaction.id}`)}
                  >
                    <div className="flex items-center space-x-4">
                      {getTransactionIcon(transaction.type, transaction.status)}
                      <div>
                        <h3 className="font-medium text-dmh-gray-900">
                          {transaction.description}
                        </h3>
                        <p className="text-sm text-dmh-gray-500">
                          {formatDate(transaction.createdAt)} • {transaction.operationNumber}
                        </p>
                        {transaction.destination && (
                          <p className="text-xs text-dmh-gray-400">
                            {transaction.destination}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-lg font-semibold ${
                            transaction.amount > 0 ? 'text-dmh-primary' : 'text-red-600'
                          }`}
                        >
                          {transaction.amount > 0 ? '+' : ''}
                          {formatCurrency(transaction.amount)}
                        </span>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-dmh-gray-700">
                  Página {currentPage} de {totalPages} ({filteredTransactions.length} transacciones)
                </p>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Anterior
                  </Button>

                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}