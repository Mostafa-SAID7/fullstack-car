// Notification Types

export type NotificationType = 'success' | 'warning' | 'error' | 'info';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationCategory = 'system' | 'marketplace' | 'user' | 'security' | 'maintenance' | 'promotion';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  category: NotificationCategory;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  readAt?: string;
  expiresAt?: string;
  targetUrl?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  sourceUserId?: string;
}

export interface NotificationResponse {
  succeeded: boolean;
  data?: Notification[];
  errors?: string[];
  message?: string;
  totalCount?: number;
  unreadCount?: number;
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketplaceNotifications: boolean;
  securityNotifications: boolean;
  systemNotifications: boolean;
  promotionNotifications: boolean;
  weeklyDigest: boolean;
  instantAlerts: boolean;
}

export interface CreateNotificationRequest {
  userId?: string;
  userIds?: string[];
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  category?: NotificationCategory;
  targetUrl?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  expiresAt?: string;
}

export interface NotificationFilters {
  type?: NotificationType;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  read?: boolean;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byCategory: Record<NotificationCategory, number>;
  byPriority: Record<NotificationPriority, number>;
}

// Real-time notification events
export interface NotificationEvent {
  type: 'notification_received' | 'notification_read' | 'notification_deleted';
  notification: Notification;
  timestamp: string;
}

// Notification templates
export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}