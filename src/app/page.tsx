'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen relative" style={{backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 800\"><defs><linearGradient id=\"bg\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"%23666\"/><stop offset=\"100%\" stop-color=\"%23999\"/></linearGradient></defs><rect width=\"100%\" height=\"100%\" fill=\"url(%23bg)\"/></svg>')"}}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight max-w-2xl">
                De ahora en adelante, hacés más con tu dinero
              </h1>
              <p className="text-2xl text-dmh-primary font-bold">
                Tu nueva <span className="text-dmh-primary">billetera virtual</span>
              </p>

              {/* Action Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12 lg:justify-center lg:max-w-4xl lg:mx-auto">
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <div className="border-b-2 border-dmh-primary pb-2 mb-4">
                    <h3 className="text-xl font-black text-black">Transferí dinero</h3>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    Desde Digital Money House vas a poder transferir dinero a otras cuentas, así como también recibir transferencias y nuclear tu capital en nuestra billetera virtual
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <div className="border-b-2 border-dmh-primary pb-2 mb-4">
                    <h3 className="text-xl font-black text-black">Pago de servicios</h3>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    Pagá mensualmente los servicios en 3 simples clicks. Fácil, rápido y conveniente. Olvidate de las facturas en papel
                  </p>
                </div>
              </div>

            </div>

            {/* Right side - empty space like in original */}
            <div className="relative">
              {/* This space intentionally left for background image focus */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
