// Environment Base Configuration

export interface EnvironmentConfig {
  API_BASE_URL: string;
  AI_AGENT_URL: string;
  WS_URL: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';
  DEBUG: boolean;
  VERSION: string;
  FEATURES: {
    AI_AGENT: boolean;
    ANALYTICS: boolean;
    REAL_TIME_UPDATES: boolean;
    FILE_UPLOAD: boolean;
    NOTIFICATIONS: boolean;
  };
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;

  return {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5100/api',
    AI_AGENT_URL: import.meta.env.VITE_AI_AGENT_URL || 'http://localhost:8002/api',
    WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:5100/hub',
    ENVIRONMENT: isProduction ? 'production' : isDevelopment ? 'development' : 'staging',
    DEBUG: isDevelopment || import.meta.env.VITE_DEBUG === 'true',
    VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    FEATURES: {
      AI_AGENT: import.meta.env.VITE_FEATURE_AI_AGENT !== 'false',
      ANALYTICS: import.meta.env.VITE_FEATURE_ANALYTICS !== 'false',
      REAL_TIME_UPDATES: import.meta.env.VITE_FEATURE_REAL_TIME !== 'false',
      FILE_UPLOAD: import.meta.env.VITE_FEATURE_FILE_UPLOAD !== 'false',
      NOTIFICATIONS: import.meta.env.VITE_FEATURE_NOTIFICATIONS !== 'false'
    }
  };
};

export const ENV = getEnvironmentConfig();







