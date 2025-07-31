// Task types based on the API documentation

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: Priority
  dueDate?: string
  listId: string
  position: number
  createdAt: string
  updatedAt: string
  _count?: {
    comments: number
  }
}

export interface CreateTaskRequest {
  title: string
  description?: string
  priority?: Priority
  dueDate?: string
  position?: number
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  priority?: Priority
  dueDate?: string
  position?: number
  completed?: boolean
}

export interface ReorderTasksRequest {
  taskIds: string[]
}

export interface TasksResponse {
  success: boolean
  data: Task[]
}

export interface TaskResponse {
  success: boolean
  data: Task
}

export interface TaskFilter {
  completed?: boolean
  priority?: Priority
  search?: string
  dueDate?: 'overdue' | 'today' | 'week' | 'month'
}

export interface TaskStats {
  total: number
  completed: number
  pending: number
  overdue: number
  byPriority: {
    low: number
    medium: number
    high: number
    urgent: number
  }
}
