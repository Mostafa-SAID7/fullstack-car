// API Configuration

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification'
  },
  
  // User Management
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    UPLOAD_AVATAR: '/users/avatar',
    SECURITY_LOGS: '/users/security-logs',
    SESSIONS: '/users/sessions'
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_ACTIVITY: '/dashboard/recent-activity',
    NOTIFICATIONS: '/dashboard/notifications'
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
    BASE: '/services',
    PROVIDERS: '/services/providers',
    BOOKINGS: '/services/bookings',
    CATEGORIES: '/services/categories',
    REVIEWS: '/services/reviews'
  },
  
  // Products
  PRODUCTS: {
    BASE: '/products',
    CATEGORIES: '/products/categories',
    INVENTORY: '/products/inventory',
    REVIEWS: '/products/reviews'
  },
  
  // Customers
  CUSTOMERS: {
    BASE: '/customers',
    ORDERS: '/customers/orders',
    PREFERENCES: '/customers/preferences'
  },
  
  // Content Management
  CONTENT: {
    MEDIA: '/content/media',
    LOCALIZATION: '/content/localization',
    THEMES: '/content/themes',
    PAGES: '/content/pages'
  },
  
  // AI Agent
  AI_AGENT: {
    CHAT: '/ai-agent/chat',
    MODELS: '/ai-agent/models',
    TRAINING: '/ai-agent/training',
    KNOWLEDGE: '/ai-agent/knowledge',
    SETTINGS: '/ai-agent/settings'
  },
  
  // System
  SYSTEM: {
    HEALTH: '/system/health',
    METRICS: '/system/metrics',
    LOGS: '/system/logs',
    BACKUP: '/system/backup',
    SETTINGS: '/system/settings'
  },
  
  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: '/notifications/mark-read',
    MARK_ALL_READ: '/notifications/mark-all-read',
    SETTINGS: '/notifications/settings'
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