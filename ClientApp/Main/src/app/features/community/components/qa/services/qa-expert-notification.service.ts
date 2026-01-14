import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export interface ExpertNotification {
  id: string;
  type: 'newQuestion' | 'invitation' | 'mention' | 'badgeEarned' | 'statusUpgrade' | 'recommendation' | 'follow' | 'answerRequest' | 'challenge' | 'spotlight' | 'achievement';
  title: string;
  body: string;
  questionId?: string;
  categoryId?: string;
  userId?: string;
  badgeId?: string;
  achievementId?: string;
  isRead: boolean;
  createdAt: Date;
  data?: any;
}

export interface ExpertNotificationPreferences {
  enableNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  browserNotifications: boolean;
  smsNotifications: boolean;
  immediateNotifications: boolean;
  dailyDigest: boolean;
  weeklyDigest: boolean;
  categoryNotifications: string[];
  tagNotifications: string[];
  mentionNotifications: boolean;
  invitationNotifications: boolean;
  achievementNotifications: boolean;
  followNotifications: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class QAExpertNotificationService {
  private readonly apiUrl = '/api/v7/qa/expert-notifications';
  private notificationsSubject = new BehaviorSubject<ExpertNotification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  public notifications$ = this.notificationsSubject.asObservable();
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {
    this.loadNotifications();
  }

  // Load expert notifications
  loadNotifications(): Observable<ExpertNotification[]> {
    return this.http.get<ExpertNotification[]>(`${this.apiUrl}`);
  }

  // Mark notification as read
  markAsRead(notificationId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${notificationId}/read`, {});
  }

  // Mark all notifications as read
  markAllAsRead(): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/read-all`, {});
  }

  // Get expert notification preferences
  getPreferences(): Observable<ExpertNotificationPreferences> {
    return this.http.get<ExpertNotificationPreferences>(`${this.apiUrl}/preferences`);
  }

  // Update expert notification preferences
  updatePreferences(preferences: ExpertNotificationPreferences): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/preferences`, preferences);
  }

  // Create localized expert notifications
  createNewQuestionNotification(categoryName: string, questionTitle: string, questionId: string): ExpertNotification {
    return {
      id: this.generateId(),
      type: 'newQuestion',
      title: this.translate.instant('experts.expertNotificationTitle'),
      body: this.translate.instant('experts.expertNotificationBody', { 0: categoryName }),
      questionId: questionId,
      categoryId: categoryName,
      isRead: false,
      createdAt: new Date(),
      data: { questionTitle, categoryName }
    };
  }

  createExpertInvitationNotification(inviterName: string, questionTitle: string, questionId: string): ExpertNotification {
    return {
      id: this.generateId(),
      type: 'invitation',
      title: this.translate.instant('experts.expertInvitationTitle'),
      body: this.translate.instant('experts.expertInvitationBody', { 0: inviterName, 1: questionTitle }),
      questionId: questionId,
      userId: inviterName,
      isRead: false,
      createdAt: new Date(),
      data: { inviterName, questionTitle }
    };
  }

  createExpertMentionNotification(mentionerName: string, contentType: 'question' | 'answer', contentId: string): ExpertNotification {
    return {
      id: this.generateId(),
      type: 'mention',
      title: this.translate.instant('experts.expertMentionTitle'),
      body: this.translate.instant('experts.expertMentionBody', { 0: mentionerName }),
      questionId: contentType === 'question' ? contentId : undefined,
      userId: mentionerName,
      isRead: false,
      createdAt: new Date(),
      data: { mentionerName, contentType, contentId }
    };
  }

  createBadgeEarnedNotification(badgeName: string, categoryName: string, badgeId: string): ExpertNotification {
    return {
      id: this.generateId(),
      type: 'badgeEarned',
      title: this.translate.instant('experts.expertBadgeEarnedTitle'),
      body: this.translate.instant('experts.expertBadgeEarnedBody', { 0: badgeName, 1: categoryName }),
      badgeId: badgeId,
      categoryId: categoryName,
      isRead: false,
      createdAt: new Date(),
      data: { badgeName, categoryName }
    };
  }

  createStatusUpgradeNotification(categoryName: string, newLevel: string): ExpertNotification {
    return {
      id: this.generateId(),
      type: 'statusUpgrade',
      title: this.translate.instant('experts.expertStatusUpgradeTitle'),
      body: this.translate.instant('experts.expertStatusUpgradeBody', { 0: categoryName, 1: newLevel }),
      categoryId: categoryName,
      isRead: false,
      createdAt: new Date(),
      data: { categoryName, newLevel }
    };
  }

  createRecommendationNotification(questionTitle: string, questionId: string, categoryName: string): ExpertNotification {
    return {
      id: this.generateId(),
      type: 'recommendation',
      title: this.translate.instant('experts.expertRecommendationTitle'),
      body: this.translate.instant('experts.expertRecommendationBody', { 0: questionTitle }),
      questionId: questionId,
      categoryId: categoryName,
      isRead: false,
      createdAt: new Date(),
      data: { questionTitle, categoryName }
    };
  }

  createFollowNotification(followerName: string, categoryName: string): ExpertNotification {
    return {
      id: this.generateId(),
      type: 'follow',
      title: this.translate.instant('experts.expertFollowTitle'),
      body: this.translate.instant('experts.expertFollowBody', { 0: followerName, 1: categoryName }),
      userId: followerName,
      categoryId: categoryName,
      isRead: false,
      createdAt: new Date(),
      data: { followerName, categoryName }
    };
  }

  createAnswerRequestNotification(requesterName: string, questionTitle: string, questionId: string): ExpertNotification {
    return {
      id: this.generateId(),
      type: 'answerRequest',
      title: this.translate.instant('experts.expertAnswerRequestTitle'),
      body: this.translate.instant('experts.expertAnswerRequestBody', { 0: requesterName, 1: questionTitle }),
      questionId: questionId,
      userId: requesterName,
      isRead: false,
      createdAt: new Date(),
      data: { requesterName, questionTitle }
    };
  }

  createChallengeNotification(categoryName: string, questionTitle: string, questionId: string): ExpertNotification {
    return {
      id: this.generateId(),
      type: 'challenge',
      title: this.translate.instant('experts.expertChallengeTitle'),
      body: this.translate.instant('experts.expertChallengeBody', { 0: categoryName, 1: questionTitle }),
      questionId: questionId,
      categoryId: categoryName,
      isRead: false,
      createdAt: new Date(),
      data: { categoryName, questionTitle }
    };
  }

  createSpotlightNotification(categoryName: string): ExpertNotification {
    return {
      id: this.generateId(),
      type: 'spotlight',
      title: this.translate.instant('experts.expertSpotlightTitle'),
      body: this.translate.instant('experts.expertSpotlightBody', { 0: categoryName }),
      categoryId: categoryName,
      isRead: false,
      createdAt: new Date(),
      data: { categoryName }
    };
  }

  createAchievementNotification(achievementName: string, categoryName: string, achievementId: string): ExpertNotification {
    return {
      id: this.generateId(),
      type: 'achievement',
      title: this.translate.instant('experts.expertAchievementTitle'),
      body: this.translate.instant('experts.expertAchievementBody', { 0: achievementName, 1: categoryName }),
      achievementId: achievementId,
      categoryId: categoryName,
      isRead: false,
      createdAt: new Date(),
      data: { achievementName, categoryName }
    };
  }

  // Send notification (simulate real-time notification)
  sendNotification(notification: ExpertNotification): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = [notification, ...currentNotifications];
    this.notificationsSubject.next(updatedNotifications);

    // Update unread count
    const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(unreadCount);

    // Show browser notification if enabled
    this.showBrowserNotification(notification);
  }

  // Show browser notification
  private showBrowserNotification(notification: ExpertNotification): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.body,
        icon: '/assets/icons/expert-notification.png',
        badge: '/assets/icons/qa-badge.png',
        tag: notification.id,
        requireInteraction: false,
        silent: false
      });

      browserNotification.onclick = () => {
        // Navigate to relevant question or content
        if (notification.questionId) {
          window.open(`/community/qa/${notification.questionId}`, '_blank');
        }
        browserNotification.close();
      };

      // Auto-close after 5 seconds
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    }
  }

  // Request notification permission
  requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      return Notification.requestPermission();
    }
    return Promise.resolve('denied');
  }

  // Validate notification preferences
  validatePreferences(preferences: ExpertNotificationPreferences): { [key: string]: string } {
    const errors: { [key: string]: string } = {};

    if (preferences.enableNotifications &&
      !preferences.emailNotifications &&
      !preferences.pushNotifications &&
      !preferences.browserNotifications &&
      !preferences.smsNotifications) {
      errors.channels = this.translate.instant('validation.formIncomplete');
    }

    if (preferences.categoryNotifications.length === 0 && preferences.tagNotifications.length === 0) {
      errors.filters = this.translate.instant('validation.categoryRequired');
    }

    return errors;
  }

  // Generate unique ID for notifications
  private generateId(): string {
    return `expert-notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // No-op - mock simulation removed
  simulateExpertNotifications(): void {
  }
}