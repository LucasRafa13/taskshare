import { ApiService } from './api'
import { Comment, CreateCommentRequest, UpdateCommentRequest } from '../types'

class CommentService extends ApiService {
  async getTaskComments(taskId: string): Promise<Comment[]> {
    return this.get<Comment[]>(`/task/${taskId}/comments`)
  }

  async createComment(
    taskId: string,
    data: CreateCommentRequest,
  ): Promise<Comment> {
    return this.post<Comment>(`/task/${taskId}/comments`, data)
  }

  async updateComment(
    id: string,
    data: UpdateCommentRequest,
  ): Promise<Comment> {
    return this.put<Comment>(`/comment/${id}`, data)
  }

  async deleteComment(id: string): Promise<void> {
    return this.delete<void>(`/comment/${id}`)
  }
}

export const commentService = new CommentService()
export default commentService
