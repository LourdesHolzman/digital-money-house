'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Transaction } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    operationNumber: 'OP20241001001',
    userId: 'user1',
    type: 'deposit',
    amount: 50000,
    description: 'Carga de dinero desde tarjeta terminada en 1234',
    status: 'completed',
    createdAt: new Date('2024-01-15T10:30:00'),
  },
  {
    id: '2',
    operationNumber: 'OP20241001002',
    userId: 'user1',
    type: 'payment',
    amount: 12500,
    description: 'Pago de servicio Edesur',
    destination: 'Edesur S.A.',
    status: 'completed',
    serviceId: '1',
    createdAt: new Date('2024-01-14T15:45:00'),
  },
  {
    id: '3',
    operationNumber: 'OP20241001003',
    userId: 'user1',
    type: 'transfer',
    amount: 25000,
    description: 'Transferencia a contacto',
    destination: 'maria.garcia.dmh',
    status: 'completed',
    createdAt: new Date('2024-01-13T09:20:00'),
  },
  {
    id: '4',
    operationNumber: 'OP20241001004',
    userId: 'user1',
    type: 'payment',
    amount: 8900,
    description: 'Pago de servicio Metrogas',
    destination: 'Metrogas S.A.',
    status: 'completed',
    serviceId: '2',
    createdAt: new Date('2024-01-12T14:15:00'),
  },
  {
    id: '5',
    operationNumber: 'OP20241001005',
    userId: 'user1',
    type: 'deposit',
    amount: 75000,
    description: 'Carga de dinero desde tarjeta terminada en 5678',
    status: 'completed',
    createdAt: new Date('2024-01-11T11:30:00'),
  },
  {
    id: '6',
    operationNumber: 'OP20241001006',
    userId: 'user1',
    type: 'payment',
    amount: 15600,
    description: 'Pago de servicio AySA',
    destination: 'AySA',
    status: 'completed',
    serviceId: '3',
    createdAt: new Date('2024-01-10T16:45:00'),
  },
  {
    id: '7',
    operationNumber: 'OP20241001007',
    userId: 'user1',
    type: 'transfer',
    amount: 40000,
    description: 'Transferencia a contacto',
    destination: 'juan.perez.dmh',
    status: 'pending',
    createdAt: new Date('2024-01-09T08:30:00'),
  },
  {
    id: '8',
    operationNumber: 'OP20241001008',
    userId: 'user1',
    type: 'payment',
    amount: 23400,
    description: 'Pago de servicio Telecom',
    destination: 'Telecom Argentina',
    status: 'completed',
    serviceId: '4',
    createdAt: new Date('2024-01-08T13:20:00'),
  },
  {
    id: '9',
    operationNumber: 'OP20241001009',
    userId: 'user1',
    type: 'deposit',
    amount: 100000,
    description: 'Carga de dinero desde tarjeta terminada in 9012',
    status: 'failed',
    createdAt: new Date('2024-01-07T12:15:00'),
  },
  {
    id: '10',
    operationNumber: 'OP20241001010',
    userId: 'user1',
    type: 'payment',
    amount: 18900,
    description: 'Pago de servicio Movistar',
    destination: 'Movistar Argentina',
    status: 'completed',
    serviceId: '5',
    createdAt: new Date('2024-01-06T17:30:00'),
  },
  {
    id: '11',
    operationNumber: 'OP20241001011',
    userId: 'user1',
    type: 'transfer',
    amount: 60000,
    description: 'Transferencia a contacto',
    destination: 'ana.lopez.dmh',
    status: 'completed',
    createdAt: new Date('2024-01-05T10:45:00'),
  },
  {
    id: '12',
    operationNumber: 'OP20241001012',
    userId: 'user1',
    type: 'payment',
    amount: 31200,
    description: 'Pago de servicio Claro',
    destination: 'Claro Argentina',
    status: 'completed',
    serviceId: '6',
    createdAt: new Date('2024-01-04T14:20:00'),
  }
]

export default function TransactionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated } = useAuthStore()
  const [transaction, setTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const transactionId = params.id as string
    const foundTransaction = MOCK_TRANSACTIONS.find(t => t.id === transactionId)
    setTransaction(foundTransaction || null)
  }, [isAuthenticated, router, params.id])

  if (!isAuthenticated) {
    return <div>Cargando...</div>
  }

  if (!transaction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push('/activity')}
            className="mb-4"
          >
            ← Volver a actividad
          </Button>
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Transacción no encontrada</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50'
      case 'failed':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada'
      case 'pending':
        return 'Pendiente'
      case 'failed':
        return 'Fallida'
      default:
        return status
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Carga de dinero'
      case 'payment':
        return 'Pago de servicio'
      case 'transfer':
        return 'Transferencia'
      default:
        return type
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return (
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        )
      case 'payment':
        return (
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        )
      case 'transfer':
        return (
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/activity')}
          className="mb-6"
        >
          ← Volver a actividad
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-4">
              {getTypeIcon(transaction.type)}
              <div className="flex-1">
                <CardTitle className="text-xl">{getTypeText(transaction.type)}</CardTitle>
                <CardDescription>
                  {formatDate(transaction.createdAt)} • {transaction.operationNumber}
                </CardDescription>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
                {getStatusText(transaction.status)}
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detalles de la transacción</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Número de operación</span>
              <span className="font-mono font-medium">{transaction.operationNumber}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Fecha y hora</span>
              <span className="font-medium">{formatDate(transaction.createdAt)}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Tipo de operación</span>
              <span className="font-medium">{getTypeText(transaction.type)}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Monto</span>
              <span className={`font-bold text-xl ${
                transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </span>
            </div>

            {transaction.destination && (
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Destino</span>
                <span className="font-medium">{transaction.destination}</span>
              </div>
            )}

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Estado</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
                {getStatusText(transaction.status)}
              </span>
            </div>

            <div className="flex justify-between items-start py-3">
              <span className="text-gray-600">Descripción</span>
              <span className="font-medium text-right max-w-xs">{transaction.description}</span>
            </div>
          </CardContent>
        </Card>

        {transaction.status === 'completed' && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-green-800">Transacción completada exitosamente</p>
                  <p className="text-sm text-green-600">
                    Esta operación se procesó correctamente y ya está reflejada en tu saldo.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {transaction.status === 'pending' && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-yellow-800">Transacción en proceso</p>
                  <p className="text-sm text-yellow-600">
                    Esta operación está siendo procesada. Te notificaremos cuando se complete.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {transaction.status === 'failed' && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-red-800">Transacción fallida</p>
                  <p className="text-sm text-red-600">
                    Esta operación no pudo completarse. Si necesitas ayuda, contacta a soporte.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}