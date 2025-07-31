import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { APP_CONFIG, STORAGE_KEYS } from '../utils/constants'
import { ApiResponse, ApiError } from '../types'

const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: APP_CONFIG.apiUrl,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config

      if (error.response?.status === 401 && originalRequest) {
        try {
          await refreshAuthToken()
          return instance(originalRequest)
        } catch (refreshError) {
          localStorage.clear()
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    },
  )

  return instance
}

const refreshAuthToken = async (): Promise<void> => {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await axios.post(`${APP_CONFIG.apiUrl}/auth/refresh`, {
    refreshToken,
  })

  const { accessToken, refreshToken: newRefreshToken } =
    response.data.data.tokens

  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken)
}

export const api = createApiInstance()

export class ApiService {
  protected instance: AxiosInstance

  constructor(instance: AxiosInstance = api) {
    this.instance = instance
  }

  protected async handleRequest<T>(
    request: Promise<AxiosResponse<ApiResponse<T>>>,
  ): Promise<T> {
    try {
      const response = await request

      if (!response.data.success) {
        throw new Error(response.data.error || 'Request failed')
      }

      return response.data.data as T
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError: ApiError = error.response?.data || {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        }
        throw new Error(apiError.error)
      }
      throw error
    }
  }

  protected async get<T>(
    url: string,
    params?: Record<string, any>,
  ): Promise<T> {
    return this.handleRequest(this.instance.get(url, { params }))
  }

  protected async post<T>(url: string, data?: any): Promise<T> {
    return this.handleRequest(this.instance.post(url, data))
  }

  protected async put<T>(url: string, data?: any): Promise<T> {
    return this.handleRequest(this.instance.put(url, data))
  }

  protected async patch<T>(url: string, data?: any): Promise<T> {
    return this.handleRequest(this.instance.patch(url, data))
  }

  protected async delete<T>(url: string): Promise<T> {
    return this.handleRequest(this.instance.delete(url))
  }
}

// Health check
export const healthCheck = async (): Promise<any> => {
  const response = await api.get('/health')
  return response.data
}

export default api
