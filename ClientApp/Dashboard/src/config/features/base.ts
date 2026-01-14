// Feature Flags Base Configuration

import { ENV } from '../environment';

export interface FeatureFlags {
  AI_AGENT: boolean;
  ANALYTICS: boolean;
  REAL_TIME_UPDATES: boolean;
  FILE_UPLOAD: boolean;
  NOTIFICATIONS: boolean;
  ADVANCED_ANALYTICS: boolean;
  EXPORT_DATA: boolean;
  BULK_ACTIONS: boolean;
  MULTI_LANGUAGE: boolean;
  DARK_MODE: boolean;
  ADVANCED_SECURITY: boolean;
  AUDIT_LOGGING: boolean;
}

// Feature flags from environment
export const FEATURES: FeatureFlags = {
  AI_AGENT: ENV.FEATURES.AI_AGENT,
  ANALYTICS: ENV.FEATURES.ANALYTICS,
  REAL_TIME_UPDATES: ENV.FEATURES.REAL_TIME_UPDATES,
  FILE_UPLOAD: ENV.FEATURES.FILE_UPLOAD,
  NOTIFICATIONS: ENV.FEATURES.NOTIFICATIONS,
  ADVANCED_ANALYTICS: import.meta.env.VITE_FEATURE_ADVANCED_ANALYTICS !== 'false',
  EXPORT_DATA: import.meta.env.VITE_FEATURE_EXPORT_DATA !== 'false',
  BULK_ACTIONS: import.meta.env.VITE_FEATURE_BULK_ACTIONS !== 'false',
  MULTI_LANGUAGE: import.meta.env.VITE_FEATURE_MULTI_LANGUAGE !== 'false',
  DARK_MODE: import.meta.env.VITE_FEATURE_DARK_MODE !== 'false',
  ADVANCED_SECURITY: import.meta.env.VITE_FEATURE_ADVANCED_SECURITY !== 'false',
  AUDIT_LOGGING: import.meta.env.VITE_FEATURE_AUDIT_LOGGING !== 'false'
};







