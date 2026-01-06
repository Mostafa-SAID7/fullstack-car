// API Endpoints Configuration

import { API_CONFIG } from './base';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_CONFIG.baseURL}/v1/auth/login`,
    LOGOUT: `${API_CONFIG.baseURL}/v1/auth/logout`,
    REFRESH: `${API_CONFIG.baseURL}/v1/auth/refresh-token`,
    PROFILE: `${API_CONFIG.baseURL}/v1/auth/profile`,
    VERIFY_EMAIL: `${API_CONFIG.baseURL}/v1/auth/verify-email`
  },
  DASHBOARD: {
    STATS: `${API_CONFIG.baseURL}/v3/admin/dashboard`, // Mapped to GetDashboard
    ANALYTICS: `${API_CONFIG.baseURL}/v3/admin/dashboard/performance`, // Mapped to GetPerformanceMetrics
    ACTIVITIES: `${API_CONFIG.baseURL}/v3/admin/dashboard/recent-activity` // Mapped to GetRecentActivity
  },
  ANALYTICS: {
    BASE: `${API_CONFIG.baseURL}/analytics`
  },
  AI_AGENT: {
    BASE: API_CONFIG.aiAgentURL,
    CHAT: `${API_CONFIG.aiAgentURL}/chat`,
    TRAINING: `${API_CONFIG.aiAgentURL}/training`,
    MODELS: `${API_CONFIG.aiAgentURL}/models`
  },
  NOTIFICATIONS: {
    BASE: `${API_CONFIG.baseURL}/notifications`
  },
  WEBSOCKET: {
    NOTIFICATIONS: API_CONFIG.wsURL.replace('http', 'ws').replace('https', 'wss') + '/notifications',
    DASHBOARD: API_CONFIG.wsURL.replace('http', 'ws').replace('https', 'wss') + '/dashboard'
  }
} as const;
