import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useList } from '../../contexts/ListContext'
import Button from '../../components/ui/Button'
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Loading from '../../components/ui/Loading'
import { Plus, List as ListIcon, Users, Calendar } from 'lucide-react'

const DEFAULT_LIST_COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#F97316',
]

const ListsPage: React.FC = () => {
  const { lists, fetchLists, createList, isLoading } = useList()
  const navigate = useNavigate()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newListData, setNewListData] = useState({
    title: '',
    description: '',
    color: DEFAULT_LIST_COLORS[0],
  })
  const [filter, setFilter] = useState<'all' | 'owned' | 'shared'>('all')

  useEffect(() => {
    fetchLists()
  }, [fetchLists])

  const filteredLists = lists.filter((list) => {
    if (filter === 'owned') return list.permission === 'OWNER'
    if (filter === 'shared') return list.permission !== 'OWNER'
    return true
  })

  const handleCreateList = async () => {
    if (!newListData.title.trim()) return

    try {
      await createList(newListData)
      setIsCreateModalOpen(false)
      setNewListData({
        title: '',
        description: '',
        color: DEFAULT_LIST_COLORS[0],
      })
    } catch (error) {
      console.error('Failed to create list:', error)
    }
  }

  if (isLoading && lists.length === 0) {
    return <Loading fullScreen text="Carregando listas..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Listas</h1>
          <p className="text-gray-600 mt-1">Gerencie suas listas de tarefas</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Buttons */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('owned')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'owned'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Minhas
            </button>
            <button
              onClick={() => setFilter('shared')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'shared'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Compartilhadas
            </button>
          </div>

          {/* Create Button */}
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={Plus}
            variant="primary"
          >
            Nova Lista
          </Button>
        </div>
      </div>

      {/* Lists Grid */}
      {filteredLists.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLists.map((list) => (
            <Card
              key={list.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/lists/${list.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: list.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <CardTitle className="truncate">{list.title}</CardTitle>
                      {list.description && (
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {list.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {list.permission !== 'OWNER' && (
                    <Badge variant="secondary" size="sm">
                      <Users className="w-3 h-3 mr-1" />
                      Compartilhada
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {/* Stats */}
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tarefas</span>
                    <span className="text-sm font-medium text-gray-900">
                      {list._count?.tasks || 0}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Avatar name={list.owner.name} size="xs" />
                    <span className="text-gray-500 truncate">
                      {list.permission === 'OWNER' ? 'Você' : list.owner.name}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>
                      {new Date(list.updatedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ListIcon}
          title={
            filter === 'all'
              ? 'Nenhuma lista encontrada'
              : filter === 'owned'
              ? 'Você ainda não criou nenhuma lista'
              : 'Nenhuma lista compartilhada'
          }
          description={
            filter === 'all'
              ? 'Comece criando sua primeira lista de tarefas'
              : filter === 'owned'
              ? 'Crie sua primeira lista para organizar suas tarefas'
              : 'Aguarde alguém compartilhar uma lista com você'
          }
          action={
            filter !== 'shared'
              ? {
                  label: 'Criar Lista',
                  onClick: () => setIsCreateModalOpen(true),
                  icon: Plus,
                }
              : undefined
          }
        />
      )}

      {/* Create List Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Criar Nova Lista"
        size="md"
      >
        <div className="space-y-6">
          <Input
            label="Nome da lista"
            value={newListData.title}
            onChange={(e) =>
              setNewListData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Ex: Projeto Website"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição (opcional)
            </label>
            <textarea
              value={newListData.description}
              onChange={(e) =>
                setNewListData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Descreva o propósito desta lista..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor da lista
            </label>
            <div className="flex space-x-2">
              {DEFAULT_LIST_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewListData((prev) => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    newListData.color === color
                      ? 'border-gray-400 scale-110'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateList}
              leftIcon={Plus}
              disabled={!newListData.title.trim()}
              isLoading={isLoading}
            >
              Criar Lista
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ListsPage
