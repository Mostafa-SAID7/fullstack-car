import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

// QA Real-time Event Types
export interface QARealtimeEvent {
  type: 'QuestionCreated' | 'AnswerCreated' | 'VoteCreated' | 'AnswerAccepted' | 'ReputationUpdated' | 'BadgeEarned';
  data: any;
  timestamp: string;
  userId?: string;
}

export interface QuestionCreatedEvent {
  questionId: string;
  title: string;
  category: string;
  tags: string[];
  userId: string;
  userName: string;
}

export interface AnswerCreatedEvent {
  answerId: string;
  questionId: string;
  content: string;
  userId: string;
  userName: string;
}

export interface VoteCreatedEvent {
  contentId: string;
  contentType: 'Question' | 'Answer';
  voteType: 'Up' | 'Down';
  newVoteScore: number;
  userId: string;
}

export interface AnswerAcceptedEvent {
  answerId: string;
  questionId: string;
  userId: string;
  userName: string;
}

export interface ReputationUpdatedEvent {
  userId: string;
  userName: string;
  oldReputation: number;
  newReputation: number;
  change: number;
  reason: string;
}

export interface BadgeEarnedEvent {
  userId: string;
  userName: string;
  badgeName: string;
  badgeDescription: string;
}

export interface TypingIndicatorEvent {
  questionId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class QASignalRService {
  private hubConnection: HubConnection | null = null;
  private connectionStateSubject = new BehaviorSubject<boolean>(false);
  private reconnectingSubject = new BehaviorSubject<boolean>(false);

  // Event subjects for different QA events
  private questionCreatedSubject = new Subject<QuestionCreatedEvent>();
  private answerCreatedSubject = new Subject<AnswerCreatedEvent>();
  private voteCreatedSubject = new Subject<VoteCreatedEvent>();
  private answerAcceptedSubject = new Subject<AnswerAcceptedEvent>();
  private reputationUpdatedSubject = new Subject<ReputationUpdatedEvent>();
  private badgeEarnedSubject = new Subject<BadgeEarnedEvent>();
  private typingIndicatorSubject = new Subject<TypingIndicatorEvent>();
  private generalEventSubject = new Subject<QARealtimeEvent>();

  // Public observables following existing patterns
  public connectionState$ = this.connectionStateSubject.asObservable();
  public reconnecting$ = this.reconnectingSubject.asObservable();
  public questionCreated$ = this.questionCreatedSubject.asObservable();
  public answerCreated$ = this.answerCreatedSubject.asObservable();
  public voteCreated$ = this.voteCreatedSubject.asObservable();
  public answerAccepted$ = this.answerAcceptedSubject.asObservable();
  public reputationUpdated$ = this.reputationUpdatedSubject.asObservable();
  public badgeEarned$ = this.badgeEarnedSubject.asObservable();
  public typingIndicator$ = this.typingIndicatorSubject.asObservable();
  public qaEvents$ = this.generalEventSubject.asObservable();

  // Current joined rooms/questions
  private joinedQuestions = new Set<string>();
  private joinedCategories = new Set<string>();

  constructor(private authService: AuthService) {
    // Auto-connect when user is authenticated (following existing SignalR pattern)
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.startConnection();
      } else {
        this.stopConnection();
      }
    });
  }

  private async startConnection(): Promise<void> {
    if (this.hubConnection?.state === 'Connected') {
      return;
    }

    try {
      const token = this.authService.token;
      
      console.log('Starting QA SignalR connection...', {
        hasToken: !!token,
        hubUrl: `${environment.hubUrl}/qaHub`
      });

      this.hubConnection = new HubConnectionBuilder()
        .withUrl(`${environment.hubUrl}/qaHub`, {
          accessTokenFactory: () => token || ''
        })
        .withAutomaticReconnect([0, 2000, 10000, 30000]) // Retry intervals
        .configureLogging(LogLevel.Information)
        .build();

      // Set up event handlers
      this.setupEventHandlers();

      await this.hubConnection.start();
      console.log('QA SignalR connection established successfully');
      this.connectionStateSubject.next(true);

      // Join user group for QA notifications if authenticated
      const userId = this.authService.currentUser?.id;
      if (userId && token) {
        try {
          await this.hubConnection.invoke('JoinUserGroup', userId);
          console.log('Joined QA user group:', userId);
        } catch (error) {
          console.error('Error joining QA user group:', error);
        }
      }

    } catch (error) {
      console.error('Error starting QA SignalR connection:', error);
      this.connectionStateSubject.next(false);
      
      // Retry connection after delay only if we have a token
      if (this.authService.token) {
        setTimeout(() => this.startConnection(), 5000);
      }
    }
  }

  private setupEventHandlers(): void {
    if (!this.hubConnection) return;

    // Question events
    this.hubConnection.on('QuestionCreated', (event: QuestionCreatedEvent) => {
      console.log('Question created event received:', event);
      this.questionCreatedSubject.next(event);
      this.generalEventSubject.next({
        type: 'QuestionCreated',
        data: event,
        timestamp: new Date().toISOString(),
        userId: event.userId
      });
    });

    // Answer events
    this.hubConnection.on('AnswerCreated', (event: AnswerCreatedEvent) => {
      console.log('Answer created event received:', event);
      this.answerCreatedSubject.next(event);
      this.generalEventSubject.next({
        type: 'AnswerCreated',
        data: event,
        timestamp: new Date().toISOString(),
        userId: event.userId
      });
    });

    // Vote events
    this.hubConnection.on('VoteCreated', (event: VoteCreatedEvent) => {
      console.log('Vote created event received:', event);
      this.voteCreatedSubject.next(event);
      this.generalEventSubject.next({
        type: 'VoteCreated',
        data: event,
        timestamp: new Date().toISOString(),
        userId: event.userId
      });
    });

    // Answer acceptance events
    this.hubConnection.on('AnswerAccepted', (event: AnswerAcceptedEvent) => {
      console.log('Answer accepted event received:', event);
      this.answerAcceptedSubject.next(event);
      this.generalEventSubject.next({
        type: 'AnswerAccepted',
        data: event,
        timestamp: new Date().toISOString(),
        userId: event.userId
      });
    });

    // Reputation events
    this.hubConnection.on('ReputationUpdated', (event: ReputationUpdatedEvent) => {
      console.log('Reputation updated event received:', event);
      this.reputationUpdatedSubject.next(event);
      this.generalEventSubject.next({
        type: 'ReputationUpdated',
        data: event,
        timestamp: new Date().toISOString(),
        userId: event.userId
      });
    });

    // Badge events
    this.hubConnection.on('BadgeEarned', (event: BadgeEarnedEvent) => {
      console.log('Badge earned event received:', event);
      this.badgeEarnedSubject.next(event);
      this.generalEventSubject.next({
        type: 'BadgeEarned',
        data: event,
        timestamp: new Date().toISOString(),
        userId: event.userId
      });
    });

    // Typing indicator events
    this.hubConnection.on('TypingIndicator', (event: TypingIndicatorEvent) => {
      console.log('Typing indicator event received:', event);
      this.typingIndicatorSubject.next(event);
    });

    // Connection state events (following existing pattern)
    this.hubConnection.onreconnecting(() => {
      console.log('QA SignalR reconnecting...');
      this.connectionStateSubject.next(false);
      this.reconnectingSubject.next(true);
    });

    this.hubConnection.onreconnected(() => {
      console.log('QA SignalR reconnected');
      this.connectionStateSubject.next(true);
      this.reconnectingSubject.next(false);
      
      // Rejoin user group and previously joined rooms after reconnection
      this.rejoinAfterReconnection();
    });

    this.hubConnection.onclose(() => {
      console.log('QA SignalR connection closed');
      this.connectionStateSubject.next(false);
      this.reconnectingSubject.next(false);
    });
  }

  private async rejoinAfterReconnection(): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== 'Connected') {
      return;
    }

    try {
      // Rejoin user group
      const userId = this.authService.currentUser?.id;
      if (userId) {
        await this.hubConnection.invoke('JoinUserGroup', userId);
      }

      // Rejoin previously joined questions
      for (const questionId of this.joinedQuestions) {
        await this.hubConnection.invoke('JoinQuestion', questionId);
      }

      // Rejoin previously joined categories
      for (const category of this.joinedCategories) {
        await this.hubConnection.invoke('JoinCategory', category);
      }

      console.log('Successfully rejoined QA groups after reconnection');
    } catch (error) {
      console.error('Error rejoining QA groups after reconnection:', error);
    }
  }

  // Public methods for joining/leaving question rooms
  async joinQuestion(questionId: string): Promise<void> {
    if (this.hubConnection?.state === 'Connected') {
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

  async leaveQuestion(questionId: string): Promise<void> {
    if (this.hubConnection?.state === 'Connected') {
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
  async joinCategory(category: string): Promise<void> {
    if (this.hubConnection?.state === 'Connected') {
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

  async leaveCategory(category: string): Promise<void> {
    if (this.hubConnection?.state === 'Connected') {
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
  async startTyping(questionId: string): Promise<void> {
    if (this.hubConnection?.state === 'Connected') {
      try {
        await this.hubConnection.invoke('StartTyping', questionId);
      } catch (error) {
        console.error('Error sending start typing indicator:', error);
      }
    }
  }

  async stopTyping(questionId: string): Promise<void> {
    if (this.hubConnection?.state === 'Connected') {
      try {
        await this.hubConnection.invoke('StopTyping', questionId);
      } catch (error) {
        console.error('Error sending stop typing indicator:', error);
      }
    }
  }

  // Generic method for sending messages to the hub
  public async sendMessage(method: string, ...args: any[]): Promise<any> {
    if (this.hubConnection?.state === 'Connected') {
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
        this.connectionStateSubject.next(false);
        this.reconnectingSubject.next(false);
        this.joinedQuestions.clear();
        this.joinedCategories.clear();
      }
    }
  }

  // Getters following existing patterns
  public get isConnected(): boolean {
    return this.hubConnection?.state === 'Connected';
  }

  public get isReconnecting(): boolean {
    return this.reconnectingSubject.value;
  }

  public get joinedQuestionIds(): string[] {
    return Array.from(this.joinedQuestions);
  }

  public get joinedCategoryNames(): string[] {
    return Array.from(this.joinedCategories);
  }
}