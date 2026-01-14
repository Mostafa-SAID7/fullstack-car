// Request Configuration

// Request timeout configurations
export const REQUEST_TIMEOUTS = {
  DEFAULT: 30000,
  UPLOAD: 300000,
  LONG_RUNNING: 60000
} as const;

// Retry configurations
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  BACKOFF_MULTIPLIER: 2
} as const;





