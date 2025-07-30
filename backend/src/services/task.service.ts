import { prisma } from "@/config/database";
import {
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskResponse,
} from "@/types/task.types";
import { AppError } from "@/middleware/error.middleware";

export class TaskService {
  async create(
    listId: string,
    userId: string,
    data: CreateTaskRequest,
  ): Promise<TaskResponse> {
    await this.checkListPermission(listId, userId, "WRITE");

    const maxPosition = await prisma.task.findFirst({
      where: { listId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority || "MEDIUM",
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        position: data.position ?? (maxPosition?.position || 0) + 1,
        listId,
      },
      include: {
        _count: {
          select: { comments: true },
        },
      },
    });

    return {
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      completed: task.completed,
      priority: task.priority,
      dueDate: task.dueDate?.toISOString(),
      listId: task.listId,
      position: task.position,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      _count: task._count,
    };
  }

  async getByListId(listId: string, userId: string) {
    await this.checkListPermission(listId, userId, "READ");

    const tasks = await prisma.task.findMany({
      where: { listId },
      include: {
        _count: {
          select: { comments: true },
        },
      },
      orderBy: [{ completed: "asc" }, { position: "asc" }],
    });

    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      completed: task.completed,
      priority: task.priority,
      dueDate: task.dueDate?.toISOString(),
      listId: task.listId,
      position: task.position,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      _count: task._count,
    }));
  }

  async getById(taskId: string, userId: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        list: {
          select: { id: true, ownerId: true, shares: { where: { userId } } },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    if (!task) {
      throw new AppError("Tarefa não encontrada", 404);
    }

    const hasAccess =
      task.list.ownerId === userId || task.list.shares.length > 0;
    if (!hasAccess) {
      throw new AppError("Permissão insuficiente", 403);
    }

    return {
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      completed: task.completed,
      priority: task.priority,
      dueDate: task.dueDate?.toISOString(),
      listId: task.listId,
      position: task.position,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      _count: task._count,
    };
  }

  async update(taskId: string, userId: string, data: UpdateTaskRequest) {
    await this.getTaskWithPermission(taskId, userId, "WRITE");

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.priority && { priority: data.priority }),
        ...(data.dueDate !== undefined && {
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        }),
        ...(data.position !== undefined && { position: data.position }),
      },
      include: {
        _count: {
          select: { comments: true },
        },
      },
    });

    return {
      id: updated.id,
      title: updated.title,
      description: updated.description || undefined,
      completed: updated.completed,
      priority: updated.priority,
      dueDate: updated.dueDate?.toISOString(),
      listId: updated.listId,
      position: updated.position,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      _count: updated._count,
    };
  }

  async toggle(taskId: string, userId: string) {
    const task = await this.getTaskWithPermission(taskId, userId, "WRITE");

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { completed: !task.completed },
      include: {
        _count: {
          select: { comments: true },
        },
      },
    });

    return {
      id: updated.id,
      title: updated.title,
      description: updated.description || undefined,
      completed: updated.completed,
      priority: updated.priority,
      dueDate: updated.dueDate?.toISOString(),
      listId: updated.listId,
      position: updated.position,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      _count: updated._count,
    };
  }

  async delete(taskId: string, userId: string) {
    await this.getTaskWithPermission(taskId, userId, "WRITE");

    await prisma.task.delete({
      where: { id: taskId },
    });
  }

  async reorder(listId: string, userId: string, taskIds: string[]) {
    await this.checkListPermission(listId, userId, "WRITE");

    const tasks = await prisma.task.findMany({
      where: { listId, id: { in: taskIds } },
      select: { id: true },
    });

    if (tasks.length !== taskIds.length) {
      throw new AppError("Algumas tarefas não foram encontradas", 400);
    }

    await prisma.$transaction(
      taskIds.map((taskId, index) =>
        prisma.task.update({
          where: { id: taskId },
          data: { position: index + 1 },
        }),
      ),
    );

    return { message: "Tarefas reordenadas com sucesso" };
  }

  private async checkListPermission(
    listId: string,
    userId: string,
    permission: "READ" | "WRITE",
  ) {
    const list = await prisma.taskList.findFirst({
      where: {
        id: listId,
        OR: [{ ownerId: userId }, { shares: { some: { userId } } }],
      },
      include: {
        shares: {
          where: { userId },
          select: { permission: true },
        },
      },
    });

    if (!list) {
      throw new AppError("Lista não encontrada", 404);
    }

    const isOwner = list.ownerId === userId;
    const userShare = list.shares[0];

    if (
      !isOwner &&
      (!userShare ||
        (permission === "WRITE" && userShare.permission === "READ"))
    ) {
      throw new AppError("Permissão insuficiente", 403);
    }

    return list;
  }

  private async getTaskWithPermission(
    taskId: string,
    userId: string,
    permission: "READ" | "WRITE",
  ) {
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

    const isOwner = task.list.ownerId === userId;
    const userShare = task.list.shares[0];

    if (
      !isOwner &&
      (!userShare ||
        (permission === "WRITE" && userShare.permission === "READ"))
    ) {
      throw new AppError("Permissão insuficiente", 403);
    }

    return task;
  }
}
