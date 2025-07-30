import { Response, NextFunction } from "express";
import { AuthRequest } from "@/types";
import { AuthService } from "@/services/auth.service";
import { successResponse } from "@/utils/response.util";

const authService = new AuthService();

export class AuthController {
  async register(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const result = await authService.register(req.body);
      return successResponse(
        res,
        result,
        "Usuário registrado com sucesso",
        201,
      );
    } catch (error) {
      return next(error);
    }
  }

  async login(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const result = await authService.login(req.body);
      return successResponse(res, result, "Login realizado com sucesso");
    } catch (error) {
      return next(error);
    }
  }

  async refreshToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      return successResponse(res, result, "Token renovado com sucesso");
    } catch (error) {
      return next(error);
    }
  }

  async logout(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await authService.logout(req.user!.id);
      return successResponse(res, null, "Logout realizado com sucesso");
    } catch (error) {
      return next(error);
    }
  }

  async getProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const result = await authService.getProfile(req.user!.id);
      return successResponse(res, result);
    } catch (error) {
      return next(error);
    }
  }
}
