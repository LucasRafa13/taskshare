import React from 'react'
import { useParams } from 'react-router-dom'
import { CheckSquare } from 'lucide-react'

const TaskDetailPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Detalhes da Tarefa</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          Tarefa ID: {taskId}
        </h2>
        <p className="text-gray-600">
          Esta página será implementada para mostrar os detalhes da tarefa e
          comentários.
        </p>
      </div>
    </div>
  )
}

export default TaskDetailPage
