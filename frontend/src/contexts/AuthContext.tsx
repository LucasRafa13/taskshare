import React, { createContext, useContext, useReducer, useEffect } from 'react'
import {
  User,
  AuthContextType,
  LoginRequest,
  RegisterRequest,
  AuthState,
} from '../types'
import { authService } from '../services/auth.service'
import { STORAGE_KEYS } from '../utils/constants'
import toast from 'react-hot-toast'

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | {
      type: 'SET_TOKENS'
      payload: { accessToken: string; refreshToken: string }
    }
  | { type: 'LOGOUT' }

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  isLoading: true,
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'SET_USER':
      return { ...state, user: action.payload, isLoading: false }

    case 'SET_TOKENS':
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      }

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
      }

    default:
      return state
  }
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const useAuthContext = useAuth

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false })
        return
      }

      try {
        const user = await authService.getCurrentUser()
        dispatch({ type: 'SET_USER', payload: user })
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        dispatch({ type: 'LOGOUT' })
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      const response = await authService.login(credentials)
      const { user, tokens } = response

      // Store tokens and user data
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))

      dispatch({ type: 'SET_TOKENS', payload: tokens })
      dispatch({ type: 'SET_USER', payload: user })

      toast.success(`Bem-vindo, ${user.name}!`)
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      const message =
        error instanceof Error ? error.message : 'Erro ao fazer login'
      toast.error(message)
      throw error
    }
  }

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      const response = await authService.register(userData)
      const { user, tokens } = response

      // Store tokens and user data
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))

      dispatch({ type: 'SET_TOKENS', payload: tokens })
      dispatch({ type: 'SET_USER', payload: user })

      toast.success(`Conta criada com sucesso! Bem-vindo, ${user.name}!`)
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      const message =
        error instanceof Error ? error.message : 'Erro ao criar conta'
      toast.error(message)
      throw error
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always clear local storage and state
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)

      dispatch({ type: 'LOGOUT' })
      toast.success('Logout realizado com sucesso')
    }
  }

  // Refresh token function
  const refreshToken = async (): Promise<void> => {
    try {
      const refreshTokenValue = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
      if (!refreshTokenValue) {
        throw new Error('No refresh token available')
      }

      const response = await authService.refreshToken({
        refreshToken: refreshTokenValue,
      })
      const { tokens } = response

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken)

      dispatch({ type: 'SET_TOKENS', payload: tokens })
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
      throw error
    }
  }

  const value: AuthContextType = {
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: !!state.user && !!state.accessToken,
    login,
    register,
    logout,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
