import React from 'react'
import type { LucideIcon } from 'lucide-react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  isFullWidth?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      isFullWidth = true,
      className = '',
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${inputId}-error` : undefined

    const baseClasses = [
      'px-3 py-2 border rounded-lg',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
      'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
      'transition-colors duration-200',
    ]

    const paddingClasses = []
    if (LeftIcon) paddingClasses.push('pl-10')
    if (RightIcon) paddingClasses.push('pr-10')

    const borderClasses = error ? 'border-red-300' : 'border-gray-300'
    const widthClasses = isFullWidth ? 'w-full' : ''

    const inputClasses = [
      ...baseClasses,
      ...paddingClasses,
      borderClasses,
      widthClasses,
      className,
    ].join(' ')

    return (
      <div className={isFullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {LeftIcon && (
            <LeftIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}

          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            aria-describedby={errorId}
            aria-invalid={!!error}
            {...props}
          />

          {RightIcon && (
            <RightIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}
        </div>

        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
