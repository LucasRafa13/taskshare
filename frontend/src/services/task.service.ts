import { ApiService } from './api'
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  ReorderTasksRequest,
} from '../types'

class TaskService extends ApiService {
  async getListTasks(listId: string): Promise<Task[]> {
    return this.get<Task[]>(`/list/${listId}/tasks`)
  }

  async getTask(id: string): Promise<Task> {
    return this.get<Task>(`/task/${id}`)
  }

  async createTask(listId: string, data: CreateTaskRequest): Promise<Task> {
    return this.post<Task>(`/list/${listId}/tasks`, data)
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    return this.put<Task>(`/task/${id}`, data)
  }

  async toggleTask(id: string): Promise<Task> {
    return this.patch<Task>(`/task/${id}/toggle`)
  }

  async deleteTask(id: string): Promise<void> {
    return this.delete<void>(`/task/${id}`)
  }

  async reorderTasks(listId: string, data: ReorderTasksRequest): Promise<void> {
    return this.patch<void>(`/list/${listId}/reorder`, data)
  }
}

export const taskService = new TaskService()
export default taskService
