// API Constants

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email'
  },
  
  // User Management
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    AVATAR: '/users/avatar',
    PREFERENCES: '/users/preferences'
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    ANALYTICS: '/dashboard/analytics',
    ACTIVITIES: '/dashboard/activities'
  },
  
  // AI Agent
  AI_AGENT: {
    BASE: '/ai-agent',
    CHAT: '/ai-agent/chat',
    TRAINING: '/ai-agent/training',
    MODELS: '/ai-agent/models',
    DATASETS: '/ai-agent/datasets',
    CONFIG: '/ai-agent/config'
  },
  
  // Analytics
  ANALYTICS: {
    BASE: '/analytics',
    USERS: '/analytics/users',
    CONTENT: '/analytics/content',
    SYSTEM: '/analytics/system',
    EXPORT: '/analytics/export'
  },
  
  // Content Management
  CONTENT: {
    POSTS: '/content/posts',
    COMMENTS: '/content/comments',
    MODERATION: '/content/moderation'
  },
  
  // System
  SYSTEM: {
    HEALTH: '/system/health',
    METRICS: '/system/metrics',
    LOGS: '/system/logs',
    BACKUP: '/system/backup'
  },

  // Shared
  SHARED: {
    NOTIFICATIONS: '/shared/notifications',
    SETTINGS: '/shared/settings',
    SEARCH: '/shared/search'
  }
} as const;

export const HTTP_METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE'
] as const;

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
} as const;

export const REQUEST_TIMEOUTS = {
  DEFAULT: 30000,
  UPLOAD: 120000,
  DOWNLOAD: 300000,
  TRAINING: 600000
} as const;

export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  BACKOFF_MULTIPLIER: 2
} as const;

export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  DASHBOARD_STATS: 'dashboard_stats',
  AI_MODELS: 'ai_models',
  SYSTEM_HEALTH: 'system_health'
} as const;

export const CACHE_DURATIONS = {
  SHORT: 5 * 60 * 1000,    // 5 minutes
  MEDIUM: 30 * 60 * 1000,  // 30 minutes
  LONG: 2 * 60 * 60 * 1000 // 2 hours
} as const;

export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
  TEXT: 'text/plain',
  CSV: 'text/csv',
  PDF: 'application/pdf'
} as const;