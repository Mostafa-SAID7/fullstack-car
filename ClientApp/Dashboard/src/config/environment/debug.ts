// Debug Utilities

import { ENV } from './base';

// Debug utilities
export const debugLog = (...args: any[]): void => {
  if (ENV.DEBUG) {
    console.log('[DEBUG]', ...args);
  }
};

export const debugWarn = (...args: any[]): void => {
  if (ENV.DEBUG) {
    console.warn('[DEBUG]', ...args);
  }
};

export const debugError = (...args: any[]): void => {
  if (ENV.DEBUG) {
    console.error('[DEBUG]', ...args);
  }
};



