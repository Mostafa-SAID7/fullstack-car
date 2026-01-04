// API Constants

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/v1/auth/login',
    REGISTER: '/v1/auth/register',
    REFRESH: '/v1/auth/refresh-token',
    LOGOUT: '/v1/auth/logout',
    FORGOT_PASSWORD: '/v1/auth/forgot-password',
    RESET_PASSWORD: '/v1/auth/reset-password',
    VERIFY_EMAIL: '/v1/auth/verify-email'
  },
  
  // User Management
  USERS: {
    BASE: '/v1/users',
    PROFILE: '/v1/users/profile',
    AVATAR: '/v1/users/avatar',
    PREFERENCES: '/v1/users/preferences'
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/v1/dashboard/stats',
    ANALYTICS: '/v1/dashboard/analytics',
    ACTIVITIES: '/v1/dashboard/activities'
  },

  // AI Agent
  AI_AGENT: {
    BASE: '/v1/ai-agent',
    CHAT: '/v1/ai-agent/chat',
    TRAINING: '/v1/ai-agent/training',
    MODELS: '/v1/ai-agent/models',
    DATASETS: '/v1/ai-agent/datasets',
    CONFIG: '/v1/ai-agent/config'
  },

  // Analytics
  ANALYTICS: {
    BASE: '/v1/analytics',
    SITE: '/v1/analytics/site',
    PERFORMANCE: '/v1/analytics/performance',
    SEO: '/v1/analytics/seo',
    ONEPAGE: '/v1/analytics/onepage',
    REALTIME: '/v1/analytics/realtime',
    AUDIT: '/v1/analytics/audit',
    KEYWORDS: '/v1/analytics/keywords',
    BACKLINKS: '/v1/analytics/backlinks',
    JOURNEY: '/v1/analytics/journey',
    SETTINGS: '/v1/analytics/settings',
    TEST_GA: '/v1/analytics/test-google-analytics',
    USERS: '/v1/analytics/users',
    CONTENT: '/v1/analytics/content',
    SYSTEM: '/v1/analytics/system',
    EXPORT: '/v1/analytics/export'
  },

  // Content Management
  CONTENT: {
    POSTS: '/v1/content/posts',
    COMMENTS: '/v1/content/comments',
    MODERATION: '/v1/content/moderation'
  },

  // System
  SYSTEM: {
    HEALTH: '/v1/system/health',
    METRICS: '/v1/system/metrics',
    LOGS: '/v1/system/logs',
    BACKUP: '/v1/system/backup'
  },

  // Shared
  SHARED: {
    NOTIFICATIONS: '/v1/shared/notifications',
    SETTINGS: '/v1/shared/settings',
    SEARCH: '/v1/shared/search'
  },

  // Theme Management
  THEME: {
    BASE: '/v1/theme',
    PREFERENCES: '/v1/theme/preferences',
    THEMES: '/v1/theme/themes',
    CUSTOM: '/v1/theme/custom',
    STATS: '/v1/theme/stats',
    EXPORT: '/v1/theme/export',
    IMPORT: '/v1/theme/import',
    RESET: '/v1/theme/reset'
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