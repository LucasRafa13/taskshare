export interface Comment {
  id: string
  content: string
  taskId: string
  userId: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
  }
}

export interface CreateCommentRequest {
  content: string
}

export interface UpdateCommentRequest {
  content: string
}

export interface CommentsResponse {
  success: boolean
  data: Comment[]
}

export interface CommentResponse {
  success: boolean
  data: Comment
}
