// Configuration Validation Rules Constants

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






