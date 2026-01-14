// Rate Limiting Configuration

import { isProduction } from '../environment';

export const RATE_LIMIT_CONFIG = {
  ENABLED: isProduction,
  MAX_REQUESTS: 100,
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  SKIP_SUCCESSFUL_REQUESTS: false,
  SKIP_FAILED_REQUESTS: false
};





