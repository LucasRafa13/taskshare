// API response types

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp?: string
}

export interface ApiError {
  success: false
  error: string
  timestamp: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta: PaginationMeta
}

// HTTP status codes
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const

export type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus]

// Request/Response interceptor types
export interface RequestConfig {
  headers?: Record<string, string>
  params?: Record<string, any>
}

export interface ErrorResponse {
  message: string
  status: number
  code?: string
}
