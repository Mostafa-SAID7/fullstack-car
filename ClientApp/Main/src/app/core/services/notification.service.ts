import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Notification } from '../models/notification.model';
import { Result, PaginatedResult } from '../models/result.model';
import { SignalRService } from './signalr.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private http = inject(HttpClient);
    private signalRService = inject(SignalRService);
    private baseUrl = `${environment.apiUrl}/v1/shared/notifications`;

    private notificationsSubject = new BehaviorSubject<Notification[]>([]);
    public notifications$ = this.notificationsSubject.asObservable();

    private unreadCountSubject = new BehaviorSubject<number>(0);
    public unreadCount$ = this.unreadCountSubject.asObservable();

    constructor() {
        this.refreshNotifications();
        this.setupSignalRListeners();
    }

    private setupSignalRListeners(): void {
        // Listen for real-time notifications
        this.signalRService.notificationReceived$.subscribe(notification => {
            if (notification) {
                this.handleNewNotification(notification);
            }
        });
    }

    private handleNewNotification(notificationData: any): void {
        const notification: Notification = {
            id: notificationData.id,
            title: notificationData.title,
            message: notificationData.message,
            targetUrl: notificationData.targetUrl,
            isRead: false, // New notifications are unread
            createdAt: new Date(notificationData.createdAt || new Date()),
            sourceUserId: notificationData.sourceUserId
        };

        // Add to the beginning of the list
        const current = this.notificationsSubject.value;
        const updated = [notification, ...current];
        this.notificationsSubject.next(updated);
        this.updateUnreadCount(updated);

        // Show browser notification if supported
        this.showBrowserNotification(notification);
    }

    private showBrowserNotification(notification: Notification): void {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: '/assets/icons/notification-icon.png',
                tag: notification.id
            });
        }
    }

    public requestNotificationPermission(): void {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    refreshNotifications(): void {
        this.http.get<Result<PaginatedResult<any>>>(`${this.baseUrl}?pageNumber=1&pageSize=50`).pipe(
            tap(response => {
                if (response.succeeded && response.data) {
                    this.processNotifications(response.data.items);
                }
            }),
            catchError(err => {
                console.error('Failed to fetch notifications', err);
                return of({ succeeded: false, data: null, errors: [] });
            })
        ).subscribe();
    }

    private processNotifications(data: any[]): void {
        const notifications: Notification[] = data.map(item => ({
            id: item.id,
            title: item.title,
            message: item.message,
            targetUrl: item.targetUrl,
            isRead: item.isRead,
            createdAt: new Date(item.createdAt),
            sourceUserId: item.sourceUserId
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

    markAsRead(id: string): Observable<Result<void>> {
        // Optimistic update
        const current = this.notificationsSubject.value;
        const updated = current.map(n => n.id === id ? { ...n, isRead: true } : n);
        this.notificationsSubject.next(updated);
        this.updateUnreadCount(updated);

        return this.http.patch<Result<void>>(`${this.baseUrl}/${id}/read`, {}).pipe(
            catchError(err => {
                console.error('Failed to mark read', err);
                // Revert on failure
                this.notificationsSubject.next(current);
                this.updateUnreadCount(current);
                return of({ succeeded: false, data: undefined, errors: ['Failed to mark notification as read'] });
            })
        );
    }

    markAllAsRead(): Observable<Result<void>> {
        const current = this.notificationsSubject.value;
        const unreadIds = current.filter(n => !n.isRead).map(n => n.id);
        
        if (unreadIds.length === 0) {
            return of({ succeeded: true, data: undefined, errors: [] });
        }

        // Optimistic update
        const updated = current.map(n => ({ ...n, isRead: true }));
        this.notificationsSubject.next(updated);
        this.updateUnreadCount(updated);

        // Mark each unread notification as read
        const markAllRequests = unreadIds.map(id => 
            this.http.patch<Result<void>>(`${this.baseUrl}/${id}/read`, {})
        );

        // Execute all requests and handle results
        return new Observable<Result<void>>(observer => {
            Promise.all(markAllRequests.map(req => req.toPromise()))
                .then(results => {
                    const allSucceeded = results.every(result => result?.succeeded);
                    if (allSucceeded) {
                        observer.next({ succeeded: true, data: undefined, errors: [] });
                    } else {
                        // Revert on failure
                        this.notificationsSubject.next(current);
                        this.updateUnreadCount(current);
                        observer.next({ succeeded: false, data: undefined, errors: ['Failed to mark all notifications as read'] });
                    }
                    observer.complete();
                })
                .catch(error => {
                    // Revert on failure
                    this.notificationsSubject.next(current);
                    this.updateUnreadCount(current);
                    observer.error(error);
                });
        });
    }

    getNotifications(pageNumber: number = 1, pageSize: number = 20): Observable<Result<PaginatedResult<Notification>>> {
        return this.http.get<Result<PaginatedResult<Notification>>>(`${this.baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`).pipe(
            tap(response => {
                if (response.succeeded && response.data) {
                    const notifications = response.data.items.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        message: item.message,
                        targetUrl: item.targetUrl,
                        isRead: item.isRead,
                        createdAt: new Date(item.createdAt),
                        sourceUserId: item.sourceUserId
                    }));
                    
                    // Update local state if this is the first page
                    if (pageNumber === 1) {
                        this.notificationsSubject.next(notifications);
                        this.updateUnreadCount(notifications);
                    }
                }
            }),
            catchError(err => {
                console.error('Failed to fetch notifications', err);
                const emptyResult: Result<PaginatedResult<Notification>> = { 
                    succeeded: false, 
                    data: { 
                        items: [], 
                        pageNumber: pageNumber, 
                        pageSize: pageSize, 
                        totalCount: 0, 
                        totalPages: 0, 
                        hasPreviousPage: false, 
                        hasNextPage: false 
                    }, 
                    errors: ['Failed to fetch notifications'] 
                };
                return of(emptyResult);
            })
        );
    }
}
