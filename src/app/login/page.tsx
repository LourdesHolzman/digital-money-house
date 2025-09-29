'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AuthUser } from '@/types'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthUser>()

  const onSubmit = async (data: AuthUser) => {
    setIsLoading(true)
    setError('')

    try {
      const success = await login(data)
      if (success) {
        router.push('/dashboard')
      } else {
        setError('Email o contraseña incorrectos')
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dmh-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            ¡Hola! Ingresá tus datos
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label=""
            type="email"
            placeholder="Correo electrónico"
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

          <Input
            label=""
            type="password"
            placeholder="Contraseña"
            error={errors.password?.message}
            className="bg-white text-black placeholder-gray-600 border-0 rounded-lg h-12 text-base"
            {...register('password', {
              required: 'La contraseña es requerida',
            })}
          />

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-dmh-primary text-dmh-secondary hover:bg-dmh-primary-dark border-0 h-12 text-lg font-semibold"
            isLoading={isLoading}
          >
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </Button>

          <Link href="/register" className="block">
            <Button
              variant="outline"
              className="w-full bg-dmh-gray-300 text-dmh-gray-700 hover:bg-dmh-gray-200 border-0 h-12 text-lg"
            >
              Crear cuenta
            </Button>
          </Link>
        </form>

        <div className="mt-8 text-center">
          <div className="p-4 bg-dmh-secondary/10 rounded-lg">
            <p className="text-sm text-white">
              <strong>Demo:</strong> demo@digitalmoney.com / password123
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}