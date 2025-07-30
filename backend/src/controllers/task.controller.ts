import { Response, NextFunction } from "express";
import { AuthRequest } from "@/types";
import { TaskService } from "@/services/task.service";
import { successResponse } from "@/utils/response.util";

const taskService = new TaskService();

export class TaskController {
  async create(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { listId } = req.params;
      if (!listId) throw new Error("Parâmetro listId ausente");
      const result = await taskService.create(listId, req.user!.id, req.body);
      return successResponse(res, result, "Tarefa criada com sucesso", 201);
    } catch (error) {
      return next(error);
    }
  }

  async getByListId(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { listId } = req.params;
      if (!listId) throw new Error("Parâmetro listId ausente");
      const result = await taskService.getByListId(listId, req.user!.id);
      return successResponse(res, result);
    } catch (error) {
      return next(error);
    }
  }

  async getById(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { id } = req.params;
      if (!id) throw new Error("Parâmetro id ausente");
      const result = await taskService.getById(id, req.user!.id);
      return successResponse(res, result);
    } catch (error) {
      return next(error);
    }
  }

  async update(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { id } = req.params;
      if (!id) throw new Error("Parâmetro id ausente");
      const result = await taskService.update(id, req.user!.id, req.body);
      return successResponse(res, result, "Tarefa atualizada com sucesso");
    } catch (error) {
      return next(error);
    }
  }

  async toggle(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { id } = req.params;
      if (!id) throw new Error("Parâmetro id ausente");
      const result = await taskService.toggle(id, req.user!.id);
      return successResponse(res, result, "Tarefa atualizada com sucesso");
    } catch (error) {
      return next(error);
    }
  }

  async delete(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { id } = req.params;
      if (!id) throw new Error("Parâmetro id ausente");
      await taskService.delete(id, req.user!.id);
      return successResponse(res, null, "Tarefa excluída com sucesso");
    } catch (error) {
      return next(error);
    }
  }

  async reorder(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { listId } = req.params;
      if (!listId) throw new Error("Parâmetro listId ausente");
      const { taskIds } = req.body;
      const result = await taskService.reorder(listId, req.user!.id, taskIds);
      return successResponse(res, result);
    } catch (error) {
      return next(error);
    }
  }
}
