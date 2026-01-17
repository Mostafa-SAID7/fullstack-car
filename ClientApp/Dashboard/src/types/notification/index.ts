/**
 * Notification Type Definitions
 * Matches backend notification DTOs exactly
 */

/**
 * Notification Type Enum
 * Matches backend notification types
 */
export enum NotificationType {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
  System = 'system'
}

/**
 * Notification Priority Enum
 */
export enum NotificationPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Urgent = 'urgent'
}

/**
 * Notification Category Enum
 */
export enum NotificationCategory {
  System = 'system',
  Marketplace = 'marketplace',
  User = 'user',
  Security = 'security',
  Maintenance = 'maintenance',
  Promotion = 'promotion',
  Community = 'community'
}

/**
 * Notification DTO
 * Matches backend Notification entity
 */
export interface NotificationDto {
  id: string;
  userId: string;
  type: NotificationType | string;
  title: string;
  message: string;
  isRead: boolean;
  priority: NotificationPriority | string;
  category: NotificationCategory | string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  sourceUserId?: string;
  targetUrl?: string;
  readAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Notification Preference DTO
 * Matches backend NotificationPreference entity
 */
export interface NotificationPreferenceDto {
  id: string;
  userId: string;
  notificationType: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
}

/**
 * Create Notification Request
 */
export interface CreateNotificationRequest {
  userId?: string;
  userIds?: string[];
  type: NotificationType | string;
  title: string;
  message: string;
  priority?: NotificationPriority | string;
  category?: NotificationCategory | string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  targetUrl?: string;
  expiresAt?: string;
  sourceUserId?: string;
}

/**
 * Update Notification Request
 */
export interface UpdateNotificationRequest {
  isRead?: boolean;
}

/**
 * Notification List Response
 */
export interface NotificationListResponse {
  notifications: NotificationDto[];
  totalCount: number;
  unreadCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Notification Stats Response
 */
export interface NotificationStatsResponse {
  total: number;
  unread: number;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
}

/**
 * Notification Filter Parameters
 */
export interface NotificationFilters {
  page?: number;
  pageSize?: number;
  type?: string;
  category?: string;
  priority?: string;
  isRead?: boolean;
  startDate?: string;
  endDate?: string;
  search?: string;
}

/**
 * SignalR Notification Event
 */
export interface NotificationEvent {
  type: 'notification_received' | 'notification_read' | 'notification_deleted' | 'notification_updated';
  notification: NotificationDto;
  timestamp: string;
}

/**
 * Update Preferences Request
 */
export interface UpdatePreferencesRequest {
  preferences: NotificationPreferenceDto[];
}

/**
 * Register Device Request
 */
export interface RegisterDeviceRequest {
  deviceToken: string;
  platform: 'iOS' | 'Android' | 'Web';
}

/**
 * Unread Count Response
 */
export interface UnreadCountResponse {
  count: number;
}

/**
 * Device Tokens Response
 */
export interface DeviceTokensResponse {
  tokens: string[];
}

// Legacy type aliases for backward compatibility
export type Notification = NotificationDto;
export type NotificationResponse = NotificationListResponse;
export type NotificationSettings = NotificationPreferenceDto;
export type NotificationStats = NotificationStatsResponse;

// Type guards
export function isNotificationType(value: string): value is NotificationType {
  return Object.values(NotificationType).includes(value as NotificationType);
}

export function isNotificationPriority(value: string): value is NotificationPriority {
  return Object.values(NotificationPriority).includes(value as NotificationPriority);
}

export function isNotificationCategory(value: string): value is NotificationCategory {
  return Object.values(NotificationCategory).includes(value as NotificationCategory);
}
