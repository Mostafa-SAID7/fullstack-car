import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  dismissible?: boolean;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notifications$ = this.notificationSubject.asObservable();

  private notifications: Notification[] = [];

  show(notification: Omit<Notification, 'id'>): string {
    const id = this.generateId();
    const fullNotification: Notification = {
      ...notification,
      id,
      dismissible: notification.dismissible ?? true
    };

    this.notifications.push(fullNotification);
    this.notificationSubject.next(fullNotification);

    // Auto-dismiss after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, notification.duration);
    }

    return id;
  }

  success(message: string, title?: string, duration: number = 5000): string {
    return this.show({
      type: 'success',
      title,
      message,
      duration
    });
  }

  error(message: string, title?: string, duration?: number): string {
    return this.show({
      type: 'error',
      title,
      message,
      duration: duration || 0, // Errors don't auto-dismiss by default
      dismissible: true
    });
  }

  warning(message: string, title?: string, duration: number = 7000): string {
    return this.show({
      type: 'warning',
      title,
      message,
      duration
    });
  }

  info(message: string, title?: string, duration: number = 5000): string {
    return this.show({
      type: 'info',
      title,
      message,
      duration
    });
  }

  dismiss(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  dismissAll(): void {
    this.notifications = [];
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}