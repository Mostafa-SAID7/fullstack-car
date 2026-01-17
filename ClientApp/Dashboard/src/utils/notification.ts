import type { NotificationDto } from '../types/notification';

/**
 * Get unread notification count
 */
export function getUnreadCount(notifications: NotificationDto[]): number {
  return notifications.filter(n => !n.isRead).length;
}

/**
 * Group notifications by type
 */
export function groupByType(notifications: NotificationDto[]): Record<string, NotificationDto[]> {
  return notifications.reduce((groups, notification) => {
    const type = notification.type.toString();
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(notification);
    return groups;
  }, {} as Record<string, NotificationDto[]>);
}

/**
 * Group notifications by category
 */
export function groupByCategory(notifications: NotificationDto[]): Record<string, NotificationDto[]> {
  return notifications.reduce((groups, notification) => {
    const category = notification.category.toString();
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(notification);
    return groups;
  }, {} as Record<string, NotificationDto[]>);
}

/**
 * Group notifications by priority
 */
export function groupByPriority(notifications: NotificationDto[]): Record<string, NotificationDto[]> {
  return notifications.reduce((groups, notification) => {
    const priority = notification.priority.toString();
    if (!groups[priority]) {
      groups[priority] = [];
    }
    groups[priority].push(notification);
    return groups;
  }, {} as Record<string, NotificationDto[]>);
}

/**
 * Format notification time as relative string
 */
export function formatNotificationTime(dateString: string): string {
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

/**
 * Get icon for notification type
 */
export function getNotificationIcon(type: string): string {
  switch (type.toLowerCase()) {
    case 'success': return '✅';
    case 'warning': return '⚠️';
    case 'error': return '❌';
    case 'info': return 'ℹ️';
    case 'system': return '⚙️';
    default: return '🔔';
  }
}

/**
 * Get color class for priority
 */
export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'low': return 'text-gray-500';
    case 'medium': return 'text-blue-500';
    case 'high': return 'text-orange-500';
    case 'urgent': return 'text-red-500';
    default: return 'text-gray-500';
  }
}

/**
 * Get color class for category
 */
export function getCategoryColor(category: string): string {
  switch (category.toLowerCase()) {
    case 'system': return 'bg-blue-100 text-blue-800';
    case 'marketplace': return 'bg-green-100 text-green-800';
    case 'security': return 'bg-red-100 text-red-800';
    case 'promotion': return 'bg-purple-100 text-purple-800';
    case 'user': return 'bg-gray-100 text-gray-800';
    case 'community': return 'bg-indigo-100 text-indigo-800';
    case 'maintenance': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Sort notifications by date (newest first)
 */
export function sortByDate(notifications: NotificationDto[]): NotificationDto[] {
  return [...notifications].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Filter notifications by read status
 */
export function filterByReadStatus(notifications: NotificationDto[], isRead: boolean): NotificationDto[] {
  return notifications.filter(n => n.isRead === isRead);
}

/**
 * Filter notifications by type
 */
export function filterByType(notifications: NotificationDto[], type: string): NotificationDto[] {
  return notifications.filter(n => n.type.toString().toLowerCase() === type.toLowerCase());
}

/**
 * Filter notifications by category
 */
export function filterByCategory(notifications: NotificationDto[], category: string): NotificationDto[] {
  return notifications.filter(n => n.category.toString().toLowerCase() === category.toLowerCase());
}

/**
 * Filter notifications by priority
 */
export function filterByPriority(notifications: NotificationDto[], priority: string): NotificationDto[] {
  return notifications.filter(n => n.priority.toString().toLowerCase() === priority.toLowerCase());
}
