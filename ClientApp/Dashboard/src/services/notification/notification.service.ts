export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
  dismissible?: boolean;
}

type NotificationListener = (notification: Notification) => void;

export class NotificationService {
  private static instance: NotificationService;
  private listeners: NotificationListener[] = [];
  private notificationQueue: Notification[] = [];
  private idCounter = 0;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  subscribe(listener: NotificationListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  success(message: string, title?: string, duration: number = 5000): void {
    this.show({
      type: 'success',
      message,
      title,
      duration
    });
  }

  error(message: string, title?: string, duration: number = 7000): void {
    this.show({
      type: 'error',
      message,
      title,
      duration
    });
  }

  warning(message: string, title?: string, duration: number = 6000): void {
    this.show({
      type: 'warning',
      message,
      title,
      duration
    });
  }

  info(message: string, title?: string, duration: number = 5000): void {
    this.show({
      type: 'info',
      message,
      title,
      duration
    });
  }

  private show(notification: Omit<Notification, 'id' | 'dismissible'>): void {
    const fullNotification: Notification = {
      ...notification,
      id: this.generateId(),
      dismissible: true
    };

    this.notificationQueue.push(fullNotification);
    this.notifyListeners(fullNotification);

    // Auto-dismiss after duration
    if (fullNotification.duration && fullNotification.duration > 0) {
      setTimeout(() => {
        this.dismiss(fullNotification.id);
      }, fullNotification.duration);
    }
  }

  dismiss(id: string): void {
    this.notificationQueue = this.notificationQueue.filter(n => n.id !== id);
  }

  dismissAll(): void {
    this.notificationQueue = [];
  }

  getQueue(): Notification[] {
    return [...this.notificationQueue];
  }

  private notifyListeners(notification: Notification): void {
    this.listeners.forEach(listener => listener(notification));
  }

  private generateId(): string {
    return `notification-${Date.now()}-${++this.idCounter}`;
  }
}

export const notificationService = NotificationService.getInstance();
