import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

// Shared Components (reusing existing notification system)
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { FormButtonComponent } from '../../../../../shared/components/form-button/form-button.component';

// Services (reusing existing notification infrastructure)
import { NotificationService } from '../../../../../core/services/notification.service';
import { ToastService } from '../../../../../core/services/toast.service';

// QA Services
import { QASignalRService } from '../../../services/qa-signalr.service';

// Types
import { Notification } from '../../../../../core/models/notification.model';

export interface QANotificationData {
  id: string;
  type: 'question_answered' | 'answer_accepted' | 'answer_voted' | 'question_voted' | 'expert_notification' | 'reputation_milestone';
  title: string;
  message: string;
  questionId?: string;
  answerId?: string;
  userId?: string;
  userName?: string;
  reputationChange?: number;
  targetUrl?: string;
  createdAt: string;
  isRead: boolean;
}

@Component({
  selector: 'app-qa-notifications',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    FormButtonComponent
  ],
  template: `
    <!-- QA Notification Bell (integrates with existing notification system) -->
    <div class="relative">
      <!-- Notification Bell Button -->
      <app-form-button
        variant="ghost"
        size="md"
        (clicked)="toggleNotifications()"
        class="relative">
        <i class="fas fa-bell text-lg"></i>
        
        <!-- Unread Count Badge -->
        <span 
          *ngIf="unreadQACount > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {{ unreadQACount > 99 ? '99+' : unreadQACount }}
        </span>
      </app-form-button>

      <!-- QA Notifications Dropdown -->
      <div 
        *ngIf="showNotifications"
        class="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden">
        
        <!-- Header -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-foreground">QA Notifications</h3>
            <div class="flex gap-2">
              <app-form-button
                *ngIf="unreadQACount > 0"
                variant="ghost"
                size="sm"
                (clicked)="markAllAsRead()">
                Mark all read
              </app-form-button>
              <app-form-button
                variant="ghost"
                size="sm"
                (clicked)="closeNotifications()">
                <i class="fas fa-times"></i>
              </app-form-button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="p-8">
          <app-loading-spinner
            size="md"
            text="Loading notifications...">
          </app-loading-spinner>
        </div>

        <!-- Notifications List -->
        <div *ngIf="!loading" class="max-h-80 overflow-y-auto">
          <div *ngFor="let notification of qaNotifications; trackBy: trackByNotificationId" 
               class="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
               [class.bg-blue-50]="!notification.isRead"
               [class.dark:bg-blue-900/10]="!notification.isRead"
               (click)="handleNotificationClick(notification)">
            
            
            <!-- Notification Content -->
            <div class="flex gap-3">
              <!-- Notification Icon -->
              <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                   [class]="getNotificationIconClasses(notification)">
                <i class="fas" [class]="getNotificationIcon(notification)"></i>
              </div>

              <!-- Notification Details -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1">
                    <h4 class="text-sm font-bold text-foreground mb-1">{{ notification.title }}</h4>
                    <p class="text-sm text-muted-foreground mb-2">{{ notification.message }}</p>
                    
                    <!-- Reputation Change (if applicable) -->
                    <div *ngIf="getReputationChange(notification)" class="flex items-center gap-1 mb-2">
                      <i class="fas fa-star text-blue-500 text-xs"></i>
                      <span class="text-xs font-bold"
                            [class.text-green-600]="getReputationChange(notification)! > 0"
                            [class.text-red-600]="getReputationChange(notification)! < 0">
                        {{ getReputationChange(notification)! > 0 ? '+' : '' }}{{ getReputationChange(notification) }}
                      </span>
                    </div>

                    <!-- Timestamp -->
                    <div class="text-xs text-muted-foreground">
                      {{ formatNotificationTime(notification.createdAt) }}
                    </div>
                  </div>

                  <!-- Unread Indicator -->
                  <div *ngIf="!notification.isRead" class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="qaNotifications.length === 0" class="p-8 text-center">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-bell-slash text-2xl text-gray-400"></i>
            </div>
            <h4 class="text-sm font-bold text-foreground mb-2">No QA notifications</h4>
            <p class="text-xs text-muted-foreground">You'll see notifications here when there's activity on your questions and answers.</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <app-form-button
            variant="ghost"
            size="sm"
            fullWidth="true"
            (clicked)="viewAllNotifications()">
            View all notifications
          </app-form-button>
        </div>
      </div>
    </div>

    <!-- Overlay to close dropdown -->
    <div 
      *ngIf="showNotifications"
      class="fixed inset-0 z-40"
      (click)="closeNotifications()">
    </div>
  `,
  styles: [`
    :host {
      position: relative;
      display: inline-block;
    }
  `]
})
export class QANotificationsComponent implements OnInit, OnDestroy {
  @Input() maxDisplayCount = 10;
  @Input() autoRefreshInterval = 30000; // 30 seconds

  @Output() notificationClicked = new EventEmitter<QANotificationData>();
  @Output() allNotificationsViewed = new EventEmitter<void>();

  showNotifications = false;
  loading = false;
  qaNotifications: QANotificationData[] = [];
  unreadQACount = 0;

  private destroy$ = new Subject<void>();
  private refreshInterval?: number;

  constructor(
    private notificationService: NotificationService,
    private toastService: ToastService,
    private qaSignalRService: QASignalRService
  ) {}

  ngOnInit(): void {
    this.setupRealtimeNotifications();
    this.loadQANotifications();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  private setupRealtimeNotifications(): void {
    // Listen for QA-specific real-time notifications
    this.qaSignalRService.answerCreated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        this.handleRealtimeNotification({
          id: `answer_${event.answerId}`,
          type: 'question_answered',
          title: 'New Answer',
          message: `${event.userName} answered your question`,
          questionId: event.questionId,
          answerId: event.answerId,
          userId: event.userId,
          userName: event.userName,
          targetUrl: `/qa/questions/${event.questionId}#answer-${event.answerId}`,
          createdAt: new Date().toISOString(),
          isRead: false
        });
      });

    this.qaSignalRService.voteCreated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        const type = event.contentType === 'Question' ? 'question_voted' : 'answer_voted';
        const message = `Your ${event.contentType.toLowerCase()} received ${event.voteType === 'Up' ? 'an upvote' : 'a downvote'}`;
        
        this.handleRealtimeNotification({
          id: `vote_${event.contentId}_${Date.now()}`,
          type,
          title: 'Vote Received',
          message,
          questionId: event.contentType === 'Question' ? event.contentId : undefined,
          answerId: event.contentType === 'Answer' ? event.contentId : undefined,
          targetUrl: event.contentType === 'Question' 
            ? `/qa/questions/${event.contentId}` 
            : `/qa/questions/${event.contentId}#answer-${event.contentId}`, // Simplified - would need actual questionId
          createdAt: new Date().toISOString(),
          isRead: false
        });
      });

    this.qaSignalRService.reputationUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event.change > 0) {
          this.handleRealtimeNotification({
            id: `reputation_${Date.now()}`,
            type: 'reputation_milestone',
            title: 'Reputation Increased',
            message: `You gained ${event.change} reputation points`,
            reputationChange: event.change,
            targetUrl: '/qa/reputation',
            createdAt: new Date().toISOString(),
            isRead: false
          });
        }
      });
  }

  private handleRealtimeNotification(notification: QANotificationData): void {
    // Add to the beginning of the list
    this.qaNotifications.unshift(notification);
    
    // Keep only the max display count
    if (this.qaNotifications.length > this.maxDisplayCount) {
      this.qaNotifications = this.qaNotifications.slice(0, this.maxDisplayCount);
    }
    
    // Update unread count
    this.updateUnreadCount();
    
    // Show toast notification (reusing existing toast system)
    this.toastService.info(notification.message);
  }

  private loadQANotifications(): void {
    this.loading = true;
    
    // In a real implementation, this would call a QA-specific notification endpoint
    // For now, we'll filter general notifications for QA-related ones
    this.notificationService.getNotifications(1, this.maxDisplayCount)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.succeeded && response.data) {
            // Filter and convert general notifications to QA notifications
            this.qaNotifications = this.filterQANotifications(response.data.items);
            this.updateUnreadCount();
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Failed to load QA notifications:', error);
          this.loading = false;
        }
      });
  }

  private filterQANotifications(notifications: Notification[]): QANotificationData[] {
    return notifications
      .filter(n => this.isQANotification(n))
      .map(n => this.convertToQANotification(n));
  }

  private isQANotification(notification: Notification): boolean {
    // Check if notification is QA-related based on title, message, or targetUrl
    const qaKeywords = ['question', 'answer', 'vote', 'reputation', 'expert', 'badge'];
    const content = `${notification.title} ${notification.message} ${notification.targetUrl || ''}`.toLowerCase();
    return qaKeywords.some(keyword => content.includes(keyword));
  }

  private convertToQANotification(notification: Notification): QANotificationData {
    // Convert general notification to QA notification format
    let type: QANotificationData['type'] = 'question_answered';
    
    if (notification.message.includes('answer')) type = 'question_answered';
    else if (notification.message.includes('accepted')) type = 'answer_accepted';
    else if (notification.message.includes('vote')) type = 'answer_voted';
    else if (notification.message.includes('reputation')) type = 'reputation_milestone';
    else if (notification.message.includes('expert')) type = 'expert_notification';

    return {
      id: notification.id,
      type,
      title: notification.title,
      message: notification.message,
      targetUrl: notification.targetUrl,
      createdAt: notification.createdAt.toISOString(),
      isRead: notification.isRead
    };
  }

  private updateUnreadCount(): void {
    this.unreadQACount = this.qaNotifications.filter(n => !n.isRead).length;
  }

  private startAutoRefresh(): void {
    this.refreshInterval = window.setInterval(() => {
      if (!this.showNotifications) {
        this.loadQANotifications();
      }
    }, this.autoRefreshInterval);
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    
    if (this.showNotifications && this.qaNotifications.length === 0) {
      this.loadQANotifications();
    }
  }

  closeNotifications(): void {
    this.showNotifications = false;
  }

  handleNotificationClick(notification: QANotificationData): void {
    // Mark as read
    if (!notification.isRead) {
      notification.isRead = true;
      this.updateUnreadCount();
      
      // Mark as read in the backend (reusing existing notification service)
      this.notificationService.markAsRead(notification.id).subscribe();
    }

    // Emit click event
    this.notificationClicked.emit(notification);

    // Navigate to target URL if available
    if (notification.targetUrl) {
      // In a real app, you'd use Angular Router here
      window.location.href = notification.targetUrl;
    }

    this.closeNotifications();
  }

  markAllAsRead(): void {
    const unreadNotifications = this.qaNotifications.filter(n => !n.isRead);
    
    if (unreadNotifications.length === 0) return;

    // Mark all as read locally
    this.qaNotifications.forEach(n => n.isRead = true);
    this.updateUnreadCount();

    // Mark all as read in backend
    unreadNotifications.forEach(notification => {
      this.notificationService.markAsRead(notification.id).subscribe();
    });

    this.toastService.success('All QA notifications marked as read');
  }

  viewAllNotifications(): void {
    this.allNotificationsViewed.emit();
    this.closeNotifications();
    
    // Navigate to full notifications page
    // In a real app, you'd use Angular Router here
    window.location.href = '/notifications?filter=qa';
  }

  trackByNotificationId(_: number, notification: QANotificationData): string {
    return notification.id;
  }

  getNotificationIcon(notification: QANotificationData): string {
    switch (notification.type) {
      case 'question_answered': return 'fa-comment';
      case 'answer_accepted': return 'fa-check-circle';
      case 'answer_voted': 
      case 'question_voted': return 'fa-thumbs-up';
      case 'expert_notification': return 'fa-graduation-cap';
      case 'reputation_milestone': return 'fa-star';
      default: return 'fa-bell';
    }
  }

  getNotificationIconClasses(notification: QANotificationData): string {
    const baseClasses = 'text-white text-sm';
    
    switch (notification.type) {
      case 'question_answered': return `${baseClasses} bg-blue-500`;
      case 'answer_accepted': return `${baseClasses} bg-green-500`;
      case 'answer_voted': 
      case 'question_voted': return `${baseClasses} bg-purple-500`;
      case 'expert_notification': return `${baseClasses} bg-orange-500`;
      case 'reputation_milestone': return `${baseClasses} bg-yellow-500`;
      default: return `${baseClasses} bg-gray-500`;
    }
  }

  getReputationChange(notification: QANotificationData): number | null {
    return notification.reputationChange || null;
  }

  formatNotificationTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  }
}