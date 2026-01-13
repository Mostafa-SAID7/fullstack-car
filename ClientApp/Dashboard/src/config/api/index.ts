// API Configuration

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5100/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/v1/auth/login',
    REGISTER: '/v1/auth/register',
    LOGOUT: '/v1/auth/logout',
    REFRESH: '/v1/auth/refresh-token',
    CONFIRM_EMAIL: '/v1/auth/confirm-email',
    RESEND_CONFIRMATION: '/v1/auth/resend-email-confirmation',
    REVOKE_TOKEN: '/v1/auth/revoke-token'
  },

  // OAuth
  OAUTH: {
    GOOGLE: '/v1/oauth/google',
    GITHUB: '/v1/oauth/github',
    FACEBOOK: '/v1/oauth/facebook',
    CALLBACK: '/v1/oauth/callback',
    EXTERNAL_LOGINS: '/v1/oauth/external-logins'
  },

  // Password Management
  PASSWORD: {
    CHANGE: '/v1/password/change',
    FORGOT: '/v1/password/forgot',
    RESET: '/v1/password/reset',
    VALIDATE: '/v1/password/validate',
    STRENGTH: '/v1/password/strength'
  },

  // User Profile
  PROFILE: {
    BASE: '/v1/profile',
    AVATAR: '/v1/profile/avatar',
    PRIVACY: '/v1/profile/privacy',
    DEACTIVATE: '/v1/profile/deactivate',
    DELETE: '/v1/profile/delete'
  },

  // User Management
  USERS: {
    BASE: '/v1/users',
    PROFILE: '/v1/users/profile',
    UPDATE_PROFILE: '/v1/users/profile',
    CHANGE_PASSWORD: '/v1/users/change-password',
    UPLOAD_AVATAR: '/v1/users/avatar',
    SECURITY_LOGS: '/v1/users/security-logs',
    SESSIONS: '/v1/users/sessions'
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/v3/admin/dashboard',
    RECENT_ACTIVITY: '/v3/admin/dashboard/recent-activity',
    NOTIFICATIONS: '/v3/admin/dashboard/alerts'
  },

  // Analytics
  ANALYTICS: {
    BASE: '/analytics',
    SITE: '/analytics/site',
    PERFORMANCE: '/analytics/performance',
    SEO: '/analytics/seo',
    CONVERSION: '/analytics/conversion',
    BEHAVIOR: '/analytics/behavior',
    CONTENT: '/analytics/content',
    EXPORT: '/analytics/export',
    SETTINGS: '/analytics/settings'
  },

  // Services
  SERVICES: {
    BASE: '/v6/marketplace/services',
    PROVIDERS: '/v6/marketplace/service-providers',
    BOOKINGS: '/v6/marketplace/services/bookings',
    CATEGORIES: '/v6/marketplace/services/categories',
    REVIEWS: '/v6/marketplace/services/reviews',
    SEARCH: '/v6/marketplace/services/search',
    LOCATION: '/v6/marketplace/services/search/location'
  },

  // Products
  PRODUCTS: {
    BASE: '/v6/marketplace/products',
    CATEGORIES: '/v6/marketplace/products/categories',
    INVENTORY: '/v6/marketplace/products/inventory',
    REVIEWS: '/v6/marketplace/products/reviews',
    SEARCH: '/v6/marketplace/products/search',
    ANALYTICS: '/v6/marketplace/products/analytics'
  },

  // Customers
  CUSTOMERS: {
    BASE: '/v3/marketplace/customers',
    ORDERS: '/v3/marketplace/customers/orders',
    PREFERENCES: '/v3/marketplace/customers/preferences',
    ANALYTICS: '/v3/marketplace/customers/analytics',
    LOYALTY: '/v3/marketplace/customers/loyalty',
    SEGMENTS: '/v3/marketplace/customers/segments'
  },

  // Marketplace Integration
  MARKETPLACE: {
    BASE: '/v6/marketplace',
    DASHBOARD: '/v6/marketplace/dashboard',
    ORDERS: '/v6/marketplace/orders',
    TRANSACTIONS: '/v6/marketplace/transactions',
    ANALYTICS: '/v6/marketplace/analytics',
    REPORTS: '/v6/marketplace/reports',
    INTEGRATION: '/v6/marketplace/integration'
  },

  // Content Management
  CONTENT: {
    MEDIA: '/v7/content/media',
    LOCALIZATION: '/v4/shared/localization',
    THEMES: '/v4/content/themes',
    PAGES: '/v4/content/pages'
  },

  // Localization (v7 API)
  LOCALIZATION: {
    BASE: '/v7/localization',
    TRANSLATIONS: '/v7/localization/translations',
    BATCH_TRANSLATIONS: '/v7/localization/translations/batch',
    SUPPORTED_CULTURES: '/v7/localization/cultures/supported',
    TRANSLATION_BY_CULTURE_FEATURE: '/v7/localization/translations/{culture}/{feature}',
    CACHE_INVALIDATION: '/v7/localization/cache/invalidate'
  },

  // AI Agent
  AI_AGENT: {
    CHAT: '/v4/ai-agent/chat',
    MODELS: '/v4/ai-agent/models',
    TRAINING: '/v4/ai-agent/training',
    KNOWLEDGE: '/v4/ai-agent/knowledge',
    SETTINGS: '/v4/ai-agent/settings'
  },

  // System
  SYSTEM: {
    HEALTH: '/v4/health',
    METRICS: '/v4/system/metrics',
    LOGS: '/v4/system/logs',
    BACKUP: '/v4/system/backup',
    SETTINGS: '/v4/system/settings'
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: '/v4/shared/notifications',
    MARK_READ: '/v4/shared/notifications/mark-read',
    MARK_ALL_READ: '/v4/shared/notifications/mark-all-read',
    SETTINGS: '/v4/shared/notifications/settings'
  }
} as const;

export const REQUEST_TIMEOUTS = {
  DEFAULT: 10000, // 10 seconds
  UPLOAD: 60000, // 1 minute
  DOWNLOAD: 120000, // 2 minutes
  LONG_RUNNING: 300000 // 5 minutes
} as const;

export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  BACKOFF_FACTOR: 2
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
} as const;