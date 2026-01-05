// API Endpoints Configuration

import { API_CONFIG } from './base';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_CONFIG.baseURL}/auth/login`,
    LOGOUT: `${API_CONFIG.baseURL}/auth/logout`,
    REFRESH: `${API_CONFIG.baseURL}/auth/refresh-token`,
    PROFILE: `${API_CONFIG.baseURL}/auth/profile`,
    VERIFY_EMAIL: `${API_CONFIG.baseURL}/auth/verify-email`
  },
  DASHBOARD: {
    STATS: `${API_CONFIG.baseURL}/dashboard/stats`,
    ANALYTICS: `${API_CONFIG.baseURL}/dashboard/analytics`,
    ACTIVITIES: `${API_CONFIG.baseURL}/dashboard/activities`
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
