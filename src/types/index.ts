export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  cvu: string
  alias: string
  balance: number
  createdAt: Date
}

export interface PaymentMethod {
  id: string
  userId: string
  type: 'credit' | 'debit'
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cvv: string
  isDefault: boolean
  createdAt: Date
}

export interface Transaction {
  id: string
  operationNumber: string
  userId: string
  type: 'deposit' | 'payment' | 'transfer'
  amount: number
  description: string
  destination?: string
  status: 'pending' | 'completed' | 'failed'
  paymentMethodId?: string
  serviceId?: string
  createdAt: Date
}

export interface Service {
  id: string
  name: string
  category: string
  description: string
  logoUrl: string
  isActive: boolean
}

export interface ServicePayment {
  serviceId: string
  accountNumber: string
  amount: number
  paymentMethodId?: string
  useWalletBalance: boolean
}

export interface WalletRecharge {
  amount: number
  paymentMethodId: string
}

export interface AuthUser {
  email: string
  password: string
}

export interface RegisterUser {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone: string
  dni: string
}