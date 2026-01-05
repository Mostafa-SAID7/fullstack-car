// Notification Types

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
