'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/stores/authStore'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { WalletRecharge } from '@/types'
import { formatCurrency } from '@/lib/utils'

const PRESET_AMOUNTS = [1000, 5000, 10000, 25000, 50000]

export default function AddMoneyPage() {
  const router = useRouter()
  const { user, isAuthenticated, updateBalance } = useAuthStore()
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WalletRecharge>()

  const amount = watch('amount')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (selectedAmount) {
      setValue('amount', selectedAmount)
      setCustomAmount('')
    }
  }, [selectedAmount, setValue])

  useEffect(() => {
    if (customAmount) {
      setSelectedAmount(null)
      setValue('amount', parseInt(customAmount) || 0)
    }
  }, [customAmount, setValue])

  const onSubmit = async (data: WalletRecharge) => {
    if (!data.paymentMethodId) {
      return
    }

    setIsLoading(true)
    setSuccess('')

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      updateBalance(data.amount)
      setSuccess(`¡Recarga exitosa! Se agregaron ${formatCurrency(data.amount)} a tu billetera.`)

      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      console.error('Error adding money:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated || !user) {
    return <div>Cargando...</div>
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dmh-secondary">
              Cargar Dinero
            </h1>
            <p className="text-dmh-gray-600 mt-2">
              Agrega saldo a tu billetera virtual
            </p>
          </div>

        <Card className="mb-6 bg-dmh-primary">
          <CardHeader>
            <CardTitle className="text-dmh-secondary">Saldo Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-dmh-secondary">
              {formatCurrency(user.balance)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-dmh-secondary">Nueva Recarga</CardTitle>
            <CardDescription className="text-dmh-gray-700">
              Selecciona el monto y método de pago
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dmh-gray-700 mb-4">
                  Selecciona un monto
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {PRESET_AMOUNTS.map((presetAmount) => (
                    <Button
                      key={presetAmount}
                      type="button"
                      variant={selectedAmount === presetAmount ? 'default' : 'outline'}
                      onClick={() => setSelectedAmount(presetAmount)}
                      className="h-12"
                    >
                      {formatCurrency(presetAmount)}
                    </Button>
                  ))}
                </div>

                <Input
                  label="O ingresa un monto personalizado"
                  type="number"
                  placeholder="10000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  min="100"
                  max="100000"
                  className="bg-white"
                />
              </div>

              <Input
                label="Monto a cargar"
                type="number"
                placeholder="0"
                value={amount || ''}
                readOnly
                error={errors.amount?.message}
                className="bg-white"
                {...register('amount', {
                  required: 'Selecciona un monto',
                  min: {
                    value: 100,
                    message: 'El monto mínimo es $100',
                  },
                  max: {
                    value: 100000,
                    message: 'El monto máximo es $100.000',
                  },
                })}
              />

              <div>
                <label className="block text-sm font-medium text-dmh-gray-700 mb-2">
                  Método de pago
                </label>
                <select
                  className="w-full rounded-lg border border-dmh-gray-300 px-4 py-3 text-dmh-gray-900 focus:border-dmh-primary focus:outline-none focus:ring-2 focus:ring-dmh-primary bg-white"
                  {...register('paymentMethodId', { required: 'Selecciona un método de pago' })}
                >
                  <option value="">Selecciona una tarjeta</option>
                  <option value="demo-card-1">Tarjeta de Crédito **** 1234</option>
                  <option value="demo-card-2">Tarjeta de Débito **** 5678</option>
                </select>
                {errors.paymentMethodId && (
                  <p className="text-red-600 text-sm mt-1">{errors.paymentMethodId.message}</p>
                )}

                <p className="text-sm text-dmh-gray-500 mt-2">
                  ¿No tienes tarjetas registradas?{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/payment-methods')}
                    className="text-dmh-primary hover:text-dmh-primary-dark font-medium"
                  >
                    Agrega una aquí
                  </button>
                </p>
              </div>

              {amount > 0 && (
                <Card className="bg-dmh-primary/10 border-dmh-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-dmh-gray-700">Monto a cargar:</span>
                      <span className="font-semibold text-dmh-secondary">{formatCurrency(amount)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-dmh-gray-700">Nuevo saldo:</span>
                      <span className="font-semibold text-dmh-primary">
                        {formatCurrency(user.balance + amount)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {success && (
                <div className="text-green-600 text-center p-4 bg-green-50 rounded-lg">
                  {success}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-dmh-primary text-dmh-secondary hover:bg-dmh-primary-dark border-0"
                isLoading={isLoading}
                disabled={!amount || amount < 100}
              >
                {isLoading ? 'Procesando recarga...' : `Cargar ${formatCurrency(amount || 0)}`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}