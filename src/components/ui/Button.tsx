import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'default',
  size = 'default',
  isLoading = false,
  disabled,
  children,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

  const variants = {
    default: 'bg-dmh-primary text-dmh-secondary hover:bg-dmh-primary-dark focus-visible:ring-dmh-primary',
    secondary: 'bg-dmh-secondary text-white hover:bg-dmh-secondary-light focus-visible:ring-dmh-secondary',
    outline: 'border border-dmh-primary bg-transparent text-dmh-primary hover:bg-dmh-primary hover:text-dmh-secondary focus-visible:ring-dmh-primary',
    ghost: 'hover:bg-dmh-gray-100 text-dmh-gray-700 hover:text-dmh-secondary focus-visible:ring-dmh-primary',
    destructive: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500'
  }

  const sizes = {
    default: 'h-12 px-6 py-3',
    sm: 'h-10 px-4 py-2 text-sm',
    lg: 'h-14 px-8 py-4 text-lg'
  }

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-current"></div>
      )}
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export { Button }