import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { Home, ArrowLeft } from 'lucide-react'

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Página não encontrada
          </h2>
          <p className="text-gray-600">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="space-y-4">
          <Button as={Link} to="/dashboard" leftIcon={Home} className="w-full">
            Voltar ao Dashboard
          </Button>

          <Button
            as={Link}
            to="/"
            variant="ghost"
            leftIcon={ArrowLeft}
            className="w-full"
          >
            Página Inicial
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
