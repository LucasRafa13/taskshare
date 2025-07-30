import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";
import { errorResponse } from "@/utils/response.util";

export function validateBody(
  schema: ObjectSchema,
): (req: Request, res: Response, next: NextFunction) => Response | void {
  return (req, res, next) => {
    const result = schema.validate(req.body, { abortEarly: false });

    if (result.error) {
      const message = result.error.details?.[0]?.message || "Dados inválidos";
      return errorResponse(res, message, 400);
    }

    return next();
  };
}

export function validateParams(
  schema: ObjectSchema,
): (req: Request, res: Response, next: NextFunction) => Response | void {
  return (req, res, next) => {
    const result = schema.validate(req.params, { abortEarly: false });

    if (result.error) {
      const message =
        result.error.details?.[0]?.message || "Parâmetros inválidos";
      return errorResponse(res, message, 400);
    }

    return next();
  };
}

export function validateQuery(
  schema: ObjectSchema,
): (req: Request, res: Response, next: NextFunction) => Response | void {
  return (req, res, next) => {
    const result = schema.validate(req.query, { abortEarly: false });

    if (result.error) {
      const message = result.error.details?.[0]?.message || "Query inválida";
      return errorResponse(res, message, 400);
    }

    return next();
  };
}

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

export const commonSchemas = {
  id: Joi.object({
    id: Joi.string().required(),
  }),
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
};
