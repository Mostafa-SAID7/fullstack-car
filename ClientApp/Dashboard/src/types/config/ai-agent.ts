// AI Agent Configuration Types

export interface AIAgentConfig {
  // Model Parameters
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;

  // System Settings
  isEnabled: boolean;
  autoLearning: boolean;
  debugMode: boolean;

  // API Configuration
  apiEndpoint: string;
  apiKey?: string;
  rateLimit: number;
  timeout: number;

  // Advanced Settings
  advanced: AdvancedConfig;
}

export interface AdvancedConfig {
  // Memory Management
  memoryLimit: number;
  cacheSize: number;

  // Performance
  batchSize: number;
  concurrentRequests: number;

  // Logging
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  logRetention: number;

  // Security
  enableAuth: boolean;
  allowedOrigins: string[];
  rateLimitByIP: boolean;

  // Monitoring
  metricsEnabled: boolean;
  alertsEnabled: boolean;
  healthCheckInterval: number;
}
