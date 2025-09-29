import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'

describe('Card Component', () => {
  test('should render Card with children', () => {
    render(
      <Card data-testid="card">
        <div>Card Content</div>
      </Card>
    )

    const card = screen.getByTestId('card')
    expect(card).toBeInTheDocument()
    expect(screen.getByText('Card Content')).toBeInTheDocument()
  })

  test('should apply custom className', () => {
    render(
      <Card data-testid="card" className="custom-class">
        Content
      </Card>
    )

    const card = screen.getByTestId('card')
    expect(card).toHaveClass('custom-class')
  })

  test('should render CardHeader with title and description', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
      </Card>
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  test('should render CardContent', () => {
    render(
      <Card>
        <CardContent>
          <p>Content text</p>
        </CardContent>
      </Card>
    )

    expect(screen.getByText('Content text')).toBeInTheDocument()
  })

  test('should render CardFooter', () => {
    render(
      <Card>
        <CardFooter>
          <button>Footer Button</button>
        </CardFooter>
      </Card>
    )

    expect(screen.getByText('Footer Button')).toBeInTheDocument()
  })

  test('should render complete card structure', () => {
    render(
      <Card data-testid="complete-card">
        <CardHeader>
          <CardTitle>Complete Card</CardTitle>
          <CardDescription>This is a complete card example</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main content goes here</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    )

    const card = screen.getByTestId('complete-card')
    expect(card).toBeInTheDocument()
    expect(screen.getByText('Complete Card')).toBeInTheDocument()
    expect(screen.getByText('This is a complete card example')).toBeInTheDocument()
    expect(screen.getByText('Main content goes here')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  test('should forward ref correctly', () => {
    const ref = jest.fn()
    render(
      <Card ref={ref}>
        Content
      </Card>
    )

    expect(ref).toHaveBeenCalled()
  })
})