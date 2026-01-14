import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../../core/services/translation.service';

export interface Notification {
  id: string;
  type: 'friend_request' | 'message' | 'post_like' | 'post_comment' | 'group_invite';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionData?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private translationService = inject(TranslationService);

  constructor(private translate: TranslateService) {
    this.initializeNotifications();
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  private async initializeNotifications(): Promise<void> {
    // Load social translations for notifications from backend API
    try {
      const currentLanguage = this.translationService.getCurrentLanguage().code;
      
      // Load social translations from backend API
      await this.translationService.loadSingleFeatureTranslations(currentLanguage, 'social');
      
      // Update ngx-translate with the loaded translations
      const translations = await this.translationService.loadTranslations(currentLanguage, 'social').toPromise();
      this.translate.setTranslation(currentLanguage, translations, true);
      
      console.log('Social translations loaded for notifications from backend API');
    } catch (error) {
      console.error('Failed to load social translations for notifications:', error);
      // Fallback to English if current language fails
      if (this.translationService.getCurrentLanguage().code !== 'en-US') {
        try {
          const fallbackTranslations = await this.translationService.loadTranslations('en-US', 'social').toPromise();
          this.translate.setTranslation('en-US', fallbackTranslations, true);
        } catch (fallbackError) {
          console.error('Failed to load fallback translations:', fallbackError);
        }
      }
    }

    // Initialize with some sample notifications
    this.createSampleNotifications();
    
    // Subscribe to language changes to refresh notifications
    this.translationService.currentLanguage$.subscribe(async (newLanguage) => {
      await this.refreshNotificationsLanguage();
    });
  }

  private createSampleNotifications(): void {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'friend_request',
        title: this.translate.instant('notifications.friendRequest'),
        message: this.translate.instant('notifications.friendRequestFrom', { 0: 'Ahmed Ali' }),
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        isRead: false,
        actionData: { userId: 'user1', userName: 'Ahmed Ali' }
      },
      {
        id: '2',
        type: 'message',
        title: this.translate.instant('notifications.messageReceived'),
        message: this.translate.instant('notifications.messageFrom', { 0: 'Sara Hassan' }),
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        isRead: false,
        actionData: { userId: 'user2', userName: 'Sara Hassan' }
      },
      {
        id: '3',
        type: 'post_like',
        title: this.translate.instant('notifications.postLiked'),
        message: this.translate.instant('notifications.postLikedBy', { 0: 'Omar Khaled' }),
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        isRead: true,
        actionData: { userId: 'user3', userName: 'Omar Khaled', postId: 'post1' }
      }
    ];

    this.notifications$.next(sampleNotifications);
  }

  addFriendRequestNotification(fromUserId: string, fromUserName: string): void {
    const isRTL = this.translationService.isCurrentLanguageRTL();
    
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'friend_request',
      title: this.translate.instant('notifications.friendRequest'),
      message: this.translate.instant('notifications.friendRequestFrom', { 0: fromUserName }),
      timestamp: new Date(),
      isRead: false,
      actionData: { userId: fromUserId, userName: fromUserName, isRTL }
    };

    const currentNotifications = this.notifications$.value;
    this.notifications$.next([notification, ...currentNotifications]);
    
    // Show browser notification if permission granted
    this.showBrowserNotification(notification.title, notification.message, isRTL);
  }

  addMessageNotification(fromUserId: string, fromUserName: string, messagePreview?: string): void {
    const isRTL = this.translationService.isCurrentLanguageRTL();
    
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'message',
      title: this.translate.instant('notifications.messageReceived'),
      message: this.translate.instant('notifications.messageFrom', { 0: fromUserName }),
      timestamp: new Date(),
      isRead: false,
      actionData: { userId: fromUserId, userName: fromUserName, messagePreview, isRTL }
    };

    const currentNotifications = this.notifications$.value;
    this.notifications$.next([notification, ...currentNotifications]);
    
    // Show browser notification if permission granted
    this.showBrowserNotification(notification.title, notification.message, isRTL);
  }

  addFriendRequestAcceptedNotification(userName: string): void {
    const isRTL = this.translationService.isCurrentLanguageRTL();
    
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'friend_request',
      title: this.translate.instant('notifications.friendRequest'),
      message: this.translate.instant('notifications.friendRequestAccepted', { 0: userName }),
      timestamp: new Date(),
      isRead: false,
      actionData: { userName, isRTL }
    };

    const currentNotifications = this.notifications$.value;
    this.notifications$.next([notification, ...currentNotifications]);
    
    // Show browser notification if permission granted
    this.showBrowserNotification(notification.title, notification.message, isRTL);
  }

  private showBrowserNotification(title: string, message: string, isRTL: boolean): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/assets/icons/notification.png',
        dir: isRTL ? 'rtl' : 'ltr',
        lang: this.translationService.getCurrentLanguage().code,
        badge: '/assets/icons/badge.png'
      });
    } else if ('Notification' in window && Notification.permission === 'default') {
      // Request permission for future notifications
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.showBrowserNotification(title, message, isRTL);
        }
      });
    }
  }

  markAsRead(notificationId: string): void {
    const currentNotifications = this.notifications$.value;
    const updatedNotifications = currentNotifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    );
    this.notifications$.next(updatedNotifications);
  }

  markAllAsRead(): void {
    const currentNotifications = this.notifications$.value;
    const updatedNotifications = currentNotifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    this.notifications$.next(updatedNotifications);
  }

  removeNotification(notificationId: string): void {
    const currentNotifications = this.notifications$.value;
    const updatedNotifications = currentNotifications.filter(
      notification => notification.id !== notificationId
    );
    this.notifications$.next(updatedNotifications);
  }

  clearAllNotifications(): void {
    this.notifications$.next([]);
  }

  getUnreadCount(): Observable<number> {
    return new BehaviorSubject(
      this.notifications$.value.filter(n => !n.isRead).length
    ).asObservable();
  }

  // Method to refresh notifications with current language
  async refreshNotificationsLanguage(): Promise<void> {
    try {
      const currentLanguage = this.translationService.getCurrentLanguage().code;
      
      // Load social translations from backend API
      await this.translationService.loadSingleFeatureTranslations(currentLanguage, 'social');
      
      // Update ngx-translate with the loaded translations
      const translations = await this.translationService.loadTranslations(currentLanguage, 'social').toPromise();
      this.translate.setTranslation(currentLanguage, translations, true);
      
      console.log('Notification translations refreshed from backend API');
      
      // Recreate sample notifications with new language
      this.createSampleNotifications();
    } catch (error) {
      console.error('Failed to refresh notification language:', error);
      // Fallback to English if current language fails
      if (this.translationService.getCurrentLanguage().code !== 'en-US') {
        try {
          const fallbackTranslations = await this.translationService.loadTranslations('en-US', 'social').toPromise();
          this.translate.setTranslation('en-US', fallbackTranslations, true);
          this.createSampleNotifications();
        } catch (fallbackError) {
          console.error('Failed to load fallback translations:', fallbackError);
        }
      }
    }
  }

  // Method to add localized post interaction notifications
  addPostLikedNotification(likerName: string, postTitle?: string): void {
    const isRTL = this.translationService.isCurrentLanguageRTL();
    
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'post_like',
      title: this.translate.instant('notifications.postLiked'),
      message: this.translate.instant('notifications.postLikedBy', { 0: likerName }),
      timestamp: new Date(),
      isRead: false,
      actionData: { likerName, postTitle, isRTL }
    };

    const currentNotifications = this.notifications$.value;
    this.notifications$.next([notification, ...currentNotifications]);
    
    this.showBrowserNotification(notification.title, notification.message, isRTL);
  }

  addPostCommentNotification(commenterName: string, postTitle?: string): void {
    const isRTL = this.translationService.isCurrentLanguageRTL();
    
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'post_comment',
      title: this.translate.instant('notifications.postCommented'),
      message: this.translate.instant('notifications.postCommentedBy', { 0: commenterName }),
      timestamp: new Date(),
      isRead: false,
      actionData: { commenterName, postTitle, isRTL }
    };

    const currentNotifications = this.notifications$.value;
    this.notifications$.next([notification, ...currentNotifications]);
    
    this.showBrowserNotification(notification.title, notification.message, isRTL);
  }

  // Method to get localized notification count text
  getLocalizedUnreadCountText(count: number): string {
    if (count === 0) {
      return this.translate.instant('notifications.noNotifications');
    } else if (count === 1) {
      return this.translate.instant('notifications.oneNotification', { default: '1 notification' });
    } else {
      return this.translate.instant('notifications.multipleNotifications', { 0: count, default: `${count} notifications` });
    }
  }
}