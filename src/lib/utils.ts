import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function generateCVU(): string {
  const randomNumbers = Math.floor(Math.random() * 10000000000000000000).toString().padStart(22, '0')
  return randomNumbers.substring(0, 22)
}

export function maskCardNumber(cardNumber: string): string {
  if (cardNumber.length <= 4) return cardNumber
  return `**** **** **** ${cardNumber.slice(-4)}`
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateCardNumber(cardNumber: string): boolean {
  const cleanNumber = cardNumber.replace(/\s/g, '')
  return /^\d{16}$/.test(cleanNumber)
}

export function validateCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv)
}

export function generateAlias(): string {
  const words = [
    'AGUA', 'AIRE', 'AMOR', 'AZUL', 'CASA', 'CIELO', 'FUEGO', 'LUNA', 'MAR', 'PAZ',
    'ROCA', 'SOL', 'VIDA', 'VIENTO', 'ARBOL', 'FLOR', 'NUBE', 'HIERBA', 'ESTRELLA', 'MONTANA',
    'RIO', 'LAGO', 'ARENA', 'CAMPO', 'TIERRA', 'PIEDRA', 'HOJA', 'RAMA', 'RAIZ', 'FRUTO'
  ]

  const getRandomWord = () => words[Math.floor(Math.random() * words.length)]
  return `${getRandomWord()}.${getRandomWord()}.${getRandomWord()}`
}

export function getCardType(cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'cabal' | 'naranja' | 'unknown' {
  const cleanNumber = cardNumber.replace(/\s/g, '')

  if (cleanNumber.startsWith('4')) {
    return 'visa'
  }

  if (cleanNumber.startsWith('34') || cleanNumber.startsWith('37')) {
    return 'amex'
  }

  if (cleanNumber.startsWith('60') || cleanNumber.startsWith('61') || cleanNumber.startsWith('62')) {
    return 'cabal'
  }

  if (cleanNumber.startsWith('58') || cleanNumber.startsWith('59')) {
    return 'naranja'
  }

  if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) {
    return 'mastercard'
  }

  return 'unknown'
}

export function getCardTypeName(type: string): string {
  const types = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    cabal: 'Cabal',
    naranja: 'Naranja',
    unknown: 'Desconocida'
  }

  return types[type as keyof typeof types] || 'Desconocida'
}