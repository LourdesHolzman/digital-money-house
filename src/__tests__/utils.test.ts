import { formatCurrency, formatDate, generateAlias, getCardType, getCardTypeName } from '@/lib/utils'

describe('Utils Functions', () => {
  describe('formatCurrency', () => {
    test('should format currency correctly', () => {
      expect(formatCurrency(1000)).toBe('$1.000,00')
      expect(formatCurrency(1000000)).toBe('$1.000.000,00')
      expect(formatCurrency(0)).toBe('$0,00')
      expect(formatCurrency(12.5)).toBe('$12,50')
    })

    test('should handle negative numbers', () => {
      expect(formatCurrency(-1000)).toBe('-$1.000,00')
    })
  })

  describe('formatDate', () => {
    test('should format date correctly', () => {
      const date = new Date('2024-01-15T10:30:00')
      const formatted = formatDate(date)

      expect(formatted).toContain('15/01/2024')
      expect(formatted).toContain('10:30')
    })
  })

  describe('generateAlias', () => {
    test('should generate alias in correct format', () => {
      const alias = generateAlias()
      const parts = alias.split('.')

      expect(parts).toHaveLength(3)
      expect(parts[0]).toHaveLength(3)
      expect(parts[1]).toHaveLength(3)
      expect(parts[2]).toHaveLength(3)

      // Should only contain lowercase letters and numbers
      expect(alias).toMatch(/^[a-z0-9]{3}\.[a-z0-9]{3}\.[a-z0-9]{3}$/)
    })

    test('should generate different aliases each time', () => {
      const alias1 = generateAlias()
      const alias2 = generateAlias()

      expect(alias1).not.toBe(alias2)
    })
  })

  describe('getCardType', () => {
    test('should detect Visa cards', () => {
      expect(getCardType('4111111111111111')).toBe('visa')
      expect(getCardType('4000000000000002')).toBe('visa')
    })

    test('should detect Mastercard', () => {
      expect(getCardType('5555555555554444')).toBe('mastercard')
      expect(getCardType('5200000000000007')).toBe('mastercard')
    })

    test('should detect American Express', () => {
      expect(getCardType('378282246310005')).toBe('amex')
      expect(getCardType('371449635398431')).toBe('amex')
    })

    test('should return unknown for invalid cards', () => {
      expect(getCardType('1234567890123456')).toBe('unknown')
      expect(getCardType('invalid')).toBe('unknown')
      expect(getCardType('')).toBe('unknown')
    })
  })

  describe('getCardTypeName', () => {
    test('should return correct card type names', () => {
      expect(getCardTypeName('visa')).toBe('Visa')
      expect(getCardTypeName('mastercard')).toBe('Mastercard')
      expect(getCardTypeName('amex')).toBe('American Express')
      expect(getCardTypeName('unknown')).toBe('Desconocida')
    })
  })
})