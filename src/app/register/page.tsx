'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { RegisterUser } from '@/types'

export default function RegisterPage() {
  const router = useRouter()
  const { register: registerUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterUser>()

  const password = watch('password')

  const onSubmit = async (data: RegisterUser) => {
    setIsLoading(true)
    setError('')

    try {
      const success = await registerUser(data)
      if (success) {
        router.push('/dashboard')
      } else {
        setError('Error al crear la cuenta. El email puede estar en uso.')
      }
    } catch (err) {
      setError('Error al crear la cuenta. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dmh-secondary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Crear cuenta
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label=""
              placeholder="Nombre*"
              error={errors.firstName?.message}
              className="bg-white text-black placeholder-gray-600 border-0 rounded-lg h-12 text-base"
              {...register('firstName', {
                required: 'El nombre es requerido',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres',
                },
              })}
            />

            <Input
              label=""
              placeholder="Apellido*"
              error={errors.lastName?.message}
              className="bg-white text-black placeholder-gray-600 border-0 rounded-lg h-12 text-base"
              {...register('lastName', {
                required: 'El apellido es requerido',
                minLength: {
                  value: 2,
                  message: 'El apellido debe tener al menos 2 caracteres',
                },
              })}
            />
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label=""
              placeholder="DNI*"
              error={errors.dni?.message}
              className="bg-white text-black placeholder-gray-600 border-0 rounded-lg h-12 text-base"
              {...register('dni', {
                required: 'El DNI es requerido',
                pattern: {
                  value: /^\d{7,8}$/,
                  message: 'Ingresa un DNI válido',
                },
              })}
            />

            <Input
              label=""
              type="email"
              placeholder="Correo electrónico*"
              error={errors.email?.message}
              className="bg-white text-black placeholder-gray-600 border-0 rounded-lg h-12 text-base"
              {...register('email', {
                required: 'El email es requerido',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Ingresa un email válido',
                },
              })}
            />
          </div>

          {/* Password Requirements */}
          <div className="text-center">
            <p className="text-sm text-white">
              Usa entre 6 y 20 caracteres (debe contener al menos 1 carácter especial, una mayúscula y un número)
            </p>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label=""
              type="password"
              placeholder="Contraseña*"
              error={errors.password?.message}
              className="bg-white text-black placeholder-gray-600 border-0 rounded-lg h-12 text-base"
              {...register('password', {
                required: 'La contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres',
                },
              })}
            />

            <Input
              label=""
              type="password"
              placeholder="Confirmar contraseña*"
              error={errors.confirmPassword?.message}
              className="bg-white text-black placeholder-gray-600 border-0 rounded-lg h-12 text-base"
              {...register('confirmPassword', {
                required: 'Confirma tu contraseña',
                validate: (value) =>
                  value === password || 'Las contraseñas no coinciden',
              })}
            />
          </div>

          {/* Fourth Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label=""
              type="tel"
              placeholder="Teléfono*"
              error={errors.phone?.message}
              className="bg-white text-black placeholder-gray-600 border-0 rounded-lg h-12 text-base"
              {...register('phone', {
                required: 'El teléfono es requerido',
                pattern: {
                  value: /^\+?[1-9]\d{1,14}$/,
                  message: 'Ingresa un número de teléfono válido',
                },
              })}
            />

            <Button
              type="submit"
              className="bg-dmh-primary text-dmh-secondary hover:bg-dmh-primary-dark border-0 h-12 text-lg font-semibold"
              isLoading={isLoading}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}
        </form>

      </div>
    </div>
  )
}