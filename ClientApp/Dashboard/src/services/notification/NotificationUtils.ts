import type { Notification } from '../../types/notification';

export class NotificationUtils {
  
  generateMockNotifications(count: number = 5): Notification[] {
    const types: Notification['type'][] = ['success', 'warning', 'error', 'info'];
    const categories: Notification['category'][] = ['system', 'marketplace', 'user', 'security', 'promotion'];
    const priorities: Notification['priority'][] = ['low', 'medium', 'high', 'urgent'];
    
    const messages = [
      'Your profile has been updated successfully',
      'New marketplace order requires attention',
      'System maintenance scheduled for tonight',
      'Monthly report is now available',
      'Security alert: New login detected',
      'Marketplace promotion has started',
      'Backup completed successfully',
      'Payment processed successfully',
      'New customer registered',
      'Service booking confirmed',
      'Inventory level is low',
      'Weekly analytics report ready'
    ];

    const titles = [
      'Profile Updated',
      'New Order',
      'System Maintenance',
      'Report Available',
      'Security Alert',
      'Promotion Started',
      'Backup Complete',
      'Payment Processed',
      'New Customer',
      'Booking Confirmed',
      'Low Inventory',
      'Analytics Report'
    ];

    return Array.from({ length: count }, (_, index) => {
      const type = types[Math.floor(Math.random() * types.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const messageIndex = Math.floor(Math.random() * messages.length);
      
      return {
        id: `notification-${Date.now()}-${index}`,
        userId: 'current-user',
        title: titles[messageIndex] || `Notification ${index + 1}`,
        message: messages[messageIndex],
        type,
        category,
        priority,
        read: Math.random() > 0.6, // 40% chance of being unread
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Within last 7 days
        updatedAt: new Date().toISOString(),
        targetUrl: category === 'marketplace' ? '/marketplace' : category === 'system' ? '/administration/system' : undefined
      };
    });
  }

  getNotificationUnreadCount(notifications: Notification[]): number {
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

  groupNotificationsByCategory(notifications: Notification[]): Record<Notification['category'], Notification[]> {
    return notifications.reduce((groups, notification) => {
      const category = notification.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(notification);
      return groups;
    }, {} as Record<Notification['category'], Notification[]>);
  }

  formatNotificationTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  }

  getNotificationIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'low': return 'text-gray-500';
      case 'medium': return 'text-blue-500';
      case 'high': return 'text-orange-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  }

  getCategoryColor(category: string): string {
    switch (category.toLowerCase()) {
      case 'system': return 'bg-blue-100 text-blue-800';
      case 'marketplace': return 'bg-green-100 text-green-800';
      case 'security': return 'bg-red-100 text-red-800';
      case 'promotion': return 'bg-purple-100 text-purple-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}