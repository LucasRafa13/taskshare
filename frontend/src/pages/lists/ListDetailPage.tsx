import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useList } from '../../contexts/ListContext'
import { taskService } from '../../services/task.service'
import { userService } from '../../services/user.service.ts'
import { commentService } from '../../services/comment.service'
import { Comment } from '../../types'
import Button from '../../components/ui/Button'
import Card, { CardContent } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import EmptyState from '../../components/ui/EmptyState'
import Dropdown from '../../components/ui/Dropdown'
import Loading from '../../components/ui/Loading'
import { Task, CreateTaskRequest, Priority } from '../../types'
import {
  ArrowLeft,
  Plus,
  Share,
  MoreHorizontal,
  CheckSquare,
  AlertCircle,
  Users,
  Calendar,
  Edit,
  Trash2,
  MessageSquare,
} from 'lucide-react'
import toast from 'react-hot-toast'

const priorityConfig = {
  LOW: { label: 'Baixa', variant: 'success' as const, icon: '🟢' },
  MEDIUM: { label: 'Média', variant: 'warning' as const, icon: '🟡' },
  HIGH: { label: 'Alta', variant: 'danger' as const, icon: '🟠' },
  URGENT: { label: 'Urgente', variant: 'danger' as const, icon: '🔴' },
}

const ListDetailPage: React.FC = () => {
  const { listId } = useParams<{ listId: string }>()
  const navigate = useNavigate()
  const {
    currentList,
    fetchList,
    shareList,
    removeShare,
    updateList,
    deleteList,
  } = useList()
  const [comments, setComments] = useState<Comment[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false)
  const [newCommentText, setNewCommentText] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isEditListModalOpen, setIsEditListModalOpen] = useState(false)
  const [editingList, setEditingList] = useState<{
    title: string
    description: string
    color: string
  } | null>(null)

  const [newTaskData, setNewTaskData] = useState<CreateTaskRequest>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
  })
  const [shareData, setShareData] = useState({
    email: '',
    permission: 'READ' as 'READ' | 'WRITE',
  })
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')

  useEffect(() => {
    const loadData = async () => {
      if (!listId) return
      try {
        setIsLoading(true)
        await fetchList(listId)
        const listTasks = await taskService.getListTasks(listId)
        setTasks(listTasks)
      } catch (error) {
        toast.error('Erro ao carregar dados da lista')
        navigate('/lists')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [listId, fetchList, navigate])

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    overdue: tasks.filter(
      (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date(),
    ).length,
  }

  const handleAddTask = async () => {
    if (!newTaskData.title.trim() || !listId) return
    try {
      if (selectedTaskId) {
        const updatedTask = await taskService.updateTask(
          selectedTaskId,
          newTaskData,
        )
        setTasks((prev) =>
          prev.map((task) => (task.id === selectedTaskId ? updatedTask : task)),
        )
        toast.success('Tarefa atualizada com sucesso!')
      } else {
        const createdTask = await taskService.createTask(listId, newTaskData)
        setTasks((prev) => [...prev, createdTask])
        toast.success('Tarefa criada com sucesso!')
      }
      setIsAddTaskModalOpen(false)
      setSelectedTaskId(null)
      setNewTaskData({
        title: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: '',
      })
    } catch (error) {
      toast.error('Erro ao salvar tarefa')
    }
  }

  const toggleTaskComplete = async (taskId: string) => {
    try {
      const updatedTask = await taskService.toggleTask(taskId)
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task)),
      )
      toast.success(
        updatedTask.completed ? 'Tarefa concluída!' : 'Tarefa reaberta!',
      )
    } catch (error) {
      toast.error('Erro ao atualizar tarefa')
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return
    try {
      await taskService.deleteTask(taskId)
      setTasks((prev) => prev.filter((task) => task.id !== taskId))
      toast.success('Tarefa excluída com sucesso!')
    } catch (error) {
      toast.error('Erro ao excluir tarefa')
    }
  }

  const handleShareList = async () => {
    if (!shareData.email.trim() || !listId) return
    try {
      const user = await userService.getUserByEmail(shareData.email.trim())
      await shareList(listId, {
        userId: user.id,
        permission: shareData.permission,
      })
      setIsShareModalOpen(false)
      setShareData({ email: '', permission: 'READ' })
      toast.success('Lista compartilhada com sucesso!')
    } catch (error) {
      toast.error(
        'Erro ao compartilhar lista. Verifique se o email está correto.',
      )
    }
  }

  const handleRemoveShare = async (userId: string) => {
    if (
      !listId ||
      !confirm('Tem certeza que deseja remover o acesso desta pessoa?')
    )
      return
    try {
      await removeShare(listId, userId)
      toast.success('Acesso removido com sucesso!')
    } catch (error) {
      toast.error('Erro ao remover acesso')
    }
  }

  const handleOpenEditListModal = () => {
    if (!currentList) return
    setEditingList({
      title: currentList.title,
      description: currentList.description || '',
      color: currentList.color,
    })
    setIsEditListModalOpen(true)
  }

  const handleUpdateList = async () => {
    if (!editingList || !listId) return
    try {
      await updateList(listId, editingList)
      toast.success('Lista atualizada com sucesso!')
      setIsEditListModalOpen(false)
    } catch (error) {
      toast.error('Erro ao atualizar a lista')
    }
  }

  const handleDeleteList = async () => {
    if (
      !listId ||
      !confirm(
        'Tem certeza que deseja excluir esta lista? Esta ação não pode ser desfeita.',
      )
    )
      return
    try {
      await deleteList(listId)
      toast.success('Lista excluída com sucesso!')
      navigate('/lists')
    } catch (error) {
      toast.error('Erro ao excluir a lista')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.ceil(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    )
    if (diffInDays === 0) return 'Hoje'
    if (diffInDays === 1) return 'Amanhã'
    if (diffInDays === -1) return 'Ontem'
    if (diffInDays < 0) return `${Math.abs(diffInDays)} dias atrás`
    return `Em ${diffInDays} dias`
  }

  const listActions = [
    { label: 'Editar Lista', value: 'edit', icon: Edit },
    { label: 'Excluir Lista', value: 'delete', icon: Trash2 },
  ]

  const loadComments = async (taskId: string) => {
    try {
      const data = await commentService.getTaskComments(taskId)
      setComments(data)
      setSelectedTaskId(taskId)
      setIsCommentsModalOpen(true)
    } catch (err) {
      toast.error('Erro ao carregar comentários')
    }
  }

  const handleAddComment = async () => {
    if (!newCommentText.trim() || !selectedTaskId) return
    try {
      const comment = await commentService.createComment(selectedTaskId, {
        content: newCommentText.trim(),
      })
      setComments((prev) => [...prev, comment])
      setNewCommentText('')
    } catch (err) {
      toast.error('Erro ao adicionar comentário')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentService.deleteComment(commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (err) {
      toast.error('Erro ao deletar comentário')
    }
  }

  if (isLoading) {
    return <Loading fullScreen text="Carregando lista..." />
  }

  if (!currentList) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Lista não encontrada
          </h2>
          <Button onClick={() => navigate('/lists')} leftIcon={ArrowLeft}>
            Voltar às listas
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/lists')}
            leftIcon={ArrowLeft}
          >
            Voltar
          </Button>
          <div className="flex items-center space-x-3">
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: currentList.color }}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentList.title}
              </h1>
              {currentList.description && (
                <p className="text-gray-600 mt-1">{currentList.description}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {currentList.shares && currentList.shares.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {currentList.shares.slice(0, 3).map((share) => (
                  <Avatar
                    key={share.id}
                    name={share.user.name}
                    size="sm"
                    className="ring-2 ring-white"
                  />
                ))}
                {currentList.shares.length > 3 && (
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 ring-2 ring-white">
                    +{currentList.shares.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            {currentList.permission === 'OWNER' && (
              <Button
                onClick={() => setIsShareModalOpen(true)}
                leftIcon={Share}
                variant="outline"
                size="sm"
              >
                Compartilhar
              </Button>
            )}
            {(currentList.permission === 'OWNER' ||
              currentList.permission === 'WRITE') && (
              <Button
                onClick={() => {
                  setSelectedTaskId(null)
                  setNewTaskData({
                    title: '',
                    description: '',
                    priority: 'MEDIUM',
                    dueDate: '',
                  })
                  setIsAddTaskModalOpen(true)
                }}
                leftIcon={Plus}
                variant="primary"
                size="sm"
              >
                Nova Tarefa
              </Button>
            )}
            {currentList.permission === 'OWNER' && (
              <Dropdown
                trigger={
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                }
                items={listActions.map((action) => ({
                  ...action,
                  onClick: () => {
                    if (action.value === 'edit') {
                      handleOpenEditListModal()
                    } else if (action.value === 'delete') {
                      handleDeleteList()
                    }
                  },
                }))}
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
            <div className="text-sm text-gray-600">Concluídas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.overdue}
            </div>
            <div className="text-sm text-gray-600">Atrasadas</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Todas ({stats.total})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === 'pending'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pendentes ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === 'completed'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Concluídas ({stats.completed})
          </button>
        </div>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const priority = priorityConfig[task.priority]
            const isOverdue =
              !task.completed &&
              task.dueDate &&
              new Date(task.dueDate) < new Date()
            return (
              <Card
                key={task.id}
                variant={task.completed ? 'outlined' : 'default'}
                className={`transition-all hover:shadow-md ${
                  task.completed ? 'opacity-75' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        task.completed
                          ? 'bg-green-600 border-green-600 text-white'
                          : 'border-gray-300 hover:border-green-500'
                      }`}
                      disabled={currentList.permission === 'READ'}
                    >
                      {task.completed && <CheckSquare className="w-3 h-3" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-medium ${
                              task.completed
                                ? 'text-gray-500 line-through'
                                : 'text-gray-900'
                            }`}
                          >
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                        {(currentList.permission === 'OWNER' ||
                          currentList.permission === 'WRITE') && (
                          <Dropdown
                            trigger={
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            }
                            items={[
                              { label: 'Editar', value: 'edit', icon: Edit },
                              {
                                label: 'Comentários',
                                value: 'comments',
                                icon: MessageSquare,
                              },
                              {
                                label: 'Excluir',
                                value: 'delete',
                                icon: Trash2,
                              },
                            ].map((action) => ({
                              ...action,
                              onClick: () => {
                                if (action.value === 'edit') {
                                  setNewTaskData({
                                    title: task.title,
                                    description: task.description || '',
                                    priority: task.priority,
                                    dueDate: task.dueDate
                                      ? task.dueDate.slice(0, 10)
                                      : '',
                                  })
                                  setSelectedTaskId(task.id)
                                  setIsAddTaskModalOpen(true)
                                } else if (action.value === 'delete') {
                                  handleDeleteTask(task.id)
                                } else if (action.value === 'comments') {
                                  loadComments(task.id)
                                }
                              },
                            }))}
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <Badge variant={priority.variant} size="sm">
                          <span className="mr-1">{priority.icon}</span>
                          {priority.label}
                        </Badge>
                        {task.dueDate && (
                          <div
                            className={`flex items-center text-sm ${
                              isOverdue ? 'text-red-600' : 'text-gray-500'
                            }`}
                          >
                            {isOverdue && (
                              <AlertCircle className="w-4 h-4 mr-1" />
                            )}
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(task.dueDate)}
                          </div>
                        )}
                        {(task._count?.comments || 0) > 0 && (
                          <div className="flex items-center text-sm text-gray-500">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {task._count?.comments}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={CheckSquare}
          title={
            filter === 'all'
              ? 'Nenhuma tarefa encontrada'
              : filter === 'pending'
              ? 'Nenhuma tarefa pendente'
              : 'Nenhuma tarefa concluída'
          }
          description={
            filter === 'all'
              ? 'Comece adicionando sua primeira tarefa'
              : filter === 'pending'
              ? 'Parabéns! Todas as tarefas foram concluídas'
              : 'Complete algumas tarefas para vê-las aqui'
          }
          action={
            filter !== 'completed' &&
            (currentList.permission === 'OWNER' ||
              currentList.permission === 'WRITE')
              ? {
                  label: 'Adicionar Tarefa',
                  onClick: () => setIsAddTaskModalOpen(true),
                  icon: Plus,
                }
              : undefined
          }
        />
      )}

      <Modal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        title={selectedTaskId ? 'Editar Tarefa' : 'Nova Tarefa'}
        size="md"
      >
        <div className="space-y-6">
          <Input
            label="Título da tarefa"
            value={newTaskData.title}
            onChange={(e) =>
              setNewTaskData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Ex: Implementar login"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição (opcional)
            </label>
            <textarea
              value={newTaskData.description}
              onChange={(e) =>
                setNewTaskData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Detalhes da tarefa..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <select
                value={newTaskData.priority}
                onChange={(e) =>
                  setNewTaskData((prev) => ({
                    ...prev,
                    priority: e.target.value as Priority,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
                <option value="URGENT">Urgente</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prazo (opcional)
              </label>
              <input
                type="date"
                value={newTaskData.dueDate}
                onChange={(e) =>
                  setNewTaskData((prev) => ({
                    ...prev,
                    dueDate: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setIsAddTaskModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddTask}
              leftIcon={Plus}
              disabled={!newTaskData.title.trim()}
            >
              {selectedTaskId ? 'Salvar Alterações' : 'Criar Tarefa'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Compartilhar Lista"
        size="md"
      >
        <div className="space-y-6">
          <Input
            label="Email do usuário"
            value={shareData.email}
            onChange={(e) =>
              setShareData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="usuario@email.com"
            leftIcon={Users}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permissão
            </label>
            <select
              value={shareData.permission}
              onChange={(e) =>
                setShareData((prev) => ({
                  ...prev,
                  permission: e.target.value as 'READ' | 'WRITE',
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="READ">Visualizar apenas</option>
              <option value="WRITE">Editar tarefas</option>
            </select>
          </div>
          {currentList.shares && currentList.shares.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Pessoas com acesso
              </h4>
              <div className="space-y-2">
                {currentList.shares.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar name={share.user.name} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {share.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {share.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" size="sm">
                        {share.permission === 'READ' ? 'Visualizar' : 'Editar'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveShare(share.user.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="ghost" onClick={() => setIsShareModalOpen(false)}>
              Fechar
            </Button>
            <Button
              leftIcon={Share}
              onClick={handleShareList}
              disabled={!shareData.email.trim()}
            >
              Compartilhar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isCommentsModalOpen}
        onClose={() => {
          setIsCommentsModalOpen(false)
          setComments([])
          setSelectedTaskId(null)
        }}
        title="Comentários da Tarefa"
        size="md"
      >
        <div className="space-y-4">
          <div className="max-h-64 overflow-y-auto space-y-2">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-2 bg-gray-100 rounded flex justify-between items-start"
              >
                <div>
                  <p className="text-sm font-medium">{comment.user.name}</p>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
                <button
                  className="text-sm text-red-500"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Escreva um comentário..."
            />
            <Button
              onClick={handleAddComment}
              disabled={!newCommentText.trim()}
            >
              Enviar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditListModalOpen}
        onClose={() => setIsEditListModalOpen(false)}
        title="Editar Lista"
        size="md"
      >
        {editingList && (
          <div className="space-y-4">
            <Input
              label="Título da Lista"
              value={editingList.title}
              onChange={(e) =>
                setEditingList((prev) => ({ ...prev!, title: e.target.value }))
              }
            />
            <Input
              label="Descrição (opcional)"
              value={editingList.description}
              onChange={(e) =>
                setEditingList((prev) => ({
                  ...prev!,
                  description: e.target.value,
                }))
              }
            />
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor
              </label>
              <Input
                type="color"
                value={editingList.color}
                onChange={(e) =>
                  setEditingList((prev) => ({
                    ...prev!,
                    color: e.target.value,
                  }))
                }
                className="w-full h-10 p-1"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="ghost"
                onClick={() => setIsEditListModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleUpdateList}>Salvar Alterações</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ListDetailPage
