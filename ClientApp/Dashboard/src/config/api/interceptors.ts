// Request/Response Interceptors Configuration

import { ENV } from '../environment';
import { API_CONFIG } from './base';

// Request interceptors configuration
export const REQUEST_INTERCEPTORS = {
  AUTH: true,
  LOGGING: ENV.DEBUG,
  TIMEOUT: API_CONFIG.timeout,
  RETRIES: API_CONFIG.retries
};

// Response interceptors configuration
export const RESPONSE_INTERCEPTORS = {
  ERROR_HANDLING: true,
  LOGGING: ENV.DEBUG,
  AUTO_REFRESH_TOKEN: true,
  NOTIFICATION_ERRORS: true
};



