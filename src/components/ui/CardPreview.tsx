'use client'

import { getCardType } from '@/lib/utils'

interface CardPreviewProps {
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  type?: 'credit' | 'debit'
}

export function CardPreview({ cardNumber = '', cardHolder = '', expiryDate = '' }: CardPreviewProps) {
  const cardType = getCardType(cardNumber.replace(/\s/g, ''))

  const displayNumber = cardNumber ?
    cardNumber.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim() :
    '4720 3900 0000 0000'

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
      default:
        return (
          <div className="text-white font-bold text-lg tracking-wider italic">
            VISA
          </div>
        )
    }
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