import { Response, NextFunction } from "express";
import { AuthRequest } from "@/types";
import { verifyToken, extractTokenFromHeader } from "@/utils/jwt.util";
import { errorResponse } from "@/utils/response.util";
import { prisma } from "@/config/database";

export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return errorResponse(res, "Token de acesso requerido", 401);
    }

    const decoded = verifyToken(token);

    if (decoded.type !== "access") {
      return errorResponse(res, "Tipo de token inválido", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return errorResponse(res, "Usuário não encontrado ou inativo", 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
    };

    return next();
  } catch (error: any) {
    return errorResponse(res, error.message || "Token inválido", 401);
  }
}

export function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const token = extractTokenFromHeader(req.headers.authorization);

  if (!token) {
    return next();
  }

  void authenticateToken(req, res, next);
}
