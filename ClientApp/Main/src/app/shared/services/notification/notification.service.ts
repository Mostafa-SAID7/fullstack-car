import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
  dismissible?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notifications$ = this.notificationSubject.asObservable();
  
  private notificationQueue: Notification[] = [];
  private idCounter = 0;

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
    this.notificationSubject.next(fullNotification);

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

  private generateId(): string {
    return `notification-${Date.now()}-${++this.idCounter}`;
  }
}
