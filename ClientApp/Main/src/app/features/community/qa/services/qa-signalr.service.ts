
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel, HubConnectionState } from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Question, Answer } from '../models/qa-api.types';

// Connection management and reliability types
export interface ConnectionHealth {
  status: string;
  activeConnections: number;
  staleConnections: number;
  lastHealthCheck: Date;
  averageConnectionDuration: number;
}

export interface ConnectionReliability {
  connectionSuccessRate: number;
  reconnectionSuccessRate: number;
  averageReconnectionTime: number;
  totalReconnectionAttempts: number;
  failedReconnectionAttempts: number;
}

export interface ConnectionError {
  errorType: string;
  errorMessage: string;
  timestamp: Date;
  retryAttempt: number;
  isRecoverable: boolean;
}

export enum ConnectionStatus {
  Disconnected = 'Disconnected',
  Connecting = 'Connecting',
  Connected = 'Connected',
  Reconnecting = 'Reconnecting',
  Failed = 'Failed'
}

// QA-specific SignalR event types
export interface QASignalREvents {
  // Question events
  QuestionCreated: Question;
  QuestionUpdated: Question;
  QuestionDeleted: { questionId: string };
  QuestionClosed: { questionId: string; reason: string };
  QuestionViewed: { questionId: string; viewCount: number };

  // Answer events
  AnswerCreated: Answer;
  AnswerUpdated: Answer;
  AnswerDeleted: { answerId: string; questionId: string };
  AnswerAccepted: { answerId: string; questionId: string };

  // Vote events
  VoteCreated: { contentId: string; contentType: 'Question' | 'Answer'; voteType: 'Up' | 'Down'; voteScore: number };
  VoteRemoved: { contentId: string; contentType: 'Question' | 'Answer'; voteScore: number };
  VoteChanged: { contentId: string; contentType: 'Question' | 'Answer'; voteType: 'Up' | 'Down'; voteScore: number };

  // Reputation events
  ReputationUpdated: { userId: string; reputationScore: number; change: number; reason: string };
  BadgeEarned: { userId: string; badgeName: string; description: string };

  // Expert events
  ExpertNotification: { questionId: string; category: string; title: string };

  // Typing indicators
  UserTypingAnswer: { questionId: string; userId: string; userName: string };
  UserStoppedTypingAnswer: { questionId: string; userId: string };

  // Connection events
  UserJoinedQuestion: { questionId: string; userId: string; userName: string };
  UserLeftQuestion: { questionId: string; userId: string };
}

@Injectable({
  providedIn: 'root'
})
export class QASignalRService {
  private hubConnection: HubConnection | null = null;
  private connectionStateSubject = new BehaviorSubject<ConnectionStatus>(ConnectionStatus.Disconnected);
  private reconnectingSubject = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();

  // Connection management and reliability
  private connectionHealthSubject = new BehaviorSubject<ConnectionHealth | null>(null);
  private connectionReliabilitySubject = new BehaviorSubject<ConnectionReliability | null>(null);
  private connectionErrorSubject = new Subject<ConnectionError>();
  private lastConnectionAttempt: Date | null = null;
  private connectionAttempts = 0;
  private reconnectionAttempts = 0;
  private successfulConnections = 0;
  private failedConnections = 0;
  private reconnectionTimes: number[] = [];

  // Health monitoring
  private healthCheckTimer: any;
  private pingTimer: any;
  private readonly HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
  private readonly PING_INTERVAL = 60000; // 1 minute
  private readonly MAX_RECONNECTION_ATTEMPTS = 10;
  private readonly RECONNECTION_DELAYS = [0, 2000, 5000, 10000, 30000]; // Progressive delays

  // Event subjects for different QA events
  private questionCreatedSubject = new Subject<Question>();
  private questionUpdatedSubject = new Subject<Question>();
  private questionDeletedSubject = new Subject<{ questionId: string }>();
  private questionClosedSubject = new Subject<{ questionId: string; reason: string }>();
  private questionViewedSubject = new Subject<{ questionId: string; viewCount: number }>();

  private answerCreatedSubject = new Subject<Answer>();
  private answerUpdatedSubject = new Subject<Answer>();
  private answerDeletedSubject = new Subject<{ answerId: string; questionId: string }>();
  private answerAcceptedSubject = new Subject<{ answerId: string; questionId: string }>();

  private voteCreatedSubject = new Subject<{ contentId: string; contentType: 'Question' | 'Answer'; voteType: 'Up' | 'Down'; voteScore: number }>();
  private voteRemovedSubject = new Subject<{ contentId: string; contentType: 'Question' | 'Answer'; voteScore: number }>();
  private voteChangedSubject = new Subject<{ contentId: string; contentType: 'Question' | 'Answer'; voteType: 'Up' | 'Down'; voteScore: number }>();

  private reputationUpdatedSubject = new Subject<{ userId: string; reputationScore: number; change: number; reason: string }>();
  private badgeEarnedSubject = new Subject<{ userId: string; badgeName: string; description: string }>();

  private expertNotificationSubject = new Subject<{ questionId: string; category: string; title: string }>();

  private userTypingAnswerSubject = new Subject<{ questionId: string; userId: string; userName: string }>();
  private userStoppedTypingAnswerSubject = new Subject<{ questionId: string; userId: string }>();

  private userJoinedQuestionSubject = new Subject<{ questionId: string; userId: string; userName: string }>();
  private userLeftQuestionSubject = new Subject<{ questionId: string; userId: string }>();

  // Public observables (following existing SignalR service patterns)
  public connectionState$ = this.connectionStateSubject.asObservable();
  public reconnecting$ = this.reconnectingSubject.asObservable();
  public connectionHealth$ = this.connectionHealthSubject.asObservable();
  public connectionReliability$ = this.connectionReliabilitySubject.asObservable();
  public connectionError$ = this.connectionErrorSubject.asObservable();

  // Question event observables
  public questionCreated$ = this.questionCreatedSubject.asObservable();
  public questionUpdated$ = this.questionUpdatedSubject.asObservable();
  public questionDeleted$ = this.questionDeletedSubject.asObservable();
  public questionClosed$ = this.questionClosedSubject.asObservable();
  public questionViewed$ = this.questionViewedSubject.asObservable();

  // Answer event observables
  public answerCreated$ = this.answerCreatedSubject.asObservable();
  public answerUpdated$ = this.answerUpdatedSubject.asObservable();
  public answerDeleted$ = this.answerDeletedSubject.asObservable();
  public answerAccepted$ = this.answerAcceptedSubject.asObservable();

  // Vote event observables
  public voteCreated$ = this.voteCreatedSubject.asObservable();
  public voteRemoved$ = this.voteRemovedSubject.asObservable();
  public voteChanged$ = this.voteChangedSubject.asObservable();

  // Reputation event observables
  public reputationUpdated$ = this.reputationUpdatedSubject.asObservable();
  public badgeEarned$ = this.badgeEarnedSubject.asObservable();

  // Expert event observables
  public expertNotification$ = this.expertNotificationSubject.asObservable();

  // Typing indicator observables
  public userTypingAnswer$ = this.userTypingAnswerSubject.asObservable();
  public userStoppedTypingAnswer$ = this.userStoppedTypingAnswerSubject.asObservable();

  // Connection event observables
  public userJoinedQuestion$ = this.userJoinedQuestionSubject.asObservable();
  public userLeftQuestion$ = this.userLeftQuestionSubject.asObservable();

  // Currently joined questions and categories
  private joinedQuestions = new Set<string>();
  private joinedCategories = new Set<string>();

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private toastService: ToastService
  ) {
    // Auto-connect when user is authenticated (following existing pattern)
    this.authService.currentUser$.subscribe((user: any) => {
      if (user) {
        this.startConnection();
      } else {
        this.stopConnection();
      }
    });

    // Start health monitoring
    this.startHealthMonitoring();
  }
  private async startConnection(): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      return;
    }

    this.connectionStateSubject.next(ConnectionStatus.Connecting);
    this.lastConnectionAttempt = new Date();
    this.connectionAttempts++;

    try {
      const token = this.authService.token;

      console.log('Starting QA SignalR connection...', {
        hasToken: !!token,
        hubUrl: `${environment.hubUrl}/qaHub`,
        attempt: this.connectionAttempts
      });

      this.hubConnection = new HubConnectionBuilder()
        .withUrl(`${environment.hubUrl}/qaHub`, {
          accessTokenFactory: () => token || ''
        })
        .withAutomaticReconnect(this.RECONNECTION_DELAYS)
        .configureLogging(LogLevel.Information)
        .build();

      // Set up event handlers
      this.setupEventHandlers();
      this.setupConnectionEventHandlers();

      await this.hubConnection.start();
      console.log('QA SignalR connection established successfully');

      this.connectionStateSubject.next(ConnectionStatus.Connected);
      this.successfulConnections++;
      this.reconnectionAttempts = 0; // Reset on successful connection

      // Join user group for QA notifications if authenticated
      const userId = this.authService.currentUser()?.id;
      if (userId && token) {
        try {
          await this.hubConnection.invoke('JoinUserGroup', userId);
          console.log('Joined QA user group:', userId);
        } catch (error) {
          console.error('Error joining QA user group:', error);
          this.handleConnectionError('JoinUserGroup', error);
        }
      }

      // Start periodic health checks
      this.startPeriodicHealthChecks();

    } catch (error) {
      console.error('Error starting QA SignalR connection:', error);
      this.connectionStateSubject.next(ConnectionStatus.Failed);
      this.failedConnections++;

      this.handleConnectionError('StartConnection', error);

      // Retry connection with exponential backoff if we have a token
      if (this.authService.token && this.connectionAttempts < this.MAX_RECONNECTION_ATTEMPTS) {
        const delay = this.getReconnectionDelay();
        console.log(`Retrying QA SignalR connection in ${delay}ms (attempt ${this.connectionAttempts})`);
        setTimeout(() => this.startConnection(), delay);
      }
    }
  }

  private setupConnectionEventHandlers(): void {
    if (!this.hubConnection) return;

    // Connection state changes with enhanced reliability tracking
    this.hubConnection.onreconnecting((error) => {
      console.log('QA SignalR reconnecting...', error);
      this.connectionStateSubject.next(ConnectionStatus.Reconnecting);
      this.reconnectingSubject.next(true);
      this.reconnectionAttempts++;

      this.handleConnectionError('Reconnecting', error);
    });

    this.hubConnection.onreconnected((connectionId) => {
      console.log('QA SignalR reconnected with connection ID:', connectionId);
      this.connectionStateSubject.next(ConnectionStatus.Connected);
      this.reconnectingSubject.next(false);

      // Track reconnection time
      const reconnectionTime = Date.now() - (this.lastConnectionAttempt?.getTime() || 0);
      this.reconnectionTimes.push(reconnectionTime);

      // Keep only last 10 reconnection times for average calculation
      if (this.reconnectionTimes.length > 10) {
        this.reconnectionTimes.shift();
      }

      // Rejoin user group and previously joined questions/categories
      this.rejoinAfterReconnection();

      // Update reliability metrics
      this.updateReliabilityMetrics();
    });

    this.hubConnection.onclose((error) => {
      console.log('QA SignalR connection closed', error);
      this.connectionStateSubject.next(ConnectionStatus.Disconnected);
      this.reconnectingSubject.next(false);

      if (error) {
        this.handleConnectionError('ConnectionClosed', error);
      }

      // Stop health checks
      this.stopPeriodicHealthChecks();
    });
  }
  private setupEventHandlers(): void {
    if (!this.hubConnection) return;

    // Question events
    this.hubConnection.on('QuestionCreated', (question: Question) => {
      console.log('Question created via SignalR:', question);
      this.questionCreatedSubject.next(question);
      this.showNotification('New question posted', question.title);
    });

    this.hubConnection.on('QuestionUpdated', (question: Question) => {
      console.log('Question updated via SignalR:', question);
      this.questionUpdatedSubject.next(question);
    });

    this.hubConnection.on('QuestionDeleted', (data: { questionId: string }) => {
      console.log('Question deleted via SignalR:', data);
      this.questionDeletedSubject.next(data);
    });

    this.hubConnection.on('QuestionClosed', (data: { questionId: string; reason: string }) => {
      console.log('Question closed via SignalR:', data);
      this.questionClosedSubject.next(data);
    });

    this.hubConnection.on('QuestionViewed', (data: { questionId: string; viewCount: number }) => {
      this.questionViewedSubject.next(data);
    });

    // Answer events
    this.hubConnection.on('AnswerCreated', (answer: Answer) => {
      console.log('Answer created via SignalR:', answer);
      this.answerCreatedSubject.next(answer);
      this.showNotification('New answer posted', 'Someone answered your question');
    });

    this.hubConnection.on('AnswerUpdated', (answer: Answer) => {
      console.log('Answer updated via SignalR:', answer);
      this.answerUpdatedSubject.next(answer);
    });

    this.hubConnection.on('AnswerDeleted', (data: { answerId: string; questionId: string }) => {
      console.log('Answer deleted via SignalR:', data);
      this.answerDeletedSubject.next(data);
    });

    this.hubConnection.on('AnswerAccepted', (data: { answerId: string; questionId: string }) => {
      console.log('Answer accepted via SignalR:', data);
      this.answerAcceptedSubject.next(data);
      this.showNotification('Answer accepted', 'Your answer was accepted!');
    });

    // Vote events
    this.hubConnection.on('VoteCreated', (data: { contentId: string; contentType: 'Question' | 'Answer'; voteType: 'Up' | 'Down'; voteScore: number }) => {
      console.log('Vote created via SignalR:', data);
      this.voteCreatedSubject.next(data);
    });

    this.hubConnection.on('VoteRemoved', (data: { contentId: string; contentType: 'Question' | 'Answer'; voteScore: number }) => {
      console.log('Vote removed via SignalR:', data);
      this.voteRemovedSubject.next(data);
    });

    this.hubConnection.on('VoteChanged', (data: { contentId: string; contentType: 'Question' | 'Answer'; voteType: 'Up' | 'Down'; voteScore: number }) => {
      console.log('Vote changed via SignalR:', data);
      this.voteChangedSubject.next(data);
    });

    // Reputation events
    this.hubConnection.on('ReputationUpdated', (data: { userId: string; reputationScore: number; change: number; reason: string }) => {
      console.log('Reputation updated via SignalR:', data);
      this.reputationUpdatedSubject.next(data);

      // Show notification if it's for the current user
      const currentUserId = this.authService.currentUser()?.id;
      if (currentUserId === data.userId && data.change > 0) {
        this.showNotification('Reputation increased', `+${data.change} points: ${data.reason}`);
      }
    });

    this.hubConnection.on('BadgeEarned', (data: { userId: string; badgeName: string; description: string }) => {
      console.log('Badge earned via SignalR:', data);
      this.badgeEarnedSubject.next(data);

      // Show notification if it's for the current user
      const currentUserId = this.authService.currentUser()?.id;
      if (currentUserId === data.userId) {
        this.showNotification('Badge earned!', `${data.badgeName}: ${data.description}`);
      }
    });

    // Expert events
    this.hubConnection.on('ExpertNotification', (data: { questionId: string; category: string; title: string }) => {
      console.log('Expert notification via SignalR:', data);
      this.expertNotificationSubject.next(data);
      this.showNotification('Expert notification', `New question in ${data.category}: ${data.title}`);
    });

    // Typing indicators
    this.hubConnection.on('UserTypingAnswer', (data: { questionId: string; userId: string; userName: string }) => {
      this.userTypingAnswerSubject.next(data);
    });

    this.hubConnection.on('UserStoppedTypingAnswer', (data: { questionId: string; userId: string }) => {
      this.userStoppedTypingAnswerSubject.next(data);
    });

    // Connection events
    this.hubConnection.on('UserJoinedQuestion', (data: { questionId: string; userId: string; userName: string }) => {
      this.userJoinedQuestionSubject.next(data);
    });

    this.hubConnection.on('UserLeftQuestion', (data: { questionId: string; userId: string }) => {
      this.userLeftQuestionSubject.next(data);
    });
  }
  private async rejoinAfterReconnection(): Promise<void> {
    const userId = this.authService.currentUser()?.id;
    if (!userId || !this.hubConnection) return;

    try {
      // Rejoin user group
      await this.hubConnection.invoke('JoinUserGroup', userId);

      // Rejoin previously joined questions
      for (const questionId of this.joinedQuestions) {
        await this.hubConnection.invoke('JoinQuestion', questionId);
      }

      // Rejoin previously joined categories
      for (const category of this.joinedCategories) {
        await this.hubConnection.invoke('JoinCategory', category);
      }

      console.log('Successfully rejoined QA SignalR groups after reconnection');
    } catch (error) {
      console.error('Error rejoining QA SignalR groups after reconnection:', error);
    }
  }

  // Public methods for joining/leaving question rooms
  public async joinQuestion(questionId: string): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke('JoinQuestion', questionId);
        this.joinedQuestions.add(questionId);
        console.log('Joined question room:', questionId);
      } catch (error) {
        console.error(`Error joining question ${questionId}:`, error);
        throw error;
      }
    } else {
      throw new Error('QA SignalR connection not established');
    }
  }

  public async leaveQuestion(questionId: string): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke('LeaveQuestion', questionId);
        this.joinedQuestions.delete(questionId);
        console.log('Left question room:', questionId);
      } catch (error) {
        console.error(`Error leaving question ${questionId}:`, error);
        throw error;
      }
    }
  }

  // Public methods for joining/leaving category rooms
  public async joinCategory(category: string): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke('JoinCategory', category);
        this.joinedCategories.add(category);
        console.log('Joined category room:', category);
      } catch (error) {
        console.error(`Error joining category ${category}:`, error);
        throw error;
      }
    } else {
      throw new Error('QA SignalR connection not established');
    }
  }

  public async leaveCategory(category: string): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke('LeaveCategory', category);
        this.joinedCategories.delete(category);
        console.log('Left category room:', category);
      } catch (error) {
        console.error(`Error leaving category ${category}:`, error);
        throw error;
      }
    }
  }

  // Typing indicators
  public async startTypingAnswer(questionId: string): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke('StartTypingAnswer', questionId);
      } catch (error) {
        console.error('Error sending typing indicator:', error);
      }
    }
  }

  public async stopTypingAnswer(questionId: string): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke('StopTypingAnswer', questionId);
      } catch (error) {
        console.error('Error stopping typing indicator:', error);
      }
    }
  }

  // Generic method for sending messages to the hub
  public async sendMessage(method: string, ...args: any[]): Promise<any> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        return await this.hubConnection.invoke(method, ...args);
      } catch (error) {
        console.error(`Error invoking ${method}:`, error);
        throw error;
      }
    } else {
      throw new Error('QA SignalR connection not established');
    }
  }

  public async stopConnection(): Promise<void> {
    if (this.hubConnection) {
      try {
        await this.hubConnection.stop();
        console.log('QA SignalR connection stopped');
      } catch (error) {
        console.error('Error stopping QA SignalR connection:', error);
      } finally {
        this.hubConnection = null;
        this.connectionStateSubject.next(ConnectionStatus.Disconnected);
        this.reconnectingSubject.next(false);
        this.joinedQuestions.clear();
        this.joinedCategories.clear();
        this.stopHealthMonitoring();
      }
    }
  }
  // Helper method for showing notifications
  private showNotification(title: string, message: string): void {
    try {
      // Use the global toast service for notifications
      this.toastService.info(message, title);
    } catch (error) {
      console.warn('Failed to show QA notification:', error);
    }
  }

  // Connection management and reliability methods
  private handleConnectionError(context: string, error: any): void {
    const connectionError: ConnectionError = {
      errorType: context,
      errorMessage: error?.message || error?.toString() || 'Unknown error',
      timestamp: new Date(),
      retryAttempt: this.connectionAttempts,
      isRecoverable: this.isRecoverableError(error)
    };

    this.connectionErrorSubject.next(connectionError);
    console.error(`QA SignalR ${context} error:`, error);
  }

  private isRecoverableError(error: any): boolean {
    if (!error) return true;

    const errorMessage = error.message || error.toString();
    const nonRecoverableErrors = [
      'Unauthorized',
      'Forbidden',
      'Invalid token',
      'Authentication failed'
    ];

    return !nonRecoverableErrors.some(msg => errorMessage.includes(msg));
  }

  private getReconnectionDelay(): number {
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const exponentialDelay = Math.min(baseDelay * Math.pow(2, this.connectionAttempts - 1), maxDelay);

    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 1000;
    return exponentialDelay + jitter;
  }

  private startHealthMonitoring(): void {
    // Start periodic health checks
    this.healthCheckTimer = setInterval(() => {
      this.performHealthCheck();
    }, this.HEALTH_CHECK_INTERVAL);

    // Start periodic ping
    this.pingTimer = setInterval(() => {
      this.performPing();
    }, this.PING_INTERVAL);
  }

  private stopHealthMonitoring(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  private startPeriodicHealthChecks(): void {
    // Request health information from server
    this.requestConnectionHealth();
  }

  private stopPeriodicHealthChecks(): void {
    // Health checks are stopped when connection is closed
  }

  private async performHealthCheck(): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        const health = await this.hubConnection.invoke('GetConnectionHealth');
        this.connectionHealthSubject.next(health);
      } catch (error) {
        console.warn('Failed to get connection health:', error);
      }
    }
  }

  private async performPing(): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        const response = await this.hubConnection.invoke('Ping');
        console.debug('QA SignalR ping response:', response);
      } catch (error) {
        console.warn('QA SignalR ping failed:', error);
        this.handleConnectionError('Ping', error);
      }
    }
  }

  private updateReliabilityMetrics(): void {
    const totalAttempts = this.successfulConnections + this.failedConnections;
    const connectionSuccessRate = totalAttempts > 0 ? (this.successfulConnections / totalAttempts) * 100 : 0;

    const totalReconnectionAttempts = this.reconnectionAttempts;
    const successfulReconnections = this.reconnectionTimes.length;
    const reconnectionSuccessRate = totalReconnectionAttempts > 0 ?
      (successfulReconnections / totalReconnectionAttempts) * 100 : 0;

    const averageReconnectionTime = this.reconnectionTimes.length > 0 ?
      this.reconnectionTimes.reduce((a, b) => a + b, 0) / this.reconnectionTimes.length : 0;

    const reliability: ConnectionReliability = {
      connectionSuccessRate,
      reconnectionSuccessRate,
      averageReconnectionTime,
      totalReconnectionAttempts,
      failedReconnectionAttempts: totalReconnectionAttempts - successfulReconnections
    };

    this.connectionReliabilitySubject.next(reliability);
  }
  // Public methods for connection management
  public async requestConnectionHealth(): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        const health = await this.hubConnection.invoke('GetConnectionHealth');
        this.connectionHealthSubject.next(health);
      } catch (error) {
        console.error('Failed to request connection health:', error);
        throw error;
      }
    } else {
      throw new Error('QA SignalR connection not established');
    }
  }

  public async testConnection(message: string = 'test'): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke('TestConnection', message);
      } catch (error) {
        console.error('Connection test failed:', error);
        throw error;
      }
    } else {
      throw new Error('QA SignalR connection not established');
    }
  }

  public forceReconnect(): void {
    console.log('Forcing QA SignalR reconnection...');
    this.stopConnection().then(() => {
      setTimeout(() => this.startConnection(), 1000);
    });
  }

  public getConnectionStats(): any {
    return {
      connectionAttempts: this.connectionAttempts,
      successfulConnections: this.successfulConnections,
      failedConnections: this.failedConnections,
      reconnectionAttempts: this.reconnectionAttempts,
      averageReconnectionTime: this.reconnectionTimes.length > 0 ?
        this.reconnectionTimes.reduce((a, b) => a + b, 0) / this.reconnectionTimes.length : 0,
      currentState: this.connectionStateSubject.value,
      isConnected: this.isConnected,
      isReconnecting: this.isReconnecting
    };
  }

  // Getters for current state
  public get isConnected(): boolean {
    return this.hubConnection?.state === HubConnectionState.Connected;
  }

  public get isReconnecting(): boolean {
    return this.reconnectingSubject.value;
  }

  public get connectionStatus(): ConnectionStatus {
    return this.connectionStateSubject.value;
  }

  public get joinedQuestionIds(): string[] {
    return Array.from(this.joinedQuestions);
  }

  public get joinedCategoryNames(): string[] {
    return Array.from(this.joinedCategories);
  }

  // Cleanup
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopHealthMonitoring();
    this.stopConnection();
  }
}