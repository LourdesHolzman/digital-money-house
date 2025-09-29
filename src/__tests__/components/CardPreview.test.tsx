import { render, screen } from '@testing-library/react'
import { CardPreview } from '@/components/ui/CardPreview'

describe('CardPreview Component', () => {
  test('renders with default values when no props provided', () => {
    render(<CardPreview />)
    expect(screen.getByText('6011 1234 5678 9012')).toBeInTheDocument()
    expect(screen.getByText('MAURICIO BRITO')).toBeInTheDocument()
    expect(screen.getByText('20/28')).toBeInTheDocument()
  })

  test('displays provided card number with formatting', () => {
    render(<CardPreview cardNumber="1234567890123456" />)
    expect(screen.getByText('1234 5678 9012 3456')).toBeInTheDocument()
  })

  test('displays provided cardholder name in uppercase', () => {
    render(<CardPreview cardHolder="juan perez" />)
    expect(screen.getByText('JUAN PEREZ')).toBeInTheDocument()
  })

  test('displays provided expiry date', () => {
    render(<CardPreview expiryDate="12/25" />)
    expect(screen.getByText('12/25')).toBeInTheDocument()
  })

  test('shows VISA logo for card numbers starting with 4', () => {
    render(<CardPreview cardNumber="4111111111111111" />)
    expect(screen.getByText('VISA')).toBeInTheDocument()
  })

  test('shows Mastercard logo for card numbers starting with 5', () => {
    render(<CardPreview cardNumber="5555555555554444" />)
    const circles = document.querySelectorAll('.bg-red-500, .bg-yellow-400')
    expect(circles).toHaveLength(2)
  })

  test('shows CABAL logo for card numbers starting with 60', () => {
    render(<CardPreview cardNumber="6011111111111111" />)
    expect(screen.getByText('CABAL')).toBeInTheDocument()
  })

  test('shows NARANJA logo for card numbers starting with 58', () => {
    render(<CardPreview cardNumber="5811111111111111" />)
    expect(screen.getByText('NARANJA')).toBeInTheDocument()
  })

  test('shows American Express logo for card numbers starting with 34', () => {
    render(<CardPreview cardNumber="341111111111111" />)
    expect(screen.getByText('AMERICAN EXPRESS')).toBeInTheDocument()
  })

  test('shows back of card when flipped is true', () => {
    render(<CardPreview flipped={true} />)
    expect(document.querySelector('.bg-black')).toBeInTheDocument()
    expect(screen.getByText(/CVV:/)).toBeInTheDocument()
  })

  test('shows provided CVV on back of card', () => {
    render(<CardPreview flipped={true} cvv="123" />)
    expect(screen.getByText('CVV: 123')).toBeInTheDocument()
  })

  test('shows default CVV placeholder on back when no CVV provided', () => {
    render(<CardPreview flipped={true} />)
    expect(screen.getByText('CVV: ***')).toBeInTheDocument()
  })

  test('shows security text on back of card', () => {
    render(<CardPreview flipped={true} />)
    expect(screen.getByText(/This card has been issued by your bank/)).toBeInTheDocument()
  })

  test('formats card number with spaces every 4 digits', () => {
    render(<CardPreview cardNumber="1234567890123456" />)
    expect(screen.getByText('1234 5678 9012 3456')).toBeInTheDocument()
  })

  test('handles partial card numbers', () => {
    render(<CardPreview cardNumber="1234" />)
    expect(screen.getByText('1234')).toBeInTheDocument()
  })

  test('uses default CABAL logo for unknown card types', () => {
    render(<CardPreview cardNumber="9999999999999999" />)
    expect(screen.getByText('CABAL')).toBeInTheDocument()
  })
})