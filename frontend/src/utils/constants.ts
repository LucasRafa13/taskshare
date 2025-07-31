export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'TaskShare',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  LISTS: '/lists',
  LIST_DETAIL: '/lists/:listId',
  TASK_DETAIL: '/tasks/:taskId',
} as const

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'taskshare_access_token',
  REFRESH_TOKEN: 'taskshare_refresh_token',
  USER: 'taskshare_user',
  THEME: 'taskshare_theme',
} as const

export const PRIORITY_LABELS = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  URGENT: 'Urgente',
} as const

export const PRIORITY_COLORS = {
  LOW: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
  },
  MEDIUM: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
  },
  HIGH: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
  },
  URGENT: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
  },
} as const

export const PERMISSION_LABELS = {
  READ: 'Visualizar',
  WRITE: 'Editar',
  OWNER: 'Proprietário',
} as const

export const DEFAULT_LIST_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray
] as const

export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
} as const

export const DATE_FORMATS = {
  SHORT: 'MMM dd',
  LONG: 'MMMM dd, yyyy',
  TIME: 'HH:mm',
  DATETIME: 'MMM dd, yyyy HH:mm',
} as const

export const QUERY_KEYS = {
  LISTS: 'lists',
  LIST: 'list',
  TASKS: 'tasks',
  TASK: 'task',
  USER: 'user',
} as const
