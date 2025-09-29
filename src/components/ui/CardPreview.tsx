'use client'

import { getCardType } from '@/lib/utils'

interface CardPreviewProps {
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  cvv?: string
  type?: 'credit' | 'debit'
  flipped?: boolean
}

export function CardPreview({ cardNumber = '', cardHolder = '', expiryDate = '', cvv = '', flipped = false }: CardPreviewProps) {
  const cardType = getCardType(cardNumber.replace(/\s/g, ''))

  const displayNumber = cardNumber ?
    cardNumber.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim() :
    '6011 1234 5678 9012'

  const displayHolder = cardHolder.toUpperCase() || 'MAURICIO BRITO'
  const displayExpiry = expiryDate || '20/28'

  const getCardLogo = () => {
    switch (cardType) {
      case 'visa':
        return (
          <div className="text-white font-bold text-lg tracking-wider italic">
            VISA
          </div>
        )
      case 'mastercard':
        return (
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 bg-red-500 rounded-full opacity-80"></div>
            <div className="w-6 h-6 bg-yellow-400 rounded-full opacity-80 -ml-3"></div>
          </div>
        )
      case 'amex':
        return (
          <div className="text-white font-bold text-sm tracking-wider">
            AMERICAN EXPRESS
          </div>
        )
      case 'cabal':
        return (
          <div className="text-white font-bold text-lg tracking-wider">
            CABAL
          </div>
        )
      case 'naranja':
        return (
          <div className="text-orange-400 font-bold text-lg tracking-wider">
            NARANJA
          </div>
        )
      default:
        return (
          <div className="text-white font-bold text-lg tracking-wider">
            CABAL
          </div>
        )
    }
  }

  if (flipped) {
    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="relative w-full h-52 rounded-lg bg-gray-700 text-white p-6 shadow-lg transition-all duration-300">
          <div className="w-full h-8 bg-black mt-4 mb-6"></div>

          <div className="flex justify-end mb-4">
            <div className="bg-white text-black px-2 py-1 text-sm font-mono">
              CVV: {cvv || '***'}
            </div>
          </div>

          <div className="text-xs text-gray-300 mt-8">
            This card has been issued by your bank and is protected by various security features.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative w-full h-52 rounded-lg bg-gray-800 text-white p-6 shadow-lg transition-all duration-300">

        <div className="flex justify-end mb-6">
          {getCardLogo()}
        </div>

        <div className="mb-8">
          <div className="text-xl font-mono font-medium tracking-wider transition-all duration-300">
            {displayNumber}
          </div>
        </div>

        {/* Card holder and expiry */}
        <div className="flex justify-between items-end">
          <div>
            <div className="text-sm font-medium tracking-wide transition-all duration-300">
              {displayHolder}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium transition-all duration-300">
              {displayExpiry}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}