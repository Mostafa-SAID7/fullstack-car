// Configuration Constants

export const LOG_LEVELS = [
  { value: 'debug', label: 'Debug' },
  { value: 'info', label: 'Info' },
  { value: 'warn', label: 'Warning' },
  { value: 'error', label: 'Error' }
] as const;

export const ENVIRONMENT_TYPES = [
  { value: 'development', label: 'Development' },
  { value: 'staging', label: 'Staging' },
  { value: 'production', label: 'Production' },
  { value: 'testing', label: 'Testing' }
] as const;

export const DEFAULT_CONFIG = {
  temperature: 0.7,
  maxTokens: 150,
  topP: 0.9,
  topK: 50,
  isEnabled: true,
  autoLearning: false,
  debugMode: false,
  rateLimit: 100,
  timeout: 30000,
  advanced: {
    memoryLimit: 1024,
    cacheSize: 256,
    batchSize: 32,
    concurrentRequests: 10,
    logLevel: 'info' as const,
    logRetention: 30,
    enableAuth: true,
    allowedOrigins: ['*'],
    rateLimitByIP: true,
    metricsEnabled: true,
    alertsEnabled: true,
    healthCheckInterval: 60
  }
} as const;

export const CONFIG_CATEGORIES = [
  { id: 'model', label: 'Model Parameters', icon: 'brain' },
  { id: 'system', label: 'System Settings', icon: 'settings' },
  { id: 'api', label: 'API Configuration', icon: 'globe' },
  { id: 'advanced', label: 'Advanced Settings', icon: 'cog' }
] as const;

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

export const VALIDATION_RULES = {
  temperature: { min: 0, max: 2 },
  maxTokens: { min: 1, max: 4096 },
  topP: { min: 0, max: 1 },
  topK: { min: 1, max: 100 },
  rateLimit: { min: 1, max: 10000 },
  timeout: { min: 1000, max: 300000 },
  memoryLimit: { min: 128, max: 8192 },
  cacheSize: { min: 64, max: 2048 },
  batchSize: { min: 1, max: 512 },
  concurrentRequests: { min: 1, max: 100 },
  logRetention: { min: 1, max: 365 },
  healthCheckInterval: { min: 10, max: 3600 }
} as const;