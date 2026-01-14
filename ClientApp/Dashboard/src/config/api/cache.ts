// Cache Configuration

import { ENV } from '../environment';

export const CACHE_CONFIG = {
  ENABLED: !ENV.DEBUG,
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  MAX_SIZE: 50, // Maximum cache entries
  STRATEGIES: {
    NETWORK_FIRST: 'network-first',
    CACHE_FIRST: 'cache-first',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
  }
};





