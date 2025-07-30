import { Response } from "express";
import { ApiResponse, PaginatedResponse } from "@/types";

export function successResponse<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200,
) {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
}

export function errorResponse(res: Response, error: string, statusCode = 400) {
  const response: ApiResponse = {
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
}

export function paginatedResponse<T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string,
) {
  const pages = Math.ceil(total / limit);

  const response: PaginatedResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    },
  };

  return res.json(response);
}
