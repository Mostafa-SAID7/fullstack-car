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

  // Gemini Specific Features
  systemInstructions?: string;
  safetySettings?: Array<{
    category: 'HATE_SPEECH' | 'SEXUALLY_EXPLICIT' | 'HARASSMENT' | 'DANGEROUS_CONTENT';
    threshold: 'BLOCK_NONE' | 'BLOCK_ONLY_HIGH' | 'BLOCK_MEDIUM_AND_ABOVE' | 'BLOCK_LOW_AND_ABOVE';
  }>;

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
