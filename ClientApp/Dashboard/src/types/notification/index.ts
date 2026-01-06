// Notification Types

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  metadata?: Record<string, any>;
  actions?: NotificationAction[];
}

export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'system' 
  | 'user' 
  | 'security' 
  | 'marketing';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationAction {
  id: string;
  label: string;
  url?: string;
  action?: string;
  style?: 'primary' | 'secondary' | 'danger';
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
  totalCount: number;
  hasMore: boolean;
}

export interface NotificationSettings {
  email: {
    enabled: boolean;
    types: NotificationType[];
    frequency: 'immediate' | 'daily' | 'weekly';
  };
  push: {
    enabled: boolean;
    types: NotificationType[];
  };
  inApp: {
    enabled: boolean;
    types: NotificationType[];
  };
  sms: {
    enabled: boolean;
    types: NotificationType[];
    phoneNumber?: string;
  };
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  userId?: string;
  userIds?: string[];
  metadata?: Record<string, any>;
  actions?: Omit<NotificationAction, 'id'>[];
  scheduledAt?: string;
}

export interface UpdateNotificationRequest {
  read?: boolean;
  archived?: boolean;
}

export interface NotificationFilter {
  type?: NotificationType;
  priority?: NotificationPriority;
  read?: boolean;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
  recentActivity: {
    date: string;
    count: number;
  }[];
}