import { Priority } from "@prisma/client";

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  position?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  position?: number;
}

export interface TaskResponse {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  listId: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  _count: {
    comments: number;
  };
}
