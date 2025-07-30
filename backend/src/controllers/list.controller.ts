import { Response, NextFunction } from "express";
import { AuthRequest } from "@/types";
import { ListService } from "@/services/list.service";
import { successResponse } from "@/utils/response.util";

const listService = new ListService();

export class ListController {
  async create(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const result = await listService.create(req.user!.id, req.body);
      return successResponse(res, result, "Lista criada com sucesso", 201);
    } catch (error) {
      return next(error);
    }
  }

  async getAll(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const result = await listService.getAll(req.user!.id);
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
      if (!id) return next(new Error("Parâmetro 'id' é obrigatório"));
      const result = await listService.getById(id, req.user!.id);
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
      if (!id) return next(new Error("Parâmetro 'id' é obrigatório"));
      const result = await listService.update(id, req.user!.id, req.body);
      return successResponse(res, result, "Lista atualizada com sucesso");
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
      if (!id) return next(new Error("Parâmetro 'id' é obrigatório"));
      await listService.delete(id, req.user!.id);
      return successResponse(res, null, "Lista excluída com sucesso");
    } catch (error) {
      return next(error);
    }
  }

  async share(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { id } = req.params;
      if (!id) return next(new Error("Parâmetro 'id' é obrigatório"));
      const result = await listService.share(id, req.user!.id, req.body);
      return successResponse(res, result);
    } catch (error) {
      return next(error);
    }
  }

  async unshare(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { id, userId } = req.params;
      if (!id || !userId)
        return next(new Error("Parâmetros 'id' e 'userId' são obrigatórios"));
      const result = await listService.unshare(id, req.user!.id, userId);
      return successResponse(res, result);
    } catch (error) {
      return next(error);
    }
  }
}
