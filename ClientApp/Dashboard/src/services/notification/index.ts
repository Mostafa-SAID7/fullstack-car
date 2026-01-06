import { apiClient } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { Notification, NotificationResponse, NotificationPriority } from '../../types/notification';

// Re-export types for backward compatibility
export type { Notification, NotificationResponse };

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Notification CRUD
  async getNotifications(userId?: string, page?: number, limit?: number): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());

      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.NOTIFICATIONS.BASE}?${queryString}` : API_ENDPOINTS.NOTIFICATIONS.BASE;

      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('Get notifications error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load notifications'],
        message: 'An error occurred'
      };
    }
  }

  async getNotification(notificationId: string): Promise<any> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/${notificationId}`);
      return response;
    } catch (error) {
      console.error('Get notification error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load notification'],
        message: 'An error occurred'
      };
    }
  }

  async markAsRead(notificationId: string): Promise<any> {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/${notificationId}/read`);
      return response;
    } catch (error) {
      console.error('Mark as read error:', error);
      return {
        succeeded: false,
        errors: ['Failed to mark notification as read'],
        message: 'An error occurred'
      };
    }
  }

  async markAllAsRead(userId?: string): Promise<any> {
    try {
      const url = userId
        ? `${API_ENDPOINTS.NOTIFICATIONS.BASE}/read-all?userId=${userId}`
        : `${API_ENDPOINTS.NOTIFICATIONS.BASE}/read-all`;

      const response = await apiClient.put(url);
      return response;
    } catch (error) {
      console.error('Mark all as read error:', error);
      return {
        succeeded: false,
        errors: ['Failed to mark all notifications as read'],
        message: 'An error occurred'
      };
    }
  }

  async deleteNotification(notificationId: string): Promise<any> {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/${notificationId}`);
      return response;
    } catch (error) {
      console.error('Delete notification error:', error);
      return {
        succeeded: false,
        errors: ['Failed to delete notification'],
        message: 'An error occurred'
      };
    }
  }

  async deleteAllNotifications(userId?: string): Promise<any> {
    try {
      const url = userId
        ? `${API_ENDPOINTS.NOTIFICATIONS.BASE}?userId=${userId}`
        : API_ENDPOINTS.NOTIFICATIONS.BASE;

      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error('Delete all notifications error:', error);
      return {
        succeeded: false,
        errors: ['Failed to delete all notifications'],
        message: 'An error occurred'
      };
    }
  }

  // Notification Preferences
  async getNotificationPreferences(userId: string): Promise<any> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/preferences/${userId}`);
      return response;
    } catch (error) {
      console.error('Get notification preferences error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load notification preferences'],
        message: 'An error occurred'
      };
    }
  }

  async updateNotificationPreferences(userId: string, preferences: any): Promise<any> {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/preferences/${userId}`, preferences);
      return response;
    } catch (error) {
      console.error('Update notification preferences error:', error);
      return {
        succeeded: false,
        errors: ['Failed to update notification preferences'],
        message: 'An error occurred'
      };
    }
  }

  // Real-time Notifications (WebSocket/SSE)
  async subscribeToNotifications(userId: string, callback: (notification: Notification) => void): Promise<() => void> {
    // This would typically connect to WebSocket or Server-Sent Events
    // For now, we'll simulate with polling
    const intervalId = setInterval(async () => {
      try {
        const notifications = await this.getNotifications(userId, 1, 10);
        if (notifications.succeeded && notifications.data) {
          notifications.data.forEach((notification: Notification) => {
            if (!notification.read) {
              callback(notification);
            }
          });
        }
      } catch (error) {
        console.error('Real-time notification error:', error);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }

  // Notification Templates
  async getNotificationTemplates(): Promise<any> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/templates`);
      return response;
    } catch (error) {
      console.error('Get notification templates error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load notification templates'],
        message: 'An error occurred'
      };
    }
  }

  async createNotificationTemplate(template: any): Promise<any> {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/templates`, template);
      return response;
    } catch (error) {
      console.error('Create notification template error:', error);
      return {
        succeeded: false,
        errors: ['Failed to create notification template'],
        message: 'An error occurred'
      };
    }
  }

  async sendNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt' | 'updatedAt'>): Promise<any> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.BASE, notification);
      return response;
    } catch (error) {
      console.error('Send notification error:', error);
      return {
        succeeded: false,
        errors: ['Failed to send notification'],
        message: 'An error occurred'
      };
    }
  }

  // Utility Methods
  generateMockNotifications(count: number = 5): Notification[] {
    const types: Notification['type'][] = ['success', 'warning', 'error', 'info'];
    const messages = [
      'Your profile has been updated successfully',
      'New user registration requires approval',
      'System maintenance scheduled for tonight',
      'Monthly report is now available',
      'Backup completed successfully'
    ];

    return Array.from({ length: count }, (_, index) => ({
      id: `notification-${index + 1}`,
      title: `Notification ${index + 1}`,
      message: messages[Math.floor(Math.random() * messages.length)],
      type: types[Math.floor(Math.random() * types.length)],
      priority: 'medium' as NotificationPriority,
      read: Math.random() > 0.5,
      createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'current-user'
    }));
  }

  getUnreadCount(notifications: Notification[]): number {
    return notifications.filter(notification => !notification.read).length;
  }

  groupNotificationsByType(notifications: Notification[]): Record<Notification['type'], Notification[]> {
    return notifications.reduce((groups, notification) => {
      const type = notification.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(notification);
      return groups;
    }, {} as Record<Notification['type'], Notification[]>);
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();
