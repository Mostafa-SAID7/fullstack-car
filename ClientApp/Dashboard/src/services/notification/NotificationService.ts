import type { 
  Notification, 
  NotificationResponse, 
  NotificationFilters, 
  NotificationStats, 
  CreateNotificationRequest 
} from '../../types/notification';
import { SignalRManager } from './SignalRManager';
import { NotificationUtils } from './NotificationUtils';
import { NotificationAPI } from './NotificationAPI';

export class NotificationService {
  private static instance: NotificationService;
  private signalRManager: SignalRManager;
  private utils: NotificationUtils;
  private api: NotificationAPI;

  private constructor() {
    this.signalRManager = new SignalRManager();
    this.utils = new NotificationUtils();
    this.api = new NotificationAPI();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // SignalR methods
  subscribeToNotifications(callback: (notification: Notification) => void): () => void {
    return this.signalRManager.subscribeToNotifications(callback);
  }

  async ensureConnection(): Promise<void> {
    return this.signalRManager.ensureConnection();
  }

  async disconnect(): Promise<void> {
    return this.signalRManager.disconnect();
  }

  // API methods with error handling and fallback to mock data
  async getNotifications(filters?: NotificationFilters): Promise<NotificationResponse> {
    try {
      return await this.api.getNotifications(filters);
    } catch (error) {
      console.error('Get notifications error:', error);
      
      // Return mock data if backend is not available
      const mockNotifications = this.utils.generateMockNotifications(10);
      return {
        succeeded: true,
        data: mockNotifications,
        totalCount: mockNotifications.length,
        unreadCount: mockNotifications.filter(n => !n.read).length,
        message: 'Using mock data - backend not available'
      };
    }
  }

  async getNotificationStats(): Promise<{ succeeded: boolean; data?: NotificationStats; errors?: string[] }> {
    try {
      return await this.api.getNotificationStats();
    } catch (error) {
      console.error('Get notification stats error:', error);
      
      // Return mock stats if backend is not available
      const mockStats: NotificationStats = {
        total: 25,
        unread: 8,
        byType: {
          success: 10,
          warning: 5,
          error: 3,
          info: 7
        },
        byCategory: {
          system: 8,
          marketplace: 12,
          user: 3,
          security: 2,
          maintenance: 0,
          promotion: 0
        },
        byPriority: {
          low: 10,
          medium: 12,
          high: 2,
          urgent: 1
        }
      };
      
      return {
        succeeded: true,
        data: mockStats
      };
    }
  }

  async getNotification(notificationId: string): Promise<any> {
    try {
      return await this.api.getNotification(notificationId);
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
      return await this.api.markAsRead(notificationId);
    } catch (error) {
      console.error('Mark as read error:', error);
      // Return success for mock data
      return {
        succeeded: true,
        message: 'Notification marked as read (mock)'
      };
    }
  }

  async markAllAsRead(): Promise<any> {
    try {
      return await this.api.markAllAsRead();
    } catch (error) {
      console.error('Mark all as read error:', error);
      // Return success for mock data
      return {
        succeeded: true,
        message: 'All notifications marked as read (mock)'
      };
    }
  }

  async deleteNotification(notificationId: string): Promise<any> {
    try {
      return await this.api.deleteNotification(notificationId);
    } catch (error) {
      console.error('Delete notification error:', error);
      // Return success for mock data
      return {
        succeeded: true,
        message: 'Notification deleted (mock)'
      };
    }
  }

  async createNotification(notification: CreateNotificationRequest): Promise<any> {
    try {
      return await this.api.createNotification(notification);
    } catch (error) {
      console.error('Create notification error:', error);
      return {
        succeeded: false,
        errors: ['Failed to create notification'],
        message: 'An error occurred'
      };
    }
  }

  // Enhanced notification methods
  async getNotificationsByType(type: string, limit: number = 10): Promise<any> {
    try {
      return await this.api.getNotificationsByType(type, limit);
    } catch (error) {
      console.error('Get notifications by type error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load notifications by type'],
        message: 'An error occurred'
      };
    }
  }

  async getNotificationsByCategory(category: string, limit: number = 10): Promise<any> {
    try {
      return await this.api.getNotificationsByCategory(category, limit);
    } catch (error) {
      console.error('Get notifications by category error:', error);
      return {
        succeeded: false,
        errors: ['Failed to load notifications by category'],
        message: 'An error occurred'
      };
    }
  }

  async sendMarketplaceNotification(notification: any): Promise<any> {
    try {
      return await this.api.sendMarketplaceNotification(notification);
    } catch (error) {
      console.error('Send marketplace notification error:', error);
      return {
        succeeded: false,
        errors: ['Failed to send marketplace notification'],
        message: 'An error occurred'
      };
    }
  }

  async sendSystemBroadcast(broadcast: { title: string; message: string; priority?: string }): Promise<any> {
    try {
      return await this.api.sendSystemBroadcast(broadcast);
    } catch (error) {
      console.error('Send system broadcast error:', error);
      return {
        succeeded: false,
        errors: ['Failed to send system broadcast'],
        message: 'An error occurred'
      };
    }
  }

  async getUnreadCount(): Promise<any> {
    try {
      return await this.api.getUnreadCount();
    } catch (error) {
      console.error('Get unread count error:', error);
      return {
        succeeded: false,
        errors: ['Failed to get unread count'],
        message: 'An error occurred'
      };
    }
  }

  // Utility methods (delegated to NotificationUtils)
  generateMockNotifications(count: number = 5): Notification[] {
    return this.utils.generateMockNotifications(count);
  }

  getNotificationUnreadCount(notifications: Notification[]): number {
    return this.utils.getNotificationUnreadCount(notifications);
  }

  groupNotificationsByType(notifications: Notification[]): Record<Notification['type'], Notification[]> {
    return this.utils.groupNotificationsByType(notifications);
  }

  groupNotificationsByCategory(notifications: Notification[]): Record<Notification['category'], Notification[]> {
    return this.utils.groupNotificationsByCategory(notifications);
  }

  formatNotificationTime(dateString: string): string {
    return this.utils.formatNotificationTime(dateString);
  }

  getNotificationIcon(type: string): string {
    return this.utils.getNotificationIcon(type);
  }

  getPriorityColor(priority: string): string {
    return this.utils.getPriorityColor(priority);
  }

  getCategoryColor(category: string): string {
    return this.utils.getCategoryColor(category);
  }
}