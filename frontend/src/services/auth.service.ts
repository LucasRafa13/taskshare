import { ApiService } from './api'
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
} from '../types'

class AuthService extends ApiService {
  async login(credentials: LoginRequest): Promise<AuthResponse['data']> {
    return this.post<AuthResponse['data']>('/auth/login', credentials)
  }

  async register(userData: RegisterRequest): Promise<AuthResponse['data']> {
    return this.post<AuthResponse['data']>('/auth/register', userData)
  }

  async getCurrentUser(): Promise<User> {
    return this.get<User>('/auth/me')
  }

  async refreshToken(data: RefreshTokenRequest): Promise<AuthResponse['data']> {
    return this.post<AuthResponse['data']>('/auth/refresh', data)
  }

  async logout(): Promise<void> {
    return this.post<void>('/auth/logout')
  }
}

export const authService = new AuthService()
export default authService
