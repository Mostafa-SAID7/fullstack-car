// Request/Response Interceptors Configuration

import { ENV } from '../environment';
import { API_CONFIG, RETRY_CONFIG } from './base';

// Request interceptors configuration
export const REQUEST_INTERCEPTORS = {
  AUTH: true,
  LOGGING: ENV.DEBUG,
  TIMEOUT: API_CONFIG.timeout,
  RETRIES: API_CONFIG.retries,
  RATE_LIMITING: true,
  REQUEST_ID: true, // Add unique request IDs for tracking
  CACHE_CONTROL: true
};

// Response interceptors configuration
export const RESPONSE_INTERCEPTORS = {
  ERROR_HANDLING: true,
  LOGGING: ENV.DEBUG,
  AUTO_REFRESH_TOKEN: true,
  NOTIFICATION_ERRORS: true,
  RESPONSE_TRANSFORMATION: true,
  CACHE_MANAGEMENT: true
};

// Error handling configuration
export const ERROR_HANDLING_CONFIG = {
  SHOW_NETWORK_ERRORS: true,
  SHOW_SERVER_ERRORS: true,
  SHOW_VALIDATION_ERRORS: true,
  AUTO_RETRY_ON_NETWORK_ERROR: true,
  REDIRECT_ON_AUTH_ERROR: true,
  LOG_ERRORS: ENV.DEBUG
};

// Retry logic configuration
export const RETRY_INTERCEPTOR_CONFIG = {
  MAX_RETRIES: RETRY_CONFIG.MAX_RETRIES,
  RETRY_DELAY: RETRY_CONFIG.RETRY_DELAY,
  BACKOFF_FACTOR: RETRY_CONFIG.BACKOFF_FACTOR,
  RETRYABLE_STATUS_CODES: RETRY_CONFIG.RETRYABLE_STATUS_CODES,
  NON_RETRYABLE_STATUS_CODES: RETRY_CONFIG.NON_RETRYABLE_STATUS_CODES,
  RETRY_ON_NETWORK_ERROR: true,
  RETRY_ON_TIMEOUT: true
};



