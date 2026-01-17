import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styles: [`
    .notification-enter {
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription?: Subscription;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe(
      (notification: Notification) => {
        this.notifications.push(notification);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  dismiss(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notificationService.dismiss(id);
  }

  getNotificationClasses(notification: Notification): string {
    const baseClasses = 'rounded-lg p-4 shadow-lg notification-enter';
    const typeClasses: Record<string, string> = {
      success: 'bg-green-50 text-green-800',
      error: 'bg-red-50 text-red-800',
      warning: 'bg-yellow-50 text-yellow-800',
      info: 'bg-blue-50 text-blue-800'
    };
    return `${baseClasses} ${typeClasses[notification.type]}`;
  }
}
