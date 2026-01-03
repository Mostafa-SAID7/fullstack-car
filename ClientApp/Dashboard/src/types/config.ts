// Configuration Types

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

export interface EnvironmentConfig {
  name: string;
  description: string;
  config: AIAgentConfig;
  isActive: boolean;
  lastModified: string;
}

export interface ConfigValidation {
  isValid: boolean;
  errors: ConfigError[];
  warnings: ConfigWarning[];
}

export interface ConfigError {
  field: string;
  message: string;
  value: any;
  expectedType: string;
}

export interface ConfigWarning {
  field: string;
  message: string;
  suggestion: string;
}

export interface ConfigBackup {
  id: string;
  name: string;
  config: AIAgentConfig;
  createdAt: string;
  description?: string;
  tags: string[];
}

export interface ConfigTemplate {
  id: string;
  name: string;
  description: string;
  category: 'development' | 'production' | 'testing' | 'custom';
  config: Partial<AIAgentConfig>;
  isDefault: boolean;
}