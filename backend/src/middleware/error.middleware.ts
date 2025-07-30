import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { config } from "@/config/env";
import { errorResponse } from "@/utils/response.util";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function handleError(error: any, res: Response) {
  let statusCode = 500;
  let message = "Erro interno do servidor";

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        statusCode = 409;
        message = "Dados duplicados";
        break;
      case "P2025":
        statusCode = 404;
        message = "Registro não encontrado";
        break;
      default:
        message = "Erro no banco de dados";
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Dados inválidos";
  }

  if (config.app.nodeEnv === "development") {
    console.error("❌ Erro:", error);
  }

  return errorResponse(res, message, statusCode);
}

export function notFound(req: Request, next: NextFunction) {
  const error = new AppError(
    `Rota ${req.method} ${req.originalUrl} não encontrada`,
    404,
  );
  next(error);
}
