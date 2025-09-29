'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [copiedCVU, setCopiedCVU] = useState(false)
  const [copiedAlias, setCopiedAlias] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValues, setEditValues] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    password: ''
  })


  const handleCopyCVU = async () => {
    try {
      await navigator.clipboard.writeText(user.cvu)
      setCopiedCVU(true)
      setTimeout(() => setCopiedCVU(false), 3000)
    } catch (err) {
      console.error('Error copying CVU:', err)
    }
  }

  const handleCopyAlias = async () => {
    try {
      await navigator.clipboard.writeText(user.alias)
      setCopiedAlias(true)
      setTimeout(() => setCopiedAlias(false), 3000)
    } catch (err) {
      console.error('Error copying alias:', err)
    }
  }

  const handleEditField = (field: string) => {
    setEditingField(field)
    setEditValues({
      ...editValues,
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    })
  }

  const handleSaveField = async (field: string) => {
    try {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))

      const updateData: { [key: string]: string } = {}
      if (field === 'name') {
        updateData.firstName = editValues.firstName
        updateData.lastName = editValues.lastName
      } else if (field === 'phone') {
        updateData.phone = editValues.phone
      } else if (field === 'password') {
        updateData.password = editValues.password
      }

      updateUser(updateData)
      setEditingField(null)
      setSuccess('Campo actualizado correctamente')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error updating field:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingField(null)
    setEditValues({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      password: ''
    })
  }

  if (!user) {
    return null
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-green-800 text-sm font-medium">{success}</div>
          </div>
        )}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-dmh-secondary">Tus datos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dmh-gray-700 mb-1">Email</label>
                <div className="text-lg text-dmh-gray-600">{user.email}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-dmh-gray-700 mb-1">Nombre y apellido</label>
                  {editingField === 'name' ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editValues.firstName}
                        onChange={(e) => setEditValues({...editValues, firstName: e.target.value})}
                        className="flex-1 px-3 py-2 border border-dmh-gray-300 rounded-lg text-dmh-gray-900 focus:border-dmh-primary focus:outline-none focus:ring-2 focus:ring-dmh-primary"
                        placeholder="Nombre"
                      />
                      <input
                        type="text"
                        value={editValues.lastName}
                        onChange={(e) => setEditValues({...editValues, lastName: e.target.value})}
                        className="flex-1 px-3 py-2 border border-dmh-gray-300 rounded-lg text-dmh-gray-900 focus:border-dmh-primary focus:outline-none focus:ring-2 focus:ring-dmh-primary"
                        placeholder="Apellido"
                      />
                    </div>
                  ) : (
                    <div className="text-lg text-dmh-gray-600">{user.firstName} {user.lastName}</div>
                  )}
                </div>
                {editingField === 'name' ? (
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-700 cursor-pointer"
                      onClick={() => handleSaveField('name')}
                      disabled={isLoading}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 cursor-pointer"
                      onClick={handleCancelEdit}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-dmh-gray-500 hover:text-dmh-secondary cursor-pointer"
                    onClick={() => handleEditField('name')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dmh-gray-700 mb-1">CUIT</label>
                <div className="text-lg text-dmh-gray-600">20350269798</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-dmh-gray-700 mb-1">Teléfono</label>
                  {editingField === 'phone' ? (
                    <input
                      type="tel"
                      value={editValues.phone}
                      onChange={(e) => setEditValues({...editValues, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-dmh-gray-300 rounded-lg text-dmh-gray-900 focus:border-dmh-primary focus:outline-none focus:ring-2 focus:ring-dmh-primary"
                      placeholder="Teléfono"
                    />
                  ) : (
                    <div className="text-lg text-dmh-gray-600">{user.phone}</div>
                  )}
                </div>
                {editingField === 'phone' ? (
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-700 cursor-pointer"
                      onClick={() => handleSaveField('phone')}
                      disabled={isLoading}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 cursor-pointer"
                      onClick={handleCancelEdit}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-dmh-gray-500 hover:text-dmh-secondary cursor-pointer"
                    onClick={() => handleEditField('phone')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-dmh-gray-700 mb-1">Contraseña</label>
                {editingField === 'password' ? (
                  <input
                    type="password"
                    value={editValues.password}
                    onChange={(e) => setEditValues({...editValues, password: e.target.value})}
                    className="w-full px-3 py-2 border border-dmh-gray-300 rounded-lg text-dmh-gray-900 focus:border-dmh-primary focus:outline-none focus:ring-2 focus:ring-dmh-primary"
                    placeholder="Nueva contraseña"
                  />
                ) : (
                  <div className="text-lg text-dmh-gray-600">••••••</div>
                )}
              </div>
              {editingField === 'password' ? (
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-600 hover:text-green-700 cursor-pointer"
                    onClick={() => handleSaveField('password')}
                    disabled={isLoading}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 cursor-pointer"
                    onClick={handleCancelEdit}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-dmh-gray-500 hover:text-dmh-secondary cursor-pointer"
                  onClick={() => handleEditField('password')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        <Link href="/payment-methods">
          <Card className="bg-dmh-primary hover:bg-dmh-primary-dark transition-colors cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-dmh-secondary">Gestioná los medios de pago</h3>
              <svg className="w-6 h-6 text-dmh-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </CardContent>
          </Card>
        </Link>
        <Card id="cvu" className="bg-dmh-secondary text-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Copia tu cvu o alias para ingresar o transferir dinero desde otra cuenta</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-dmh-primary font-medium">CVU</div>
                  <div className="font-mono text-lg">{user.cvu}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-dmh-primary hover:bg-dmh-primary hover:text-dmh-secondary cursor-pointer relative"
                  onClick={handleCopyCVU}
                >
                  {copiedCVU ? (
                    <span className="text-xs font-medium">Copiado</span>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-dmh-primary font-medium">Alias</div>
                  <div className="font-mono text-lg">{user.alias}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-dmh-primary hover:bg-dmh-primary hover:text-dmh-secondary cursor-pointer relative"
                  onClick={handleCopyAlias}
                >
                  {copiedAlias ? (
                    <span className="text-xs font-medium">Copiado</span>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}