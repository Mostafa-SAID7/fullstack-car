// Application Constants

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  DASHBOARD_LAYOUT: 'dashboard_layout',
  RECENT_SEARCHES: 'recent_searches',
  FILTERS: 'filters',
  SORT_PREFERENCES: 'sort_preferences'
} as const;

export const APP_CONFIG = {
  NAME: 'Community Car Dashboard',
  VERSION: '1.0.0',
  API_VERSION: 'v1',
  DEFAULT_LANGUAGE: 'en',
  DEFAULT_THEME: 'light',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
  }
} as const;

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  USERS: '/administration/users',
  ANALYTICS: '/administration/analytics',
  SYSTEM: '/administration/system',
  SERVICES: '/management/services',
  PRODUCTS: '/management/products',
  CUSTOMERS: '/management/customers',
  CONTENT: '/content',
  MEDIA: '/content/media',
  LOCALIZATION: '/content/localization',
  THEMES: '/content/themes',
  AI_AGENT: '/ai-agent'
} as const;

export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;