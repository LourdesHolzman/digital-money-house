'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthUser, RegisterUser } from '@/types'
import { generateCVU, generateAlias } from '@/lib/utils'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (credentials: AuthUser) => Promise<boolean>
  register: (userData: RegisterUser) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  updateBalance: (amount: number) => void
}

const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@digitalmoney.com',
    firstName: 'Demo',
    lastName: 'User',
    phone: '+5491123456789',
    cvu: generateCVU(),
    alias: generateAlias(),
    balance: 50000,
    createdAt: new Date(),
  }
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (credentials: AuthUser) => {
        await new Promise(resolve => setTimeout(resolve, 1000))

        const user = mockUsers.find(u => u.email === credentials.email)
        if (user && credentials.password === 'password123') {
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },

      register: async (userData: RegisterUser) => {
        await new Promise(resolve => setTimeout(resolve, 1000))

        if (userData.password !== userData.confirmPassword) {
          return false
        }

        const existingUser = mockUsers.find(u => u.email === userData.email)
        if (existingUser) {
          return false
        }

        const newUser: User = {
          id: String(mockUsers.length + 1),
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          cvu: generateCVU(),
          alias: generateAlias(),
          balance: 0,
          createdAt: new Date(),
        }

        mockUsers.push(newUser)
        set({ user: newUser, isAuthenticated: true })
        return true
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get()
        if (user) {
          const updatedUser = { ...user, ...updates }
          set({ user: updatedUser })

          const userIndex = mockUsers.findIndex(u => u.id === user.id)
          if (userIndex !== -1) {
            mockUsers[userIndex] = updatedUser
          }
        }
      },

      updateBalance: (amount: number) => {
        const { user } = get()
        if (user) {
          const updatedUser = { ...user, balance: user.balance + amount }
          set({ user: updatedUser })

          const userIndex = mockUsers.findIndex(u => u.id === user.id)
          if (userIndex !== -1) {
            mockUsers[userIndex] = updatedUser
          }
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)