import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'Success' | 'Warning' | 'Error' | 'Info';
  isRead: boolean;
  createdAt: string;
  userId?: string;
}

export interface NotificationResponse {
  succeeded: boolean;
  data?: Notification[];
  message?: string;
}

class NotificationService {
  async getNotifications(): Promise<NotificationResponse> {
    try {
      const response = await apiClient.get<Notification[]>(API_ENDPOINTS.SHARED.NOTIFICATIONS);
      return {
        succeeded: true,
        data: response
      };
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Return mock data for development
      return {
        succeeded: true,
        data: [
          {
            id: '1',
            title: 'New User Registration',
            message: 'A new user has registered on the platform',
            type: 'Success',
            isRead: false,
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'System Alert',
            message: 'High CPU usage detected on server',
            type: 'Warning',
            isRead: false,
            createdAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: '3',
            title: 'Content Moderation',
            message: 'New post requires review',
            type: 'Info',
            isRead: true,
            createdAt: new Date(Date.now() - 7200000).toISOString()
          }
        ]
      };
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await apiClient.post(`/v4/shared/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.post('/v4/shared/notifications/read-all');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await apiClient.delete(`/v4/shared/notifications/${notificationId}`);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }
}

export const notificationService = new NotificationService();