import { NotificationService } from './NotificationService';

// Re-export types for backward compatibility
export type { Notification, NotificationResponse } from '../../types/notification';

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// Export individual modules for advanced usage
export { NotificationService } from './NotificationService';
export { SignalRManager } from './SignalRManager';
export { NotificationUtils } from './NotificationUtils';
export { NotificationAPI } from './NotificationAPI';
