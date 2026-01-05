// Service exports - organized by domain
export { authService } from './auth';
export { adminService } from './admin';
export { aiAgentService } from './ai-agent';
export { dashboardService } from './dashboard';
export { analyticsService } from './analytics';
export { notificationService } from './notification';
export { apiClient } from './api';

// Re-export types for backward compatibility
// Note: We use domain-specific exports to avoid duplicates
export * from './api';
export * from './auth';
export * from './dashboard';
export * from './admin';
export * from './ai-agent';
export * from './analytics';
export * from './notification';

// UI Services (If they exist, they should be correctly path-resolved)
// Commenting out missing modules to allow build to proceed if they are actually not present
// export { themeService, localizationService, chartThemeService } from '../components/services'; 
