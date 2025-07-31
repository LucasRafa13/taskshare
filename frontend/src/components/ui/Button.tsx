import React from 'react'
import type { LucideIcon } from 'lucide-react'

// Button variants following Design System principles
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'ghost'
  | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  isFullWidth?: boolean
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  children: React.ReactNode
  as?: React.ElementType
  to?: string
}

// Style mappings using Tailwind classes
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white shadow-sm',
  secondary:
    'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white shadow-sm',
  danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white shadow-sm',
  ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500 text-gray-700',
  outline:
    'bg-transparent border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 text-gray-700',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

const disabledStyles =
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-current'

/**
 * Accessible Button component following SOLID principles
 * - Single Responsibility: Only handles button rendering and interactions
 * - Open/Closed: Extended through props without modification
 * - Liskov Substitution: Can replace any button element
 * - Interface Segregation: Props are specific to button needs
 * - Dependency Inversion: Depends on abstractions (props) not concretions
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isFullWidth = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      disabled,
      className = '',
      children,
      type = 'button',
      as: Component = 'button',
      ...props
    },
    ref,
  ) => {
    const baseStyles = [
      'inline-flex items-center justify-center',
      'font-medium rounded-lg',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:pointer-events-none',
      disabledStyles,
    ].join(' ')

    const computedClassName = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      isFullWidth ? 'w-full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const isDisabled = disabled || isLoading

    return (
      <Component
        ref={ref}
        type={Component === 'button' ? type : undefined}
        disabled={isDisabled}
        className={computedClassName}
        aria-disabled={isDisabled}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <div className="mr-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Left icon */}
        {!isLoading && LeftIcon && (
          <LeftIcon className="mr-2 h-4 w-4" aria-hidden="true" />
        )}

        {/* Button content */}
        <span>{children}</span>

        {/* Right icon */}
        {!isLoading && RightIcon && (
          <RightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
        )}
      </Component>
    )
  },
)

Button.displayName = 'Button'

export default Button
