import React from 'react'

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text = 'Carregando...',
  fullScreen = false,
  className = '',
}) => {
  const spinnerClasses = [
    sizeClasses[size],
    'border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin',
    className,
  ].join(' ')

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-4'

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className="flex flex-col items-center space-y-3">
        <div className={spinnerClasses} aria-hidden="true" />
        {text && <p className="text-sm text-gray-600 font-medium">{text}</p>}
      </div>
      <span className="sr-only">{text}</span>
    </div>
  )
}

export interface SkeletonProps {
  className?: string
  lines?: number
  height?: number
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  lines = 1,
  height = 16,
}) => {
  return (
    <div className={`animate-pulse ${className}`} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={`bg-gray-200 rounded ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          } ${i > 0 ? 'mt-2' : ''}`}
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  )
}

export const Spinner: React.FC<{
  size?: 'sm' | 'md' | 'lg'
  className?: string
}> = ({ size = 'md', className = '' }) => {
  return (
    <div
      className={`${sizeClasses[size]} border-2 border-current border-t-transparent rounded-full animate-spin ${className}`}
      aria-hidden="true"
    />
  )
}

export default Loading
