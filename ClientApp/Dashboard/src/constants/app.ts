// Application Constants

export const APP_CONFIG = {
  NAME: 'Community Car AI Dashboard',
  VERSION: '1.0.0',
  DESCRIPTION: 'Advanced AI-powered community car management platform',
  AUTHOR: 'Community Car AI Team',
  SUPPORT_EMAIL: 'support@communitycar.ai',
  DOCUMENTATION_URL: 'https://docs.communitycar.ai'
} as const;

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ANALYTICS: '/analytics',
  AI_AGENT: '/ai-agent',
  CONTENT: '/content',
  USERS: '/users',
  CUSTOMERS: '/customers',
  PRODUCTS: '/products',
  SETTINGS: '/settings',
  SYSTEM: '/system',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password'
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  DASHBOARD_LAYOUT: 'dashboard_layout'
} as const;

export const PERMISSIONS = {
  // User Management
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  
  // Content Management
  CONTENT_VIEW: 'content:view',
  CONTENT_CREATE: 'content:create',
  CONTENT_EDIT: 'content:edit',
  CONTENT_DELETE: 'content:delete',
  CONTENT_MODERATE: 'content:moderate',
  
  // AI Agent
  AI_AGENT_VIEW: 'ai_agent:view',
  AI_AGENT_CONFIGURE: 'ai_agent:configure',
  AI_AGENT_TRAIN: 'ai_agent:train',
  
  // Analytics
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',
  
  // System
  SYSTEM_VIEW: 'system:view',
  SYSTEM_CONFIGURE: 'system:configure',
  SYSTEM_BACKUP: 'system:backup'
} as const;

export const USER_ROLES = [
  { value: 'admin', label: 'Administrator' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'editor', label: 'Editor' },
  { value: 'user', label: 'User' }
] as const;

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
] as const;

export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  WITH_TIME: 'MMM dd, yyyy HH:mm',
  TIME_ONLY: 'HH:mm',
  ISO: 'yyyy-MM-dd'
} as const;

export const FILE_TYPES = {
  IMAGES: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  DOCUMENTS: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
  SPREADSHEETS: ['.xls', '.xlsx', '.csv'],
  ARCHIVES: ['.zip', '.rar', '.7z', '.tar', '.gz'],
  DATASETS: ['.json', '.csv', '.txt', '.parquet']
} as const;

export const MAX_FILE_SIZES = {
  AVATAR: 5 * 1024 * 1024,      // 5MB
  DOCUMENT: 50 * 1024 * 1024,   // 50MB
  DATASET: 100 * 1024 * 1024,   // 100MB
  BACKUP: 1024 * 1024 * 1024    // 1GB
} as const;

export const NOTIFICATION_TYPES = [
  'system',
  'user_activity',
  'content_update',
  'ai_training',
  'security_alert',
  'maintenance'
] as const;