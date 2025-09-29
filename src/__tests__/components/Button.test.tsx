import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button Component', () => {
  test('renders button with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  test('applies default variant classes', () => {
    render(<Button data-testid="button">Default</Button>)
    const button = screen.getByTestId('button')
    expect(button).toHaveClass('bg-dmh-primary', 'text-dmh-secondary')
  })

  test('applies secondary variant classes', () => {
    render(<Button variant="secondary" data-testid="button">Secondary</Button>)
    const button = screen.getByTestId('button')
    expect(button).toHaveClass('bg-dmh-secondary', 'text-white')
  })

  test('applies outline variant classes', () => {
    render(<Button variant="outline" data-testid="button">Outline</Button>)
    const button = screen.getByTestId('button')
    expect(button).toHaveClass('border', 'border-dmh-primary', 'text-dmh-primary')
  })

  test('applies ghost variant classes', () => {
    render(<Button variant="ghost" data-testid="button">Ghost</Button>)
    const button = screen.getByTestId('button')
    expect(button).toHaveClass('text-dmh-gray-700')
  })

  test('applies destructive variant classes', () => {
    render(<Button variant="destructive" data-testid="button">Delete</Button>)
    const button = screen.getByTestId('button')
    expect(button).toHaveClass('bg-red-500', 'text-white')
  })

  test('applies small size classes', () => {
    render(<Button size="sm" data-testid="button">Small</Button>)
    const button = screen.getByTestId('button')
    expect(button).toHaveClass('h-10', 'px-4', 'text-sm')
  })

  test('applies large size classes', () => {
    render(<Button size="lg" data-testid="button">Large</Button>)
    const button = screen.getByTestId('button')
    expect(button).toHaveClass('h-14', 'px-8', 'text-lg')
  })

  test('shows loading spinner when isLoading is true', () => {
    render(<Button isLoading data-testid="button">Loading</Button>)
    const button = screen.getByTestId('button')
    expect(button.querySelector('.animate-spin')).toBeInTheDocument()
  })

  test('disables button when isLoading is true', () => {
    render(<Button isLoading data-testid="button">Loading</Button>)
    const button = screen.getByTestId('button')
    expect(button).toBeDisabled()
  })

  test('disables button when disabled prop is true', () => {
    render(<Button disabled data-testid="button">Disabled</Button>)
    const button = screen.getByTestId('button')
    expect(button).toBeDisabled()
  })

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick} data-testid="button">Click me</Button>)
    fireEvent.click(screen.getByTestId('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('does not call onClick when disabled', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick} disabled data-testid="button">Disabled</Button>)
    fireEvent.click(screen.getByTestId('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  test('applies custom className', () => {
    render(<Button className="custom-class" data-testid="button">Custom</Button>)
    const button = screen.getByTestId('button')
    expect(button).toHaveClass('custom-class')
  })

  test('forwards ref correctly', () => {
    const ref = jest.fn()
    render(<Button ref={ref}>Ref test</Button>)
    expect(ref).toHaveBeenCalled()
  })
})