import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { errorResponse } from "@/utils/response.util";

// Middleware para validar o corpo (body) da requisição
export function validateBody(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    const { error } = schema.validate(req.body);
    if (error?.details?.[0]?.message) {
      return errorResponse(res, error.details[0].message, 400);
    }
    return next();
  };
}

// Middleware para validar parâmetros de rota (params)
export function validateParams(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    const { error } = schema.validate(req.params);
    if (error?.details?.[0]?.message) {
      return errorResponse(res, error.details[0].message, 400);
    }
    return next();
  };
}

// Middleware para validar query strings
export function validateQuery(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    const { error } = schema.validate(req.query);
    if (error?.details?.[0]?.message) {
      return errorResponse(res, error.details[0].message, 400);
    }
    return next();
  };
}

// Esquemas de validação para autenticação
export const authSchemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

// Esquemas de validação para listas
export const listSchemas = {
  create: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    description: Joi.string().max(1000).optional(),
    color: Joi.string()
      .pattern(/^#[0-9A-F]{6}$/i)
      .optional(),
  }),

  update: Joi.object({
    title: Joi.string().min(1).max(200).optional(),
    description: Joi.string().max(1000).optional(),
    color: Joi.string()
      .pattern(/^#[0-9A-F]{6}$/i)
      .optional(),
  }),

  share: Joi.object({
    userId: Joi.string().required(),
    permission: Joi.string().valid("READ", "WRITE").required(),
  }),
};

// Esquemas de validação para tarefas
export const taskSchemas = {
  create: Joi.object({
    title: Joi.string().min(1).max(500).required(),
    description: Joi.string().max(2000).optional(),
    priority: Joi.string().valid("LOW", "MEDIUM", "HIGH", "URGENT").optional(),
    dueDate: Joi.date().iso().optional(),
    position: Joi.number().integer().min(0).optional(),
  }),

  update: Joi.object({
    title: Joi.string().min(1).max(500).optional(),
    description: Joi.string().max(2000).optional(),
    priority: Joi.string().valid("LOW", "MEDIUM", "HIGH", "URGENT").optional(),
    dueDate: Joi.date().iso().optional(),
    position: Joi.number().integer().min(0).optional(),
  }),
};

// Esquemas comuns para ID e paginação
export const commonSchemas = {
  id: Joi.object({
    id: Joi.string().required(),
  }),

  listId: Joi.object({
    listId: Joi.string().required(),
  }),

  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
};
