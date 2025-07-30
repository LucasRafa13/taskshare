import { Response, NextFunction } from "express";
import { AuthRequest } from "@/types";
import { CommentService } from "@/services/comment.service";
import { successResponse } from "@/utils/response.util";
import { AppError } from "@/middleware/error.middleware";

const commentService = new CommentService();

export class CommentController {
  async create(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { taskId } = req.params;
      if (!taskId) throw new AppError("Parâmetro taskId ausente", 400);

      const result = await commentService.create(
        taskId,
        req.user!.id,
        req.body,
      );
      return successResponse(res, result, "Comentário criado com sucesso", 201);
    } catch (error) {
      return next(error);
    }
  }

  async getByTaskId(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { taskId } = req.params;
      if (!taskId) throw new AppError("Parâmetro taskId ausente", 400);

      const result = await commentService.getByTaskId(taskId, req.user!.id);
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
      if (!id) throw new AppError("Parâmetro id ausente", 400);

      const result = await commentService.update(id, req.user!.id, req.body);
      return successResponse(res, result, "Comentário atualizado com sucesso");
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
      if (!id) throw new AppError("Parâmetro id ausente", 400);

      await commentService.delete(id, req.user!.id);
      return successResponse(res, null, "Comentário excluído com sucesso");
    } catch (error) {
      return next(error);
    }
  }
}
