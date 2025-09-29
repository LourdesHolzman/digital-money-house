'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/stores/authStore'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { CardPreview } from '@/components/ui/CardPreview'
import { PaymentMethod } from '@/types'
import { maskCardNumber, validateCardNumber, validateCVV, getCardType, getCardTypeName } from '@/lib/utils'

type PaymentMethodForm = Omit<PaymentMethod, 'id' | 'userId' | 'createdAt' | 'isDefault'>

export default function PaymentMethodsPage() {
  const { user, paymentMethods, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod } = useAuthStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isFlipped, setIsFlipped] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentMethodForm>()

  const cardNumber = watch('cardNumber')
  const cardHolder = watch('cardHolder')
  const expiryDate = watch('expiryDate')
  const cvv = watch('cvv')
  const cardType = watch('type')

  const onSubmit = async (data: PaymentMethodForm) => {
    setIsLoading(true)
    setError('')

    if (paymentMethods.length >= 10) {
      setError('Has alcanzado el límite máximo de 10 tarjetas')
      setIsLoading(false)
      return
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      addPaymentMethod(data)
      setShowAddForm(false)
      reset()
    } catch (err) {
      console.error('Error adding payment method:', err)
      setError('Error al agregar la tarjeta. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemovePaymentMethod = (id: string) => {
    removePaymentMethod(id)
  }

  const handleSetAsDefault = (id: string) => {
    setDefaultPaymentMethod(id)
  }

  if (!user) {
    return null
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Mis Tarjetas
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus medios de pago
          </p>
        </div>

        {paymentMethods.length === 0 ? (
          <Card className="mb-8">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No tienes tarjetas asociadas
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Agrega tu primera tarjeta para comenzar a cargar saldo y pagar servicios
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="px-8"
              >
                Agregar primera tarjeta
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {paymentMethods.map((method) => (
            <Card key={method.id} className={method.isDefault ? 'ring-2 ring-lime-400' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {getCardTypeName(getCardType(method.cardNumber))}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {method.type === 'credit' ? 'Crédito' : 'Débito'}
                    </p>
                  </div>
                  {method.isDefault && (
                    <span className="bg-lime-100 text-lime-800 text-xs px-2 py-1 rounded">
                      Principal
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-mono text-lg">
                  {maskCardNumber(method.cardNumber)}
                </p>
                <p className="text-sm text-gray-600">
                  {method.cardHolder}
                </p>
                <p className="text-sm text-gray-600">
                  Vence: {method.expiryDate}
                </p>
                <div className="flex gap-2 pt-2">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetAsDefault(method.id)}
                    >
                      Hacer principal
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemovePaymentMethod(method.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

            {paymentMethods.length < 10 && (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="flex flex-col items-center justify-center h-full p-6">
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="w-full"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Agregar Tarjeta
                  </Button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {paymentMethods.length}/10 tarjetas
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {showAddForm && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-dmh-secondary">Agregar Nueva Tarjeta</CardTitle>
              <CardDescription className="text-dmh-gray-700">
                Ingresa los datos de tu tarjeta de crédito o débito
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div className="flex justify-center">
                  <CardPreview
                    cardNumber={cardNumber || ''}
                    cardHolder={cardHolder || ''}
                    expiryDate={expiryDate || ''}
                    cvv={cvv || ''}
                    type={cardType}
                    flipped={isFlipped}
                  />
                </div>
                <div className="space-y-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div>
                      <input
                        type="text"
                        placeholder="6011123456789012"
                        maxLength={19}
                        className="w-full rounded-lg border border-dmh-gray-300 px-4 py-3 text-dmh-gray-900 focus:border-dmh-primary focus:outline-none focus:ring-2 focus:ring-dmh-primary bg-white"
                        {...register('cardNumber', {
                          required: 'El número de tarjeta es requerido',
                          validate: (value) =>
                            validateCardNumber(value) || 'Número de tarjeta inválido',
                        })}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/\s/g, '')
                          const formattedValue = rawValue.replace(/(.{4})/g, '$1 ').trim()
                          setValue('cardNumber', formattedValue)
                        }}
                      />
                      {errors.cardNumber && (
                        <p className="text-red-600 text-sm mt-1">{errors.cardNumber.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          placeholder="20/28"
                          maxLength={5}
                          className="w-full rounded-lg border border-dmh-gray-300 px-4 py-3 text-dmh-gray-900 focus:border-dmh-primary focus:outline-none focus:ring-2 focus:ring-dmh-primary bg-white"
                          {...register('expiryDate', {
                            required: 'La fecha de vencimiento es requerida',
                            pattern: {
                              value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                              message: 'Formato inválido (MM/AA)',
                            },
                          })}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '')
                            if (value.length >= 2) {
                              value = value.substring(0, 2) + '/' + value.substring(2, 4)
                            }
                            setValue('expiryDate', value)
                          }}
                        />
                        {errors.expiryDate && (
                          <p className="text-red-600 text-sm mt-1">{errors.expiryDate.message}</p>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="666"
                          maxLength={4}
                          className="w-full rounded-lg border border-dmh-gray-300 px-4 py-3 text-dmh-gray-900 focus:border-dmh-primary focus:outline-none focus:ring-2 focus:ring-dmh-primary bg-white"
                          {...register('cvv', {
                            required: 'El CVV es requerido',
                            validate: (value) =>
                              validateCVV(value) || 'CVV inválido',
                          })}
                          onFocus={() => setIsFlipped(true)}
                          onBlur={() => setIsFlipped(false)}
                        />
                        {errors.cvv && (
                          <p className="text-red-600 text-sm mt-1">{errors.cvv.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Mauricio Brito"
                        className="w-full rounded-lg border border-dmh-gray-300 px-4 py-3 text-dmh-gray-900 focus:border-dmh-primary focus:outline-none focus:ring-2 focus:ring-dmh-primary bg-white"
                        {...register('cardHolder', {
                          required: 'El nombre del titular es requerido',
                          minLength: {
                            value: 3,
                            message: 'El nombre debe tener al menos 3 caracteres',
                          },
                        })}
                      />
                      {errors.cardHolder && (
                        <p className="text-red-600 text-sm mt-1">{errors.cardHolder.message}</p>
                      )}
                    </div>

                    <input type="hidden" value="credit" {...register('type')} />

                    {error && (
                      <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    <div className="pt-4">
                      <Button
                        type="submit"
                        isLoading={isLoading}
                        className="w-full bg-dmh-primary text-dmh-secondary hover:bg-dmh-primary-dark border-0"
                      >
                        {isLoading ? 'Agregando...' : 'Continuar'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  )
}