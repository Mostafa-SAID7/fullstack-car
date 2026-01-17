import { httpClient } from '../api/HttpClient';
import type { 
  NotificationDto,
  NotificationListResponse,
  NotificationStatsResponse,
  CreateNotificationRequest,
  NotificationFilters,
  UnreadCountResponse
} from '../../types/notification';

/**
 * Consolidated Notification Service
 * Single service for all notification operations
 */
export class NotificationService {
  private readonly baseUrl = '/v1/notifications';

  /**
   * Get paginated notifications with optional filters
   */
  async getNotifications(filters?: NotificationFilters): Promise<NotificationListResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.isRead !== undefined) params.append('isRead', filters.isRead.toString());
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.search) params.append('search', filters.search);
    }

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

    const response = await httpClient.get<NotificationListResponse>(url);
    return response.data!;
  }

  /**
   * Get single notification by ID
   */
  async getNotification(id: string): Promise<NotificationDto> {
    const response = await httpClient.get<NotificationDto>(`${this.baseUrl}/${id}`);
    return response.data!;
  }

  /**
   * Create a new notification (admin only)
   */
  async createNotification(request: CreateNotificationRequest): Promise<NotificationDto> {
    const response = await httpClient.post<NotificationDto>(this.baseUrl, request);
    return response.data!;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<void> {
    await httpClient.put(`${this.baseUrl}/${id}/read`, {});
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await httpClient.put(`${this.baseUrl}/read-all`, {});
  }

  /**
   * Delete notification
   */
  async deleteNotification(id: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    const response = await httpClient.get<UnreadCountResponse>(`${this.baseUrl}/unread-count`);
    return response.data!.count;
  }

  /**
   * Get notification statistics
   */
  async getStats(): Promise<NotificationStatsResponse> {
    const response = await httpClient.get<NotificationStatsResponse>(`${this.baseUrl}/stats`);
    return response.data!;
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Default export for backward compatibility
export default notificationService;
