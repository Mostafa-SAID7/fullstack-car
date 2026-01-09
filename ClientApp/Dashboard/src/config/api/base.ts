// API Base Configuration

import { ENV } from '../environment';

export interface ApiConfig {
  baseURL: string;
  aiAgentURL: string;
  wsURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  retryBackoffFactor: number;
  headers: Record<string, string>;
  withCredentials: boolean;
}

export const API_CONFIG: ApiConfig = {
  baseURL: ENV.API_BASE_URL,
  aiAgentURL: ENV.AI_AGENT_URL,
  wsURL: ENV.WS_URL,
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
  retryBackoffFactor: 2,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
};

// Request timeout configurations for different operations
export const REQUEST_TIMEOUTS = {
  DEFAULT: 10000, // 10 seconds
  UPLOAD: 300000, // 5 minutes for file uploads
  DOWNLOAD: 120000, // 2 minutes for downloads
  LONG_RUNNING: 600000 // 10 minutes for long operations
} as const;

// Retry configuration for different error types
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  BACKOFF_FACTOR: 2,
  RETRYABLE_STATUS_CODES: [408, 429, 500, 502, 503, 504],
  NON_RETRYABLE_STATUS_CODES: [400, 401, 403, 404, 422]
} as const;



