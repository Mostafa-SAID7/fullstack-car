/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_AI_AGENT_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_DEBUG: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_FEATURE_AI_AGENT: string;
  readonly VITE_FEATURE_ANALYTICS: string;
  readonly VITE_FEATURE_REAL_TIME: string;
  readonly VITE_FEATURE_FILE_UPLOAD: string;
  readonly VITE_FEATURE_NOTIFICATIONS: string;
  readonly VITE_FEATURE_ADVANCED_ANALYTICS: string;
  readonly VITE_FEATURE_EXPORT_DATA: string;
  readonly VITE_FEATURE_BULK_ACTIONS: string;
  readonly VITE_FEATURE_MULTI_LANGUAGE: string;
  readonly VITE_FEATURE_DARK_MODE: string;
  readonly VITE_FEATURE_ADVANCED_SECURITY: string;
  readonly VITE_FEATURE_AUDIT_LOGGING: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}