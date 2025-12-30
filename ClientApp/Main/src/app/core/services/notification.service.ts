import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Notification } from '../models/notification.model';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private http = inject(HttpClient);
    // Default API URL fallback if environment not fully configured for v4 yet
    private baseUrl = environment.apiUrl ? `${environment.apiUrl}/shared/notifications` : '/api/v4/shared/notifications';

    private notificationsSubject = new BehaviorSubject<Notification[]>([]);
    public notifications$ = this.notificationsSubject.asObservable();

    private unreadCountSubject = new BehaviorSubject<number>(0);
    public unreadCount$ = this.unreadCountSubject.asObservable();

    constructor() {
        this.refreshNotifications();
        // Optional: Set up polling here if SignalR is not ready
        // setInterval(() => this.refreshNotifications(), 30000); 
    }

    refreshNotifications(): void {
        this.http.get<any[]>(this.baseUrl).pipe(
            tap(data => this.processNotifications(data)),
            catchError(err => {
                console.error('Failed to fetch notifications', err);
                return of([]);
            })
        ).subscribe();
    }

    private processNotifications(data: any[]): void {
        // Map backend response to our model
        // Assuming backend returns object compatible or we need to map
        const notifications: Notification[] = data.map(item => ({
            id: item.id || item.Id,
            title: item.title || item.Title,
            message: item.message || item.Message,
            targetUrl: item.targetUrl || item.TargetUrl,
            isRead: item.isRead || item.IsRead,
            createdAt: new Date(item.createdAt || item.CreatedAt),
            sourceUserId: item.sourceUserId || item.SourceUserId
        }));

        // Sort by date desc
        notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        this.notificationsSubject.next(notifications);
        this.updateUnreadCount(notifications);
    }

    private updateUnreadCount(notifications: Notification[]): void {
        const count = notifications.filter(n => !n.isRead).length;
        this.unreadCountSubject.next(count);
    }

    markAsRead(id: string): void {
        // Optimistic update
        const current = this.notificationsSubject.value;
        const updated = current.map(n => n.id === id ? { ...n, isRead: true } : n);
        this.notificationsSubject.next(updated);
        this.updateUnreadCount(updated);

        this.http.patch(`${this.baseUrl}/${id}/read`, {}).subscribe({
            error: err => {
                console.error('Failed to mark read', err);
                // Revert on failure if needed, or just let next refresh handle it
            }
        });
    }

    markAllAsRead(): void {
        const current = this.notificationsSubject.value;
        const updated = current.map(n => ({ ...n, isRead: true }));
        this.notificationsSubject.next(updated);
        this.updateUnreadCount(updated);

        // If backend has a bulk read endpoint, use it. 
        // Otherwise we might need to loop or just accept the state is local until we build that endpoint.
        // For now, let's assume we read the visible ones or relying on user interaction.
        // Actually, based on previous analysis, we only saw MarkAsRead(id). 
        // So we might need to loop calls or add a backend endpoint. 
        // For this iteration, we'll iterate locally or just implement single read for now.
        current.filter(n => !n.isRead).forEach(n => {
            this.markAsRead(n.id);
        });
    }
}
