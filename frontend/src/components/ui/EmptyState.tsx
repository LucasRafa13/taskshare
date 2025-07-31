import React from 'react'
import type { LucideIcon } from 'lucide-react'
import Button from './Button'

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
  className?: string
}


const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && (
        <div className="flex justify-center mb-4">
          <Icon className="w-12 h-12 text-gray-400" />
        </div>
      )}

      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

      {description && (
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      )}

      {action && (
        <Button
          onClick={action.onClick}
          leftIcon={action.icon}
          variant="primary"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
