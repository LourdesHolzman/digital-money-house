'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/stores/authStore'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Service, ServicePayment } from '@/types'
import { formatCurrency } from '@/lib/utils'

const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Edesur',
    category: 'Electricidad',
    description: 'Empresa Distribuidora Sur',
    logoUrl: '/logos/edesur.png',
    isActive: true,
  },
  {
    id: '2',
    name: 'Metrogas',
    category: 'Gas',
    description: 'Distribuidora de Gas Metropolitana',
    logoUrl: '/logos/metrogas.png',
    isActive: true,
  },
  {
    id: '3',
    name: 'AySA',
    category: 'Agua',
    description: 'Agua y Saneamientos Argentinos',
    logoUrl: '/logos/aysa.png',
    isActive: true,
  },
]

export default function PayServicesPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServicePayment>()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const filteredServices = MOCK_SERVICES.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const onSubmit = async (data: ServicePayment) => {
    console.log('Service payment:', data)
    // Simulate payment processing
  }

  if (!isAuthenticated || !user) {
    return <div>Cargando...</div>
  }

  if (!selectedService) {
    return (
      <AuthenticatedLayout>
        <div className="space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-dmh-secondary">
              Pagar Servicios
            </h1>
            <p className="text-dmh-primary mt-2">
              Selecciona el servicio que deseas pagar
            </p>
          </div>

          <div className="mb-6">
            <Input
              label="Buscar servicio"
              placeholder="Busca por nombre, categoría o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredServices.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No se encontraron servicios que coincidan con tu búsqueda.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => (
                <Card
                  key={service.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedService(service)}
                >
                  <CardHeader>
                    <CardTitle className="text-dmh-secondary">{service.name}</CardTitle>
                    <CardDescription>{service.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-dmh-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedService(null)}
            className="mb-4"
          >
            ← Volver a servicios
          </Button>
          <h1 className="text-3xl font-bold text-dmh-secondary">
            Pagar {selectedService.name}
          </h1>
          <p className="text-dmh-primary mt-2">
            Categoria: {selectedService.category}
          </p>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Información del Pago</CardTitle>
            <CardDescription>
              Completa los datos para pagar tu servicio de {selectedService.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Número de cuenta"
                placeholder="Ingresa tu número de cuenta"
                error={errors.accountNumber?.message}
                {...register('accountNumber', {
                  required: 'El número de cuenta es requerido',
                })}
              />

              <Input
                label="Monto a pagar"
                type="number"
                placeholder="0.00"
                error={errors.amount?.message}
                {...register('amount', {
                  required: 'El monto es requerido',
                  min: {
                    value: 1,
                    message: 'El monto debe ser mayor a 0',
                  },
                })}
              />

              <Button
                type="submit"
                className="w-full bg-dmh-primary text-dmh-secondary hover:bg-dmh-primary-dark"
              >
                Pagar Servicio
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}