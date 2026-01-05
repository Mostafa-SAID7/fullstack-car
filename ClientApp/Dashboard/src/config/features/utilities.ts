// Feature Flag Utilities

import { FEATURES, type FeatureFlags } from './base';

// Feature flag utilities
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return FEATURES[feature];
};

export const getEnabledFeatures = (): (keyof FeatureFlags)[] => {
  return Object.keys(FEATURES).filter(key => FEATURES[key as keyof FeatureFlags]) as (keyof FeatureFlags)[];
};

export const getDisabledFeatures = (): (keyof FeatureFlags)[] => {
  return Object.keys(FEATURES).filter(key => !FEATURES[key as keyof FeatureFlags]) as (keyof FeatureFlags)[];
};



