// Environment Detection Utilities

import { ENV } from './base';

// Environment-specific configurations
export const isDevelopment = ENV.ENVIRONMENT === 'development';
export const isProduction = ENV.ENVIRONMENT === 'production';
export const isStaging = ENV.ENVIRONMENT === 'staging';



