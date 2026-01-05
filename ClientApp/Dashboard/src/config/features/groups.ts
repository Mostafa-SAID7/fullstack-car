// Feature Flag Groups

import type { FeatureFlags } from './base';

// Feature flag groups
export const CORE_FEATURES: (keyof FeatureFlags)[] = ['AI_AGENT', 'ANALYTICS', 'NOTIFICATIONS'];
export const ADVANCED_FEATURES: (keyof FeatureFlags)[] = ['ADVANCED_ANALYTICS', 'EXPORT_DATA', 'BULK_ACTIONS'];
export const UI_FEATURES: (keyof FeatureFlags)[] = ['MULTI_LANGUAGE', 'DARK_MODE'];
export const SECURITY_FEATURES: (keyof FeatureFlags)[] = ['ADVANCED_SECURITY', 'AUDIT_LOGGING'];



