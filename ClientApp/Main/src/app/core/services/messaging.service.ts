import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, combineLatest, of } from 'rxjs';
import { tap, catchError, map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SignalRService } from './signalr.service';
import { NotificationService } from './notification.service';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';
import * as signalR from '@microsoft/signalr';
import type {
  ConversationDto,
  MessageDto,
  CreateConversationRequest,
  SendMessageRequest,
  ConversationListResponse,
  MessageListResponse,
  ConversationFilters,
  MessageFilters,
  TypingIndicator,
  OnlineStatus,
  MessageEvent,
  ConversationEvent,
  TypingEvent,
  OnlineStatusEvent,
  PushNotificationPayload,
  RegisterPushRequest,
  MessagingNotificationPreferences
} from '../../features/messaging/models/messaging.model';
import {
  MessageType,
  MessageStatus,
  ConversationType
} from '../../features/messaging/models/messaging.model';
import { ApiResponse } from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private http = inject(HttpClient);
  private signalRService = inject(SignalRService);
  private notificationService = inject(NotificationService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  private readonly apiUrl = '/api/messaging';
  private messagingConnection: signalR.HubConnection | null = null;

  // Reactive state using signals
  private _conversations = signal<ConversationDto[]>([]);
  private _activeConversation = signal<ConversationDto | null>(null);
  private _messages = signal<MessageDto[]>([]);
  private _typingUsers = signal<TypingIndicator[]>([]);
  private _onlineUsers = signal<OnlineStatus[]>([]);
  private _unreadCount = signal<number>(0);
  private _isConnected = signal<boolean>(false);
  private _isLoading = signal<boolean>(false);

  // Public readonly signals
  readonly conversations = this._conversations.asReadonly();
  readonly activeConversation = this._activeConversation.asReadonly();
  readonly messages = this._messages.asReadonly();
  readonly typingUsers = this._typingUsers.asReadonly();
  readonly onlineUsers = this._onlineUsers.asReadonly();
  readonly unreadCount = this._unreadCount.asReadonly();
  readonly isConnected = this._isConnected.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  // Computed values
  readonly totalConversations = computed(() => this._conversations().length);
  readonly unreadConversations = computed(() => 
    this._conversations().filter(c => c.unreadCount > 0)
  );
  readonly activeConversationMessages = computed(() => {
    const activeId = this._activeConversation()?.id;
    return activeId ? this._messages().filter(m => m.conversationId === activeId) : [];
  });

  // Subjects for real-time events
  private messageReceivedSubject = new Subject<MessageDto>();
  private conversationUpdatedSubject = new Subject<ConversationDto>();
  private typingSubject = new Subject<TypingIndicator>();
  private onlineStatusSubject = new Subject<OnlineStatus>();

  // Public observables
  readonly messageReceived$ = this.messageReceivedSubject.asObservable();
  readonly conversationUpdated$ = this.conversationUpdatedSubject.asObservable();
  readonly typingIndicator$ = this.typingSubject.asObservable();
  readonly onlineStatusChanged$ = this.onlineStatusSubject.asObservable();

  constructor() {
    this.initializeMessagingConnection();
    this.loadConversations();
  }

  /**
   * Initialize SignalR connection for messaging
   */
  private async initializeMessagingConnection(): Promise<void> {
    try {
      const hubUrl = `${environment.apiUrl}/hubs/messaging`;
      const token = localStorage.getItem('auth_token') || '';

      this.messagingConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Set up event handlers
      this.setupMessageEventHandlers();

      await this.messagingConnection.start();
      this._isConnected.set(true);
      console.log('Messaging SignalR connected');
    } catch (error) {
      console.error('Failed to connect to messaging hub:', error);
      this._isConnected.set(false);
    }
  }

  /**
   * Set up SignalR event handlers
   */
  private setupMessageEventHandlers(): void {
    if (!this.messagingConnection) return;

    // Message events
    this.messagingConnection.on('MessageReceived', (event: MessageEvent) => {
      this.handleMessageReceived(event.message);
    });

    this.messagingConnection.on('MessageDelivered', (event: MessageEvent) => {
      this.updateMessageStatus(event.message.id, MessageStatus.Delivered);
    });

    this.messagingConnection.on('MessageRead', (event: MessageEvent) => {
      this.updateMessageStatus(event.message.id, MessageStatus.Read);
    });

    // Conversation events
    this.messagingConnection.on('ConversationCreated', (event: ConversationEvent) => {
      this.handleConversationCreated(event.conversation);
    });

    this.messagingConnection.on('ConversationUpdated', (event: ConversationEvent) => {
      this.handleConversationUpdated(event.conversation);
    });

    // Typing events
    this.messagingConnection.on('UserTyping', (event: TypingEvent) => {
      this.handleTypingEvent(event);
    });

    // Online status events
    this.messagingConnection.on('UserOnlineStatusChanged', (event: OnlineStatusEvent) => {
      this.handleOnlineStatusChanged(event);
    });

    // Connection events
    this.messagingConnection.onreconnected(() => {
      this._isConnected.set(true);
      this.loadConversations();
    });

    this.messagingConnection.onclose(() => {
      this._isConnected.set(false);
    });
  }

  /**
   * Load user conversations
   */
  loadConversations(filters?: ConversationFilters): Observable<ConversationListResponse> {
    this._isLoading.set(true);
    
    let params = new HttpParams();
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.pageSize) params = params.set('pageSize', filters.pageSize.toString());
    if (filters?.type) params = params.set('type', filters.type);
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.isArchived !== undefined) params = params.set('isArchived', filters.isArchived.toString());
    if (filters?.isMuted !== undefined) params = params.set('isMuted', filters.isMuted.toString());

    return this.http.get<ConversationListResponse>(`${this.apiUrl}/conversations`, { params })
      .pipe(
        tap(response => {
          this._conversations.set(response.conversations);
          this.updateUnreadCount();
          this._isLoading.set(false);
        }),
        catchError(error => {
          console.error('Failed to load conversations:', error);
          this._isLoading.set(false);
          return of({ conversations: [], totalCount: 0, page: 1, pageSize: 20, totalPages: 0 });
        })
      );
  }

  /**
   * Get conversation messages
   */
  getMessages(conversationId: string, filters?: MessageFilters): Observable<MessageListResponse> {
    let params = new HttpParams();
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.pageSize) params = params.set('pageSize', filters.pageSize.toString());
    if (filters?.type) params = params.set('type', filters.type);
    if (filters?.senderId) params = params.set('senderId', filters.senderId);
    if (filters?.startDate) params = params.set('startDate', filters.startDate);
    if (filters?.endDate) params = params.set('endDate', filters.endDate);
    if (filters?.search) params = params.set('search', filters.search);

    return this.http.get<MessageListResponse>(`${this.apiUrl}/conversations/${conversationId}/messages`, { params })
      .pipe(
        tap(response => {
          if (filters?.page === 1 || !filters?.page) {
            this._messages.set(response.messages);
          } else {
            this._messages.update(messages => [...messages, ...response.messages]);
          }
        })
      );
  }

  /**
   * Create new conversation
   */
  createConversation(request: CreateConversationRequest): Observable<ConversationDto> {
    return this.http.post<ApiResponse<ConversationDto>>(`${this.apiUrl}/conversations`, request)
      .pipe(
        map(response => response.data!),
        tap(conversation => {
          this._conversations.update(conversations => [conversation, ...conversations]);
          this.toastService.success('Conversation created successfully');
        })
      );
  }

  /**
   * Send message
   */
  sendMessage(request: SendMessageRequest): Observable<MessageDto> {
    const formData = new FormData();
    formData.append('conversationId', request.conversationId);
    formData.append('type', request.type);
    formData.append('content', request.content);
    
    if (request.replyToId) {
      formData.append('replyToId', request.replyToId);
    }
    
    if (request.attachments?.length) {
      request.attachments.forEach((file, index) => {
        formData.append(`attachments_${index}`, file);
      });
    }

    return this.http.post<ApiResponse<MessageDto>>(`${this.apiUrl}/messages`, formData)
      .pipe(
        map(response => response.data!),
        tap(message => {
          this.handleMessageSent(message);
        })
      );
  }

  /**
   * Mark message as read
   */
  markMessageAsRead(messageId: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/messages/${messageId}/read`, {})
      .pipe(
        map(() => void 0),
        tap(() => {
          this.updateMessageStatus(messageId, MessageStatus.Read);
        })
      );
  }

  /**
   * Mark conversation as read
   */
  markConversationAsRead(conversationId: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/conversations/${conversationId}/read`, {})
      .pipe(
        map(() => void 0),
        tap(() => {
          this._conversations.update(conversations =>
            conversations.map(c => 
              c.id === conversationId ? { ...c, unreadCount: 0 } : c
            )
          );
          this.updateUnreadCount();
        })
      );
  }

  /**
   * Delete message
   */
  deleteMessage(messageId: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/messages/${messageId}`)
      .pipe(
        map(() => void 0),
        tap(() => {
          this._messages.update(messages => messages.filter(m => m.id !== messageId));
        })
      );
  }

  /**
   * Edit message
   */
  editMessage(messageId: string, content: string): Observable<MessageDto> {
    return this.http.put<ApiResponse<MessageDto>>(`${this.apiUrl}/messages/${messageId}`, { content })
      .pipe(
        map(response => response.data!),
        tap(message => {
          this._messages.update(messages =>
            messages.map(m => m.id === messageId ? message : m)
          );
        })
      );
  }

  /**
   * Send typing indicator
   */
  async sendTypingIndicator(conversationId: string, isTyping: boolean): Promise<void> {
    if (this.messagingConnection?.state === signalR.HubConnectionState.Connected) {
      await this.messagingConnection.invoke('SendTypingIndicator', conversationId, isTyping);
    }
  }

  /**
   * Join conversation for real-time updates
   */
  async joinConversation(conversationId: string): Promise<void> {
    if (this.messagingConnection?.state === signalR.HubConnectionState.Connected) {
      await this.messagingConnection.invoke('JoinConversation', conversationId);
      this._activeConversation.set(this._conversations().find(c => c.id === conversationId) || null);
    }
  }

  /**
   * Leave conversation
   */
  async leaveConversation(conversationId: string): Promise<void> {
    if (this.messagingConnection?.state === signalR.HubConnectionState.Connected) {
      await this.messagingConnection.invoke('LeaveConversation', conversationId);
      if (this._activeConversation()?.id === conversationId) {
        this._activeConversation.set(null);
      }
    }
  }

  /**
   * Register for push notifications
   */
  registerPushNotifications(request: RegisterPushRequest): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/push/register`, request)
      .pipe(map(() => void 0));
  }

  /**
   * Update notification preferences
   */
  updateNotificationPreferences(preferences: MessagingNotificationPreferences): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/preferences/notifications`, preferences)
      .pipe(map(() => void 0));
  }

  /**
   * Get notification preferences
   */
  getNotificationPreferences(): Observable<MessagingNotificationPreferences> {
    return this.http.get<ApiResponse<MessagingNotificationPreferences>>(`${this.apiUrl}/preferences/notifications`)
      .pipe(map(response => response.data!));
  }

  // Private helper methods

  private handleMessageReceived(message: MessageDto): void {
    this._messages.update(messages => {
      const exists = messages.some(m => m.id === message.id);
      return exists ? messages : [...messages, message];
    });

    // Update conversation last message and unread count
    this._conversations.update(conversations =>
      conversations.map(c => {
        if (c.id === message.conversationId) {
          return {
            ...c,
            lastMessage: message,
            unreadCount: c.unreadCount + 1,
            updatedAt: message.createdAt
          };
        }
        return c;
      })
    );

    this.updateUnreadCount();
    this.messageReceivedSubject.next(message);

    // Show notification if not in active conversation
    if (this._activeConversation()?.id !== message.conversationId) {
      this.showMessageNotification(message);
    }
  }

  private handleMessageSent(message: MessageDto): void {
    this._messages.update(messages => [...messages, message]);
    
    // Update conversation last message
    this._conversations.update(conversations =>
      conversations.map(c => {
        if (c.id === message.conversationId) {
          return {
            ...c,
            lastMessage: message,
            updatedAt: message.createdAt
          };
        }
        return c;
      })
    );
  }

  private handleConversationCreated(conversation: ConversationDto): void {
    this._conversations.update(conversations => [conversation, ...conversations]);
    this.conversationUpdatedSubject.next(conversation);
  }

  private handleConversationUpdated(conversation: ConversationDto): void {
    this._conversations.update(conversations =>
      conversations.map(c => c.id === conversation.id ? conversation : c)
    );
    this.conversationUpdatedSubject.next(conversation);
  }

  private handleTypingEvent(event: TypingEvent): void {
    const indicator: TypingIndicator = {
      conversationId: event.conversationId,
      userId: event.userId,
      userName: event.userName,
      isTyping: event.type === 'typing_start',
      timestamp: event.timestamp
    };

    if (indicator.isTyping) {
      this._typingUsers.update(users => {
        const filtered = users.filter(u => u.userId !== indicator.userId || u.conversationId !== indicator.conversationId);
        return [...filtered, indicator];
      });
    } else {
      this._typingUsers.update(users => 
        users.filter(u => u.userId !== indicator.userId || u.conversationId !== indicator.conversationId)
      );
    }

    this.typingSubject.next(indicator);
  }

  private handleOnlineStatusChanged(event: OnlineStatusEvent): void {
    const status: OnlineStatus = {
      userId: event.userId,
      isOnline: event.isOnline,
      lastSeen: event.lastSeen
    };

    this._onlineUsers.update(users => {
      const filtered = users.filter(u => u.userId !== status.userId);
      return [...filtered, status];
    });

    this.onlineStatusSubject.next(status);
  }

  private updateMessageStatus(messageId: string, status: MessageStatus): void {
    this._messages.update(messages =>
      messages.map(m => m.id === messageId ? { ...m, status } : m)
    );
  }

  private updateUnreadCount(): void {
    const total = this._conversations().reduce((sum, c) => sum + c.unreadCount, 0);
    this._unreadCount.set(total);
  }

  private showMessageNotification(message: MessageDto): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(`New message from ${message.senderName}`, {
        body: message.type === MessageType.Text ? message.content : `Sent a ${message.type}`,
        icon: message.senderAvatar || '/assets/icons/default-avatar.png',
        tag: `message-${message.id}`,
        data: {
          conversationId: message.conversationId,
          messageId: message.id
        }
      });

      notification.onclick = () => {
        window.focus();
        this.joinConversation(message.conversationId);
        notification.close();
      };
    }
  }

  /**
   * Disconnect messaging service
   */
  async disconnect(): Promise<void> {
    if (this.messagingConnection) {
      await this.messagingConnection.stop();
      this.messagingConnection = null;
      this._isConnected.set(false);
    }
  }
}