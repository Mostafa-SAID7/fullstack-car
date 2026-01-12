import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil, filter, map, distinctUntilChanged } from 'rxjs/operators';

// Core Services
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ToastService } from '../../../core/services/toast.service';

// QA Services
import { QASignalRService, ConnectionStatus } from './qa-signalr.service';

// Types
import { Question, Answer, QuestionDetail } from '../../../shared/types/qa-api.types';

export interface QAIntegrationState {
  isConnected: boolean;
  isReconnecting: boolean;
  connectionStatus: ConnectionStatus;
  currentUserId: string | null;
  joinedQuestions: string[];
  joinedCategories: string[];
  typingUsers: Map<string, string[]>; // questionId -> userIds
  notifications: QANotification[];
}

export interface QANotification {
  id: string;
  type: 'answer' | 'vote' | 'acceptance' | 'badge' | 'expert';
  title: string;
  message: string;
  questionId?: string;
  answerId?: string;
  userId?: string;
  timestamp: Date;
  isRead: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class QAIntegrationService implements OnDestroy {
  private destroy$ = new Subject<void>();
  
  // State management
  private stateSubject = new BehaviorSubject<QAIntegrationState>({
    isConnected: false,
    isReconnecting: false,
    connectionStatus: ConnectionStatus.Disconnected,
    currentUserId: null,
    joinedQuestions: [],
    joinedCategories: [],
    typingUsers: new Map(),
    notifications: []
  });

  public state$ = this.stateSubject.asObservable();

  // Convenience observables
  public isConnected$ = this.state$.pipe(
    map(state => state.isConnected),
    distinctUntilChanged()
  );

  public connectionStatus$ = this.state$.pipe(
    map(state => state.connectionStatus),
    distinctUntilChanged()
  );

  public notifications$ = this.state$.pipe(
    map(state => state.notifications),
    distinctUntilChanged()
  );

  public unreadNotificationCount$ = this.notifications$.pipe(
    map(notifications => notifications.filter(n => !n.isRead).length)
  );

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private toastService: ToastService,
    private qaSignalRService: QASignalRService
  ) {
    this.initializeIntegration();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeIntegration(): void {
    // Monitor authentication state
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.updateState({
          currentUserId: user?.id || null
        });
      });

    // Monitor SignalR connection state
    this.qaSignalRService.connectionState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.updateState({
          connectionStatus: status,
          isConnected: status === ConnectionStatus.Connected
        });
      });

    // Monitor reconnection state
    this.qaSignalRService.reconnecting$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isReconnecting => {
        this.updateState({ isReconnecting });
      });

    // Setup real-time event handlers
    this.setupRealTimeEventHandlers();

    // Setup notification integration
    this.setupNotificationIntegration();
  }

  private setupRealTimeEventHandlers(): void {
    // Question events
    this.qaSignalRService.questionCreated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(question => {
        this.handleQuestionCreated(question);
      });

    // Answer events
    this.qaSignalRService.answerCreated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(answer => {
        this.handleAnswerCreated(answer);
      });

    this.qaSignalRService.answerAccepted$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        this.handleAnswerAccepted(event);
      });

    // Vote events
    this.qaSignalRService.voteCreated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        this.handleVoteCreated(event);
      });

    // Reputation events
    this.qaSignalRService.reputationUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        this.handleReputationUpdated(event);
      });

    this.qaSignalRService.badgeEarned$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        this.handleBadgeEarned(event);
      });

    // Expert events
    this.qaSignalRService.expertNotification$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        this.handleExpertNotification(event);
      });

    // Typing indicators
    this.qaSignalRService.userTypingAnswer$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        this.handleUserTyping(event.questionId, event.userId, true);
      });

    this.qaSignalRService.userStoppedTypingAnswer$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        this.handleUserTyping(event.questionId, event.userId, false);
      });
  }

  private setupNotificationIntegration(): void {
    // Integrate with the main notification system
    this.notifications$
      .pipe(
        takeUntil(this.destroy$),
        filter(notifications => notifications.length > 0)
      )
      .subscribe(notifications => {
        // Update the main notification service with QA notifications
        const unreadCount = notifications.filter(n => !n.isRead).length;
        // TODO: Integrate with main notification service if needed
      });
  }

  // Event Handlers
  private handleQuestionCreated(question: Question): void {
    const currentUserId = this.stateSubject.value.currentUserId;
    
    // Don't notify about own questions
    if (question.userId === currentUserId) return;

    const notification: QANotification = {
      id: `question-${question.id}-${Date.now()}`,
      type: 'answer',
      title: 'New Question Posted',
      message: question.title,
      questionId: question.id,
      timestamp: new Date(),
      isRead: false
    };

    this.addNotification(notification);
    this.showToastNotification('New question posted', question.title);
  }

  private handleAnswerCreated(answer: Answer): void {
    const currentUserId = this.stateSubject.value.currentUserId;
    
    // Don't notify about own answers
    if (answer.userId === currentUserId) return;

    const notification: QANotification = {
      id: `answer-${answer.id}-${Date.now()}`,
      type: 'answer',
      title: 'New Answer Posted',
      message: 'Someone answered a question you\'re following',
      questionId: answer.questionId,
      answerId: answer.id,
      timestamp: new Date(),
      isRead: false
    };

    this.addNotification(notification);
    this.showToastNotification('New answer posted', 'Check out the latest response');
  }

  private handleAnswerAccepted(event: { answerId: string; questionId: string }): void {
    const currentUserId = this.stateSubject.value.currentUserId;

    const notification: QANotification = {
      id: `accepted-${event.answerId}-${Date.now()}`,
      type: 'acceptance',
      title: 'Answer Accepted',
      message: 'An answer was accepted',
      questionId: event.questionId,
      answerId: event.answerId,
      timestamp: new Date(),
      isRead: false
    };

    this.addNotification(notification);
    this.showToastNotification('Answer accepted', 'Great job helping the community!');
  }

  private handleVoteCreated(event: { contentId: string; contentType: 'Question' | 'Answer'; voteType: 'Up' | 'Down'; voteScore: number }): void {
    // Only show notifications for upvotes to avoid spam
    if (event.voteType === 'Up') {
      this.showToastNotification('Content upvoted', `Your ${event.contentType.toLowerCase()} received an upvote!`);
    }
  }

  private handleReputationUpdated(event: { userId: string; reputationScore: number; change: number; reason: string }): void {
    const currentUserId = this.stateSubject.value.currentUserId;
    
    // Only show for current user and positive changes
    if (event.userId === currentUserId && event.change > 0) {
      const notification: QANotification = {
        id: `reputation-${event.userId}-${Date.now()}`,
        type: 'vote',
        title: 'Reputation Increased',
        message: `+${event.change} points: ${event.reason}`,
        userId: event.userId,
        timestamp: new Date(),
        isRead: false
      };

      this.addNotification(notification);
      this.showToastNotification('Reputation increased!', `+${event.change} points: ${event.reason}`);
    }
  }

  private handleBadgeEarned(event: { userId: string; badgeName: string; description: string }): void {
    const currentUserId = this.stateSubject.value.currentUserId;
    
    // Only show for current user
    if (event.userId === currentUserId) {
      const notification: QANotification = {
        id: `badge-${event.userId}-${Date.now()}`,
        type: 'badge',
        title: 'Badge Earned!',
        message: `${event.badgeName}: ${event.description}`,
        userId: event.userId,
        timestamp: new Date(),
        isRead: false
      };

      this.addNotification(notification);
      this.showToastNotification('Badge earned!', `${event.badgeName}: ${event.description}`);
    }
  }

  private handleExpertNotification(event: { questionId: string; category: string; title: string }): void {
    const notification: QANotification = {
      id: `expert-${event.questionId}-${Date.now()}`,
      type: 'expert',
      title: 'Expert Notification',
      message: `New question in ${event.category}: ${event.title}`,
      questionId: event.questionId,
      timestamp: new Date(),
      isRead: false
    };

    this.addNotification(notification);
    this.showToastNotification('Expert notification', `New question in ${event.category}`);
  }

  private handleUserTyping(questionId: string, userId: string, isTyping: boolean): void {
    const currentState = this.stateSubject.value;
    const typingUsers = new Map(currentState.typingUsers);
    
    if (!typingUsers.has(questionId)) {
      typingUsers.set(questionId, []);
    }

    const questionTypingUsers = typingUsers.get(questionId)!;
    const userIndex = questionTypingUsers.indexOf(userId);

    if (isTyping && userIndex === -1) {
      questionTypingUsers.push(userId);
    } else if (!isTyping && userIndex > -1) {
      questionTypingUsers.splice(userIndex, 1);
    }

    // Clean up empty arrays
    if (questionTypingUsers.length === 0) {
      typingUsers.delete(questionId);
    }

    this.updateState({ typingUsers });
  }

  // Public Methods
  public async joinQuestion(questionId: string): Promise<void> {
    try {
      await this.qaSignalRService.joinQuestion(questionId);
      
      const currentState = this.stateSubject.value;
      const joinedQuestions = [...currentState.joinedQuestions];
      
      if (!joinedQuestions.includes(questionId)) {
        joinedQuestions.push(questionId);
        this.updateState({ joinedQuestions });
      }
    } catch (error) {
      console.error('Failed to join question:', error);
      this.toastService.error('Failed to join question for real-time updates', 'Connection Error');
    }
  }

  public async leaveQuestion(questionId: string): Promise<void> {
    try {
      await this.qaSignalRService.leaveQuestion(questionId);
      
      const currentState = this.stateSubject.value;
      const joinedQuestions = currentState.joinedQuestions.filter(id => id !== questionId);
      
      // Clean up typing users for this question
      const typingUsers = new Map(currentState.typingUsers);
      typingUsers.delete(questionId);
      
      this.updateState({ joinedQuestions, typingUsers });
    } catch (error) {
      console.error('Failed to leave question:', error);
    }
  }

  public async joinCategory(category: string): Promise<void> {
    try {
      await this.qaSignalRService.joinCategory(category);
      
      const currentState = this.stateSubject.value;
      const joinedCategories = [...currentState.joinedCategories];
      
      if (!joinedCategories.includes(category)) {
        joinedCategories.push(category);
        this.updateState({ joinedCategories });
      }
    } catch (error) {
      console.error('Failed to join category:', error);
      this.toastService.error('Failed to join category for expert notifications', 'Connection Error');
    }
  }

  public async leaveCategory(category: string): Promise<void> {
    try {
      await this.qaSignalRService.leaveCategory(category);
      
      const currentState = this.stateSubject.value;
      const joinedCategories = currentState.joinedCategories.filter(cat => cat !== category);
      
      this.updateState({ joinedCategories });
    } catch (error) {
      console.error('Failed to leave category:', error);
    }
  }

  public getTypingUsersForQuestion(questionId: string): string[] {
    const currentState = this.stateSubject.value;
    return currentState.typingUsers.get(questionId) || [];
  }

  public markNotificationAsRead(notificationId: string): void {
    const currentState = this.stateSubject.value;
    const notifications = currentState.notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    );
    
    this.updateState({ notifications });
  }

  public markAllNotificationsAsRead(): void {
    const currentState = this.stateSubject.value;
    const notifications = currentState.notifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    
    this.updateState({ notifications });
  }

  public clearNotifications(): void {
    this.updateState({ notifications: [] });
  }

  // Connection Management
  public forceReconnect(): void {
    this.qaSignalRService.forceReconnect();
  }

  public getConnectionStats(): any {
    return this.qaSignalRService.getConnectionStats();
  }

  // Private Helpers
  private updateState(partialState: Partial<QAIntegrationState>): void {
    const currentState = this.stateSubject.value;
    const newState = { ...currentState, ...partialState };
    this.stateSubject.next(newState);
  }

  private addNotification(notification: QANotification): void {
    const currentState = this.stateSubject.value;
    const notifications = [notification, ...currentState.notifications];
    
    // Keep only the last 50 notifications
    if (notifications.length > 50) {
      notifications.splice(50);
    }
    
    this.updateState({ notifications });
  }

  private showToastNotification(title: string, message: string): void {
    // Use the existing toast service with consistent styling
    this.toastService.info(message, title);
  }
}