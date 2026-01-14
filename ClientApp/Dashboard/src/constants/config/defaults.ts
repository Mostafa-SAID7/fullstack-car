// Configuration Defaults Constants

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






