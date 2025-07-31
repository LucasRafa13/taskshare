import { ApiService } from './api'
import {
  TaskList,
  CreateListRequest,
  UpdateListRequest,
  ShareListRequest,
} from '../types'

class ListService extends ApiService {
  /**
   * Get all lists (owned + shared)
   */
  async getLists(): Promise<TaskList[]> {
    return this.get<TaskList[]>('/lists')
  }

  /**
   * Get specific list by ID
   */
  async getList(id: string): Promise<TaskList> {
    return this.get<TaskList>(`/lists/${id}`)
  }

  /**
   * Create new list
   */
  async createList(data: CreateListRequest): Promise<TaskList> {
    return this.post<TaskList>('/lists', data)
  }

  async updateList(id: string, data: UpdateListRequest): Promise<TaskList> {
    return this.put<TaskList>(`/lists/${id}`, data)
  }

  async deleteList(id: string): Promise<void> {
    return this.delete<void>(`/lists/${id}`)
  }

  async shareList(listId: string, data: ShareListRequest): Promise<void> {
    return this.post<void>(`/lists/${listId}/share`, data)
  }

  async removeShare(listId: string, userId: string): Promise<void> {
    return this.delete<void>(`/lists/${listId}/share/${userId}`)
  }

  async archiveList(id: string): Promise<void> {
    return this.patch<void>(`/lists/${id}`, { isArchived: true })
  }
}

export const listService = new ListService()
export default listService
