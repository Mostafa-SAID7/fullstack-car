// Application Types - Main Export
export * from './ai-agent';
export * from './api';
export * from './common';
export * from './config';
export * from './products';

// Auth types - explicit exports to avoid conflicts
export type {
  UserInfo,
  UserRole,
  UserPreferences,
  DashboardPreferences,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  LoginResponse,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  ProfileResponse,
  SecurityLogResponse,
  SecurityLog,
  UserSessionResponse,
  UserSession,
  VerifyEmailRequest,
  ResendVerificationRequest,
  AuthState,
  AuthContextType,
  NotificationPreferences as AuthNotificationPreferences
} from './auth';

// Notification types - explicit exports to avoid conflicts
export type {
  NotificationType,
  NotificationPriority,
  NotificationCategory,
  Notification,
  NotificationResponse,
  NotificationPreferences,
  CreateNotificationRequest,
  NotificationFilters,
  NotificationStats,
  NotificationEvent,
  NotificationTemplate
} from './notification';

// Dashboard types (core) - with explicit re-export to avoid DateRange conflict
export * from './dashboard/widget';
export * from './dashboard/metric-card';
export * from './dashboard/chart';
export * from './dashboard/quick-stats';
export * from './dashboard/database-metrics';
export * from './dashboard/metrics';
export * from './dashboard/system';
export * from './dashboard/stats';
export * from './dashboard/analytics';
// Export dashboard filters with aliased DateRange
export type {
  FilterOption as DashboardFilterOption,
  DateRange as DashboardDateRange,
  DashboardFilters
} from './dashboard/filters';

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