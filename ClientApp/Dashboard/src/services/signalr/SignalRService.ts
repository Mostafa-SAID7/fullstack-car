import * as signalR from '@microsoft/signalr';

// Connection status type
export const ConnectionStatus = {
  Disconnected: 'Disconnected',
  Connecting: 'Connecting',
  Connected: 'Connected',
  Reconnecting: 'Reconnecting',
  Failed: 'Failed'
} as const;

export type ConnectionStatus = typeof ConnectionStatus[keyof typeof ConnectionStatus];

// Event types for different community features
export interface CommunityEvents {
  // Post events
  PostCreated: any;
  PostUpdated: any;
  PostDeleted: { postId: string };
  PostLiked: { postId: string; likesCount: number };
  PostCommented: { postId: string; commentsCount: number };

  // Group events
  GroupCreated: any;
  GroupUpdated: any;
  GroupMemberJoined: { groupId: string; membersCount: number };
  GroupMemberLeft: { groupId: string; membersCount: number };

  // Friend events
  FriendRequestReceived: any;
  FriendRequestAccepted: { friendId: string };
  FriendRequestRejected: { friendId: string };

  // Review events
  ReviewCreated: any;
  ReviewUpdated: any;
  ReviewMarkedHelpful: { reviewId: string; helpfulCount: number };

  // Guide events
  GuideCreated: any;
  GuideUpdated: any;
  GuideBookmarked: { guideId: string; bookmarksCount: number };

  // Article events
  ArticlePublished: any;
  ArticleUpdated: any;
  ArticleLiked: { articleId: string; likesCount: number };

  // Location events
  LocationCheckIn: { locationId: string; checkInsCount: number };
  LocationReviewed: { locationId: string; reviewsCount: number };

  // Page events
  PagePublished: any;
  PageUpdated: any;

  // QA events
  QuestionCreated: any;
  AnswerCreated: any;
  AnswerAccepted: { answerId: string; questionId: string };
  VoteCreated: { contentId: string; contentType: string; voteScore: number };

  // General notification
  NotificationReceived: any;
}

// Event callback type
type EventCallback<T = any> = (data: T) => void;

/**
 * Unified SignalR Service for Dashboard
 * Handles real-time updates for all community features
 */
export class SignalRService {
  private hubConnection: signalR.HubConnection | null = null;
  private connectionStatus: ConnectionStatus = ConnectionStatus.Disconnected;
  private eventHandlers: Map<string, Set<EventCallback>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelays = [0, 2000, 5000, 10000, 30000];
  private hubUrl: string;
  private getAccessToken: () => string | null;

  // Connection state callbacks
  private onConnectionStateChange?: (status: ConnectionStatus) => void;
  private onError?: (error: Error) => void;

  constructor(hubUrl: string, getAccessToken: () => string | null) {
    this.hubUrl = hubUrl;
    this.getAccessToken = getAccessToken;
  }

  /**
   * Start the SignalR connection
   */
  public async start(): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    this.updateConnectionStatus(ConnectionStatus.Connecting);

    try {
      const token = this.getAccessToken();

      console.log('Starting SignalR connection...', {
        hasToken: !!token,
        hubUrl: this.hubUrl
      });

      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(this.hubUrl, {
          accessTokenFactory: () => token || '',
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents
        })
        .withAutomaticReconnect(this.reconnectDelays)
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Set up connection event handlers
      this.setupConnectionHandlers();

      // Set up all event handlers
      this.setupEventHandlers();

      await this.hubConnection.start();
      console.log('SignalR connection established successfully');

      this.updateConnectionStatus(ConnectionStatus.Connected);
      this.reconnectAttempts = 0;

    } catch (error) {
      console.error('Error starting SignalR connection:', error);
      this.updateConnectionStatus(ConnectionStatus.Failed);
      this.handleError(error as Error);

      // Retry connection with exponential backoff
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        const delay = this.getReconnectDelay();
        console.log(`Retrying SignalR connection in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);
        setTimeout(() => {
          this.reconnectAttempts++;
          this.start();
        }, delay);
      }
    }
  }

  /**
   * Stop the SignalR connection
   */
  public async stop(): Promise<void> {
    if (this.hubConnection) {
      try {
        await this.hubConnection.stop();
        console.log('SignalR connection stopped');
      } catch (error) {
        console.error('Error stopping SignalR connection:', error);
      } finally {
        this.hubConnection = null;
        this.updateConnectionStatus(ConnectionStatus.Disconnected);
      }
    }
  }

  /**
   * Subscribe to an event
   */
  public on<K extends keyof CommunityEvents>(
    eventName: K,
    callback: EventCallback<CommunityEvents[K]>
  ): () => void {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, new Set());
    }

    this.eventHandlers.get(eventName)!.add(callback);

    // Return unsubscribe function
    return () => {
      const handlers = this.eventHandlers.get(eventName);
      if (handlers) {
        handlers.delete(callback);
      }
    };
  }

  /**
   * Invoke a hub method
   */
  public async invoke(methodName: string, ...args: any[]): Promise<any> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      try {
        return await this.hubConnection.invoke(methodName, ...args);
      } catch (error) {
        console.error(`Error invoking ${methodName}:`, error);
        throw error;
      }
    } else {
      throw new Error('SignalR connection not established');
    }
  }

  /**
   * Set connection state change callback
   */
  public setOnConnectionStateChange(callback: (status: ConnectionStatus) => void): void {
    this.onConnectionStateChange = callback;
  }

  /**
   * Set error callback
   */
  public setOnError(callback: (error: Error) => void): void {
    this.onError = callback;
  }

  /**
   * Get current connection status
   */
  public getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.hubConnection?.state === signalR.HubConnectionState.Connected;
  }

  // Private methods

  private setupConnectionHandlers(): void {
    if (!this.hubConnection) return;

    this.hubConnection.onreconnecting((error) => {
      console.log('SignalR reconnecting...', error);
      this.updateConnectionStatus(ConnectionStatus.Reconnecting);
    });

    this.hubConnection.onreconnected((connectionId) => {
      console.log('SignalR reconnected with connection ID:', connectionId);
      this.updateConnectionStatus(ConnectionStatus.Connected);
      this.reconnectAttempts = 0;
    });

    this.hubConnection.onclose((error) => {
      console.log('SignalR connection closed', error);
      this.updateConnectionStatus(ConnectionStatus.Disconnected);
      if (error) {
        this.handleError(error);
      }
    });
  }

  private setupEventHandlers(): void {
    if (!this.hubConnection) return;

    // Set up handlers for all event types
    const eventNames: (keyof CommunityEvents)[] = [
      'PostCreated', 'PostUpdated', 'PostDeleted', 'PostLiked', 'PostCommented',
      'GroupCreated', 'GroupUpdated', 'GroupMemberJoined', 'GroupMemberLeft',
      'FriendRequestReceived', 'FriendRequestAccepted', 'FriendRequestRejected',
      'ReviewCreated', 'ReviewUpdated', 'ReviewMarkedHelpful',
      'GuideCreated', 'GuideUpdated', 'GuideBookmarked',
      'ArticlePublished', 'ArticleUpdated', 'ArticleLiked',
      'LocationCheckIn', 'LocationReviewed',
      'PagePublished', 'PageUpdated',
      'QuestionCreated', 'AnswerCreated', 'AnswerAccepted', 'VoteCreated',
      'NotificationReceived'
    ];

    eventNames.forEach(eventName => {
      this.hubConnection!.on(eventName, (data: any) => {
        console.log(`SignalR event received: ${eventName}`, data);
        this.notifyHandlers(eventName, data);
      });
    });
  }

  private notifyHandlers(eventName: string, data: any): void {
    const handlers = this.eventHandlers.get(eventName);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${eventName}:`, error);
        }
      });
    }
  }

  private updateConnectionStatus(status: ConnectionStatus): void {
    this.connectionStatus = status;
    if (this.onConnectionStateChange) {
      this.onConnectionStateChange(status);
    }
  }

  private handleError(error: Error): void {
    if (this.onError) {
      this.onError(error);
    }
  }

  private getReconnectDelay(): number {
    const baseDelay = 1000;
    const maxDelay = 30000;
    const exponentialDelay = Math.min(baseDelay * Math.pow(2, this.reconnectAttempts), maxDelay);
    const jitter = Math.random() * 1000;
    return exponentialDelay + jitter;
  }
}

// Singleton instance
let signalRServiceInstance: SignalRService | null = null;

/**
 * Initialize the SignalR service
 */
export function initializeSignalR(
  hubUrl: string,
  getAccessToken: () => string | null
): SignalRService {
  if (!signalRServiceInstance) {
    signalRServiceInstance = new SignalRService(hubUrl, getAccessToken);
  }
  return signalRServiceInstance;
}

/**
 * Get the SignalR service instance
 */
export function getSignalRService(): SignalRService {
  if (!signalRServiceInstance) {
    throw new Error('SignalR service not initialized. Call initializeSignalR first.');
  }
  return signalRServiceInstance;
}
