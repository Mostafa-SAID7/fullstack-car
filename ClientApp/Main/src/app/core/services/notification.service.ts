import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError, map, filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import type {
  NotificationDto,
  NotificationListResponse,
  NotificationStatsResponse,
  CreateNotificationRequest,
  NotificationFilters,
  UnreadCountResponse
} from '../models/notification.model';
import { SignalRService } from './signalr.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly apiUrl = `${environment.apiUrl}/v1/notifications`;
  
  private notificationsSubject = new BehaviorSubject<NotificationDto[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private signalRService: SignalRService
  ) {
    this.refreshNotifications();
    this.initializeSignalR();
  }

  /**
   * Initialize SignalR connection and subscribe to real-time notifications
   */
  private initializeSignalR(): void {
    // Subscribe to SignalR notification events
    this.signalRService.notificationReceived$
      .pipe(filter(notification => notification !== null))
      .subscribe(notification => {
        if (notification) {
          this.handleNewNotification(notification);
        }
      });

    // Attempt to connect to SignalR
    this.signalRService.connect().catch(error => {
      console.warn('Failed to connect to SignalR for notifications:', error);
    });
  }

  /**
   * Get paginated notifications with optional filters
   */
  getNotifications(filters?: NotificationFilters): Observable<NotificationListResponse> {
    const params: any = {};
    
    if (filters) {
      if (filters.page) params.page = filters.page;
      if (filters.pageSize) params.pageSize = filters.pageSize;
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.priority) params.priority = filters.priority;
      if (filters.isRead !== undefined) params.isRead = filters.isRead;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.search) params.search = filters.search;
    }

    return this.http.get<NotificationListResponse>(this.apiUrl, { params }).pipe(
      tap(response => {
        if (filters?.page === 1 || !filters?.page) {
          this.notificationsSubject.next(response.notifications);
          this.unreadCountSubject.next(response.unreadCount);
        }
      })
    );
  }

  /**
   * Get single notification by ID
   */
  getNotification(id: string): Observable<NotificationDto> {
    return this.http.get<NotificationDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new notification (admin only)
   */
  createNotification(request: CreateNotificationRequest): Observable<NotificationDto> {
    return this.http.post<NotificationDto>(this.apiUrl, request);
  }

  /**
   * Mark notification as read
   */
  markAsRead(id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => {
        const current = this.notificationsSubject.value;
        const updated = current.map(n => n.id === id ? { ...n, isRead: true } : n);
        this.notificationsSubject.next(updated);
        this.updateUnreadCount(updated);
      })
    );
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/read-all`, {}).pipe(
      tap(() => {
        const current = this.notificationsSubject.value;
        const updated = current.map(n => ({ ...n, isRead: true }));
        this.notificationsSubject.next(updated);
        this.unreadCountSubject.next(0);
      })
    );
  }

  /**
   * Delete notification
   */
  deleteNotification(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.notificationsSubject.value;
        const updated = current.filter(n => n.id !== id);
        this.notificationsSubject.next(updated);
        this.updateUnreadCount(updated);
      })
    );
  }

  /**
   * Get unread notification count
   */
  getUnreadCount(): Observable<number> {
    return this.http.get<UnreadCountResponse>(`${this.apiUrl}/unread-count`).pipe(
      map(response => response.count),
      tap(count => this.unreadCountSubject.next(count))
    );
  }

  /**
   * Get notification statistics
   */
  getStats(): Observable<NotificationStatsResponse> {
    return this.http.get<NotificationStatsResponse>(`${this.apiUrl}/stats`);
  }

  /**
   * Refresh notifications (load first page)
   */
  refreshNotifications(): void {
    this.getNotifications({ page: 1, pageSize: 50 }).subscribe();
  }

  /**
   * Handle new notification from SignalR
   */
  handleNewNotification(notification: NotificationDto): void {
    const current = this.notificationsSubject.value;
    const updated = [notification, ...current];
    this.notificationsSubject.next(updated);
    this.updateUnreadCount(updated);
  }

  /**
   * Update unread count based on notifications
   */
  private updateUnreadCount(notifications: NotificationDto[]): void {
    const count = notifications.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(count);
  }
}
