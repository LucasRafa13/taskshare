import { prisma } from "@/config/database";
import { AppError } from "@/middleware/error.middleware";

export interface CreateCommentRequest {
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface CommentResponse {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export class CommentService {
  async create(
    taskId: string,
    userId: string,
    data: CreateCommentRequest,
  ): Promise<CommentResponse> {
    await this.checkTaskAccess(taskId, userId);

    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        taskId,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return {
      id: comment.id,
      content: comment.content,
      taskId: comment.taskId,
      userId: comment.userId,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      user: comment.user,
    };
  }

  async getByTaskId(taskId: string, userId: string) {
    await this.checkTaskAccess(taskId, userId);

    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      taskId: comment.taskId,
      userId: comment.userId,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      user: comment.user,
    }));
  }

  async update(commentId: string, userId: string, data: UpdateCommentRequest) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        task: {
          include: {
            list: {
              include: {
                shares: {
                  where: { userId },
                  select: { permission: true },
                },
              },
            },
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!comment) {
      throw new AppError("Comentário não encontrado", 404);
    }

    if (comment.userId !== userId) {
      throw new AppError("Apenas o autor pode editar o comentário", 403);
    }

    const hasTaskAccess =
      comment.task.list.ownerId === userId ||
      comment.task.list.shares.length > 0;
    if (!hasTaskAccess) {
      throw new AppError("Acesso negado à tarefa", 403);
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content: data.content },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return {
      id: updated.id,
      content: updated.content,
      taskId: updated.taskId,
      userId: updated.userId,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      user: updated.user,
    };
  }

  async delete(commentId: string, userId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        task: {
          include: {
            list: {
              include: {
                shares: {
                  where: { userId },
                  select: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!comment) {
      throw new AppError("Comentário não encontrado", 404);
    }

    const isOwner = comment.task.list.ownerId === userId;
    const isAuthor = comment.userId === userId;
    const hasTaskAccess = isOwner || comment.task.list.shares.length > 0;

    if (!hasTaskAccess) {
      throw new AppError("Acesso negado à tarefa", 403);
    }

    if (!isOwner && !isAuthor) {
      throw new AppError(
        "Apenas o autor ou proprietário da lista pode excluir",
        403,
      );
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });
  }

  private async checkTaskAccess(taskId: string, userId: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        list: {
          include: {
            shares: {
              where: { userId },
              select: { permission: true },
            },
          },
        },
      },
    });

    if (!task) {
      throw new AppError("Tarefa não encontrada", 404);
    }

    const hasAccess =
      task.list.ownerId === userId || task.list.shares.length > 0;
    if (!hasAccess) {
      throw new AppError("Acesso negado à tarefa", 403);
    }

    return task;
  }
}
