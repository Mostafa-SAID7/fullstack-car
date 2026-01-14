// Configuration Templates Constants

import { DEFAULT_CONFIG } from './defaults';

export const CONFIG_TEMPLATES = [
  {
    id: 'development',
    name: 'Development',
    description: 'Optimized for development with debug enabled',
    category: 'development' as const,
    config: {
      ...DEFAULT_CONFIG,
      debugMode: true,
      advanced: {
        ...DEFAULT_CONFIG.advanced,
        logLevel: 'debug' as const,
        enableAuth: false
      }
    }
  },
  {
    id: 'production',
    name: 'Production',
    description: 'Optimized for production with security enabled',
    category: 'production' as const,
    config: {
      ...DEFAULT_CONFIG,
      debugMode: false,
      advanced: {
        ...DEFAULT_CONFIG.advanced,
        logLevel: 'warn' as const,
        enableAuth: true,
        rateLimitByIP: true
      }
    }
  }
] as const;







