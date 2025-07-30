import { prisma } from "@/config/database";
import {
  CreateListRequest,
  UpdateListRequest,
  ShareListRequest,
  ListResponse,
} from "@/types/list.types";
import { AppError } from "@/middleware/error.middleware";

export class ListService {
  async create(userId: string, data: CreateListRequest): Promise<ListResponse> {
    const list = await prisma.taskList.create({
      data: {
        title: data.title,
        description: data.description ?? undefined,
        color: data.color || "#3B82F6",
        ownerId: userId,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { tasks: true, shares: true },
        },
      },
    });

    return {
      id: list.id,
      title: list.title,
      description: list.description ?? undefined,
      color: list.color ?? "#3B82F6",
      isArchived: list.isArchived,
      ownerId: list.ownerId,
      createdAt: list.createdAt.toISOString(),
      updatedAt: list.updatedAt.toISOString(),
      owner: list.owner,
      _count: list._count,
    };
  }

  async getAll(userId: string) {
    const lists = await prisma.taskList.findMany({
      where: {
        OR: [{ ownerId: userId }, { shares: { some: { userId } } }],
        isArchived: false,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        shares: {
          where: { userId },
          select: { permission: true },
        },
        _count: {
          select: { tasks: true, shares: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return lists.map((list) => ({
      id: list.id,
      title: list.title,
      description: list.description ?? undefined,
      color: list.color,
      isArchived: list.isArchived,
      ownerId: list.ownerId,
      createdAt: list.createdAt.toISOString(),
      updatedAt: list.updatedAt.toISOString(),
      owner: list.owner,
      _count: list._count,
      permission:
        list.ownerId === userId
          ? "OWNER"
          : list.shares[0]?.permission || "READ",
    }));
  }

  async getById(listId: string, userId: string) {
    const list = await prisma.taskList.findFirst({
      where: {
        id: listId,
        OR: [{ ownerId: userId }, { shares: { some: { userId } } }],
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        shares: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        _count: {
          select: { tasks: true },
        },
      },
    });

    if (!list) {
      throw new AppError("Lista não encontrada", 404);
    }

    const userShare = list.shares.find((share) => share.userId === userId);
    const permission =
      list.ownerId === userId ? "OWNER" : userShare?.permission || "READ";

    return {
      id: list.id,
      title: list.title,
      description: list.description ?? undefined,
      color: list.color,
      isArchived: list.isArchived,
      ownerId: list.ownerId,
      createdAt: list.createdAt.toISOString(),
      updatedAt: list.updatedAt.toISOString(),
      owner: list.owner,
      _count: list._count,
      permission,
      shares: list.shares.map((share) => ({
        id: share.id,
        userId: share.userId,
        permission: share.permission,
        createdAt: share.createdAt.toISOString(),
        user: share.user,
      })),
    };
  }

  async update(listId: string, userId: string, data: UpdateListRequest) {
    await this.checkPermission(listId, userId, "WRITE");

    const updated = await prisma.taskList.update({
      where: { id: listId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.color && { color: data.color }),
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { tasks: true, shares: true },
        },
      },
    });

    return {
      id: updated.id,
      title: updated.title,
      description: updated.description ?? undefined,
      color: updated.color,
      isArchived: updated.isArchived,
      ownerId: updated.ownerId,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      owner: updated.owner,
      _count: updated._count,
    };
  }

  async delete(listId: string, userId: string) {
    await this.checkOwnership(listId, userId);

    await prisma.taskList.delete({
      where: { id: listId },
    });
  }

  async share(listId: string, userId: string, data: ShareListRequest) {
    await this.checkOwnership(listId, userId);

    if (data.userId === userId) {
      throw new AppError("Você não pode compartilhar com você mesmo", 400);
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!targetUser) {
      throw new AppError("Usuário não encontrado", 404);
    }

    const existingShare = await prisma.listShare.findUnique({
      where: {
        listId_userId: {
          listId,
          userId: data.userId,
        },
      },
    });

    if (existingShare) {
      await prisma.listShare.update({
        where: { id: existingShare.id },
        data: { permission: data.permission },
      });
    } else {
      await prisma.listShare.create({
        data: {
          listId,
          userId: data.userId,
          permission: data.permission,
        },
      });
    }

    return { message: "Lista compartilhada com sucesso" };
  }

  async unshare(listId: string, userId: string, targetUserId: string) {
    await this.checkOwnership(listId, userId);

    await prisma.listShare.deleteMany({
      where: {
        listId,
        userId: targetUserId,
      },
    });

    return { message: "Compartilhamento removido com sucesso" };
  }

  private async checkOwnership(listId: string, userId: string) {
    const list = await prisma.taskList.findUnique({
      where: { id: listId },
      select: { ownerId: true },
    });

    if (!list) {
      throw new AppError("Lista não encontrada", 404);
    }

    if (list.ownerId !== userId) {
      throw new AppError("Apenas o proprietário pode realizar esta ação", 403);
    }

    return list;
  }

  private async checkPermission(
    listId: string,
    userId: string,
    requiredPermission: "READ" | "WRITE",
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
        (requiredPermission === "WRITE" && userShare.permission === "READ"))
    ) {
      throw new AppError("Permissão insuficiente", 403);
    }

    return list;
  }
}
