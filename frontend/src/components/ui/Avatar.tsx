import React from 'react'
import { User } from 'lucide-react'

export interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
}

const iconSizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
}


const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className = '',
}) => {
  const baseClasses = [
    'rounded-full flex items-center justify-center font-medium',
    'bg-blue-100 text-blue-600',
    sizeClasses[size],
    className,
  ].join(' ')

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={`${baseClasses} object-cover`}
      />
    )
  }

  if (name) {
    return <div className={baseClasses}>{getInitials(name)}</div>
  }

  return (
    <div className={baseClasses}>
      <User className={iconSizeClasses[size]} />
    </div>
  )
}

export default Avatar
