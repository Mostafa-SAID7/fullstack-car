import { apiClient } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { 
  NotificationResponse, 
  NotificationFilters, 
  NotificationStats, 
  CreateNotificationRequest 
} from '../../types/notification';

export class NotificationAPI {
  
  async getNotifications(filters?: NotificationFilters): Promise<NotificationResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `${API_ENDPOINTS.NOTIFICATIONS.BASE}?${queryString}` : API_ENDPOINTS.NOTIFICATIONS.BASE;

    const response = await apiClient.get<NotificationResponse>(url);
    return response.data || { succeeded: false, errors: ['No data received'] };
  }

  async getNotificationStats(): Promise<{ succeeded: boolean; data?: NotificationStats; errors?: string[] }> {
    const response = await apiClient.get(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/stats`);
    return response.data || { succeeded: false, errors: ['No data received'] };
  }

  async getNotification(notificationId: string): Promise<any> {
    const response = await apiClient.get(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/${notificationId}`);
    return response;
  }

  async markAsRead(notificationId: string): Promise<any> {
    const response = await apiClient.patch(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/${notificationId}/read`);
    return response;
  }

  async markAllAsRead(): Promise<any> {
    const response = await apiClient.patch(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/mark-all-read`);
    return response;
  }

  async deleteNotification(notificationId: string): Promise<any> {
    const response = await apiClient.delete(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/${notificationId}`);
    return response;
  }

  async createNotification(notification: CreateNotificationRequest): Promise<any> {
    const response = await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.BASE, notification);
    return response;
  }

  async getNotificationsByType(type: string, limit: number = 10): Promise<any> {
    const response = await apiClient.get(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/by-type/${type}?limit=${limit}`);
    return response;
  }

  async getNotificationsByCategory(category: string, limit: number = 10): Promise<any> {
    const response = await apiClient.get(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/by-category/${category}?limit=${limit}`);
    return response;
  }

  async sendMarketplaceNotification(notification: any): Promise<any> {
    const response = await apiClient.post(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/marketplace`, notification);
    return response;
  }

  async sendSystemBroadcast(broadcast: { title: string; message: string; priority?: string }): Promise<any> {
    const response = await apiClient.post(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/broadcast`, broadcast);
    return response;
  }

  async getUnreadCount(): Promise<any> {
    const response = await apiClient.get(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/unread-count`);
    return response;
  }
}