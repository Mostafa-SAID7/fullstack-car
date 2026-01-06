// Application Types - Main Export
export * from './ai-agent';
export * from './api';
export * from './auth';
export * from './common';
export * from './config';
export * from './datasets';
export * from './models';
export * from './notification';
export * from './products';
export * from './training';

// Dashboard types (core)
export * from './dashboard';

// Admin types (with aliasing for conflicts)
export type { AdminUser } from './admin/user';
export type { 
  UserFilters as AdminUserFilters,
  PaginatedResult as AdminPaginatedResult
} from './admin/user';
export type {
    UserAnalytics as AdminUserAnalytics,
    UserActivityData as AdminUserActivityData,
    UserDemographics as AdminUserDemographics
} from './admin/user-analytics';
export type {
    ContentAnalytics as AdminContentAnalytics,
    CategoryData as AdminCategoryData,
    ContentTrendData as AdminContentTrendData
} from './admin/content-analytics';
export type { SystemAnalytics as AdminSystemAnalytics } from './admin/system-analytics';
export * from './admin/engagement-analytics';
export * from './admin/security-analytics';
export * from './admin/performance-analytics';
export * from './admin/analytics-metadata';

// Page-specific types
// export * from './pages'; // If this conflicts, be explicit as well

// Monitoring Aliases
export type { ChartData as MonitoringChartData } from './monitoring';