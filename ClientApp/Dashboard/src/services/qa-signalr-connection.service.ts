import { HubConnection, HubConnectionBuilder, LogLevel, HubConnectionState } from '@microsoft/signalr';

// Connection management and reliability types
export interface ConnectionHealth {
  status: string;
  activeConnections: number;
  staleConnections: number;
  lastHealthCheck: Date;
  averageConnectionDuration: number;
  groupCounts: Record<string, number>;
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

export interface ActiveConnection {
  connectionId: string;
  userId: string;
  userName: string;
  connectedAt: Date;
  lastActivity: Date;
  userAgent: string;
  status: string;
  joinedGroups: string[];
}

export const ConnectionStatus = {
  Disconnected: 'Disconnected',
  Connecting: 'Connecting',
  Connected: 'Connected',
  Reconnecting: 'Reconnecting',
  Failed: 'Failed'
} as const;

export type ConnectionStatus = typeof ConnectionStatus[keyof typeof ConnectionStatus];

export type ConnectionEventHandler = (data: any) => void;
export type ConnectionStatusHandler = (status: ConnectionStatus) => void;
export type ConnectionErrorHandler = (error: ConnectionError) => void;

/**
 * Unified QA SignalR Connection Service for React Dashboard
 * Provides connection management, reliability features, and health monitoring
 * Designed to work alongside Angular Main App with shared backend
 */
export class QASignalRConnectionService {
  private hubConnection: HubConnection | null = null;
  private connectionStatus: ConnectionStatus = ConnectionStatus.Disconnected;
  private isReconnecting = false;

  // Connection management and reliability
  private connectionHealth: ConnectionHealth | null = null;
  private connectionReliability: ConnectionReliability | null = null;
  private lastConnectionAttempt: Date | null = null;
  private connectionAttempts = 0;
  private reconnectionAttempts = 0;
  private successfulConnections = 0;
  private failedConnections = 0;
  private reconnectionTimes: number[] = [];

  // Event handlers
  private statusHandlers: ConnectionStatusHandler[] = [];
  private errorHandlers: ConnectionErrorHandler[] = [];
  private eventHandlers: Map<string, ConnectionEventHandler[]> = new Map();

  // Health monitoring
  private healthCheckTimer: any = null;
  private pingTimer: any = null;
  private readonly HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
  private readonly PING_INTERVAL = 60000; // 1 minute
  private readonly MAX_RECONNECTION_ATTEMPTS = 10;
  private readonly RECONNECTION_DELAYS = [0, 2000, 5000, 10000, 30000]; // Progressive delays

  // Currently joined groups
  private joinedGroups = new Set<string>();

  // Auth token getter function
  private getAuthToken: () => string | null;

  constructor(getAuthToken: () => string | null) {
    this.getAuthToken = getAuthToken;
    this.startHealthMonitoring();
  }

  // Connection Management
  public async startConnection(): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      return;
    }

    this.setConnectionStatus(ConnectionStatus.Connecting);
    this.lastConnectionAttempt = new Date();
    this.connectionAttempts++;

    try {
      const token = this.getAuthToken();
      
      console.log('Starting QA SignalR connection (React Dashboard)...', {
        hasToken: !!token,
        attempt: this.connectionAttempts
      });

      this.hubConnection = new HubConnectionBuilder()
        .withUrl('/qaHub', {
          accessTokenFactory: () => token || ''
        })
        .withAutomaticReconnect(this.RECONNECTION_DELAYS)
        .configureLogging(LogLevel.Information)
        .build();

      // Set up event handlers
      this.setupConnectionEventHandlers();
      this.setupQAEventHandlers();

      await this.hubConnection.start();
      console.log('QA SignalR connection established successfully (React Dashboard)');
      
      this.setConnectionStatus(ConnectionStatus.Connected);
      this.successfulConnections++;
      this.reconnectionAttempts = 0; // Reset on successful connection

      // Join moderators group for dashboard features
      try {
        await this.hubConnection.invoke('JoinModeratorsGroup');
        this.joinedGroups.add('moderators');
        console.log('Joined QA moderators group');
      } catch (error) {
        console.error('Error joining QA moderators group:', error);
        this.handleConnectionError('JoinModeratorsGroup', error);
      }

      // Start periodic health checks
      this.startPeriodicHealthChecks();

    } catch (error) {
      console.error('Error starting QA SignalR connection (React Dashboard):', error);
      this.setConnectionStatus(ConnectionStatus.Failed);
      this.failedConnections++;
      
      this.handleConnectionError('StartConnection', error);
      
      // Retry connection with exponential backoff if we have a token
      if (this.getAuthToken() && this.connectionAttempts < this.MAX_RECONNECTION_ATTEMPTS) {
        const delay = this.getReconnectionDelay();
        console.log(`Retrying QA SignalR connection in ${delay}ms (attempt ${this.connectionAttempts})`);
        setTimeout(() => this.startConnection(), delay);
      }
    }
  }

  public async stopConnection(): Promise<void> {
    if (this.hubConnection) {
      try {
        await this.hubConnection.stop();
        console.log('QA SignalR connection stopped (React Dashboard)');
      } catch (error) {
        console.error('Error stopping QA SignalR connection:', error);
      } finally {
        this.hubConnection = null;
        this.setConnectionStatus(ConnectionStatus.Disconnected);
        this.isReconnecting = false;
        this.joinedGroups.clear();
        this.stopPeriodicHealthChecks();
      }
    }
  }

  // Event Handler Management
  public onStatusChange(handler: ConnectionStatusHandler): () => void {
    this.statusHandlers.push(handler);
    return () => {
      const index = this.statusHandlers.indexOf(handler);
      if (index > -1) {
        this.statusHandlers.splice(index, 1);
      }
    };
  }

  public onError(handler: ConnectionErrorHandler): () => void {
    this.errorHandlers.push(handler);
    return () => {
      const index = this.errorHandlers.indexOf(handler);
      if (index > -1) {
        this.errorHandlers.splice(index, 1);
      }
    };
  }

  public onEvent(eventName: string, handler: ConnectionEventHandler): () => void {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, []);
    }
    this.eventHandlers.get(eventName)!.push(handler);

    return () => {
      const handlers = this.eventHandlers.get(eventName);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  // Connection Health and Monitoring
  public async getConnectionHealth(): Promise<ConnectionHealth | null> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        const health = await this.hubConnection.invoke('GetConnectionHealth');
        this.connectionHealth = health;
        return health;
      } catch (error) {
        console.error('Failed to get connection health:', error);
        throw error;
      }
    }
    return this.connectionHealth;
  }

  public async getActiveConnections(): Promise<ActiveConnection[]> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        return await this.hubConnection.invoke('GetActiveConnections');
      } catch (error) {
        console.error('Failed to get active connections:', error);
        throw error;
      }
    }
    throw new Error('QA SignalR connection not established');
  }

  public async testConnection(message: string = 'dashboard-test'): Promise<void> {
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
    console.log('Forcing QA SignalR reconnection (React Dashboard)...');
    this.stopConnection().then(() => {
      setTimeout(() => this.startConnection(), 1000);
    });
  }

  // Group Management
  public async joinGroup(groupName: string): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        // Map group names to appropriate hub methods
        switch (groupName) {
          case 'experts':
            await this.hubConnection.invoke('JoinExpertsGroup');
            break;
          case 'moderators':
            await this.hubConnection.invoke('JoinModeratorsGroup');
            break;
          default:
            if (groupName.startsWith('category_')) {
              const category = groupName.replace('category_', '');
              await this.hubConnection.invoke('JoinCategory', category);
            } else if (groupName.startsWith('question_')) {
              const questionId = groupName.replace('question_', '');
              await this.hubConnection.invoke('JoinQuestion', questionId);
            }
            break;
        }
        
        this.joinedGroups.add(groupName);
        console.log('Joined QA group:', groupName);
      } catch (error) {
        console.error(`Error joining QA group ${groupName}:`, error);
        throw error;
      }
    } else {
      throw new Error('QA SignalR connection not established');
    }
  }

  public async leaveGroup(groupName: string): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        // Map group names to appropriate hub methods
        switch (groupName) {
          case 'experts':
            await this.hubConnection.invoke('LeaveExpertsGroup');
            break;
          case 'moderators':
            await this.hubConnection.invoke('LeaveModeratorsGroup');
            break;
          default:
            if (groupName.startsWith('category_')) {
              const category = groupName.replace('category_', '');
              await this.hubConnection.invoke('LeaveCategory', category);
            } else if (groupName.startsWith('question_')) {
              const questionId = groupName.replace('question_', '');
              await this.hubConnection.invoke('LeaveQuestion', questionId);
            }
            break;
        }
        
        this.joinedGroups.delete(groupName);
        console.log('Left QA group:', groupName);
      } catch (error) {
        console.error(`Error leaving QA group ${groupName}:`, error);
        throw error;
      }
    }
  }

  // Private Methods
  private setupConnectionEventHandlers(): void {
    if (!this.hubConnection) return;

    this.hubConnection.onreconnecting((error) => {
      console.log('QA SignalR reconnecting (React Dashboard)...', error);
      this.setConnectionStatus(ConnectionStatus.Reconnecting);
      this.isReconnecting = true;
      this.reconnectionAttempts++;
      
      this.handleConnectionError('Reconnecting', error);
    });

    this.hubConnection.onreconnected((connectionId) => {
      console.log('QA SignalR reconnected (React Dashboard) with connection ID:', connectionId);
      this.setConnectionStatus(ConnectionStatus.Connected);
      this.isReconnecting = false;
      
      // Track reconnection time
      const reconnectionTime = Date.now() - (this.lastConnectionAttempt?.getTime() || 0);
      this.reconnectionTimes.push(reconnectionTime);
      
      // Keep only last 10 reconnection times for average calculation
      if (this.reconnectionTimes.length > 10) {
        this.reconnectionTimes.shift();
      }
      
      // Rejoin groups
      this.rejoinGroups();
      
      // Update reliability metrics
      this.updateReliabilityMetrics();
    });

    this.hubConnection.onclose((error) => {
      console.log('QA SignalR connection closed (React Dashboard)', error);
      this.setConnectionStatus(ConnectionStatus.Disconnected);
      this.isReconnecting = false;
      
      if (error) {
        this.handleConnectionError('ConnectionClosed', error);
      }
      
      // Stop health checks
      this.stopPeriodicHealthChecks();
    });
  }

  private setupQAEventHandlers(): void {
    if (!this.hubConnection) return;

    // Set up handlers for QA events that the dashboard needs to monitor
    this.hubConnection.on('ReceiveConnectionStatus', (data) => {
      this.emitEvent('connectionStatus', data);
    });

    this.hubConnection.on('ReceiveNewAnswer', (data) => {
      this.emitEvent('newAnswer', data);
    });

    this.hubConnection.on('ReceiveVoteUpdate', (data) => {
      this.emitEvent('voteUpdate', data);
    });

    this.hubConnection.on('ReceiveQuestionUpdate', (data) => {
      this.emitEvent('questionUpdate', data);
    });

    this.hubConnection.on('ReceiveAnswerAccepted', (data) => {
      this.emitEvent('answerAccepted', data);
    });

    this.hubConnection.on('ReceiveReputationUpdate', (data) => {
      this.emitEvent('reputationUpdate', data);
    });

    this.hubConnection.on('ReceiveQuestionClosed', (data) => {
      this.emitEvent('questionClosed', data);
    });

    this.hubConnection.on('ReceiveExpertNotification', (data) => {
      this.emitEvent('expertNotification', data);
    });
  }

  private async rejoinGroups(): Promise<void> {
    for (const groupName of this.joinedGroups) {
      try {
        await this.joinGroup(groupName);
      } catch (error) {
        console.error(`Failed to rejoin group ${groupName}:`, error);
      }
    }
  }

  private setConnectionStatus(status: ConnectionStatus): void {
    this.connectionStatus = status;
    this.statusHandlers.forEach(handler => {
      try {
        handler(status);
      } catch (error) {
        console.error('Error in connection status handler:', error);
      }
    });
  }

  private handleConnectionError(context: string, error: any): void {
    const connectionError: ConnectionError = {
      errorType: context,
      errorMessage: error?.message || error?.toString() || 'Unknown error',
      timestamp: new Date(),
      retryAttempt: this.connectionAttempts,
      isRecoverable: this.isRecoverableError(error)
    };

    this.errorHandlers.forEach(handler => {
      try {
        handler(connectionError);
      } catch (err) {
        console.error('Error in connection error handler:', err);
      }
    });

    console.error(`QA SignalR ${context} error (React Dashboard):`, error);
  }

  private emitEvent(eventName: string, data: any): void {
    const handlers = this.eventHandlers.get(eventName);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in ${eventName} event handler:`, error);
        }
      });
    }
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
    this.getConnectionHealth().catch(error => {
      console.warn('Failed to get initial connection health:', error);
    });
  }

  private stopPeriodicHealthChecks(): void {
    // Health checks are stopped when connection is closed
  }

  private async performHealthCheck(): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        await this.getConnectionHealth();
      } catch (error) {
        console.warn('Failed to perform health check:', error);
      }
    }
  }

  private async performPing(): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        const response = await this.hubConnection.invoke('Ping');
        console.debug('QA SignalR ping response (React Dashboard):', response);
      } catch (error) {
        console.warn('QA SignalR ping failed (React Dashboard):', error);
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

    this.connectionReliability = {
      connectionSuccessRate,
      reconnectionSuccessRate,
      averageReconnectionTime,
      totalReconnectionAttempts,
      failedReconnectionAttempts: totalReconnectionAttempts - successfulReconnections
    };
  }

  // Public Getters
  public get isConnected(): boolean {
    return this.hubConnection?.state === HubConnectionState.Connected;
  }

  public get currentStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  public get isCurrentlyReconnecting(): boolean {
    return this.isReconnecting;
  }

  public get currentConnectionHealth(): ConnectionHealth | null {
    return this.connectionHealth;
  }

  public get currentReliabilityMetrics(): ConnectionReliability | null {
    return this.connectionReliability;
  }

  public getConnectionStats(): any {
    return {
      connectionAttempts: this.connectionAttempts,
      successfulConnections: this.successfulConnections,
      failedConnections: this.failedConnections,
      reconnectionAttempts: this.reconnectionAttempts,
      averageReconnectionTime: this.reconnectionTimes.length > 0 ?
        this.reconnectionTimes.reduce((a, b) => a + b, 0) / this.reconnectionTimes.length : 0,
      currentStatus: this.connectionStatus,
      isConnected: this.isConnected,
      isReconnecting: this.isCurrentlyReconnecting,
      joinedGroups: Array.from(this.joinedGroups)
    };
  }

  // Cleanup
  public dispose(): void {
    this.stopHealthMonitoring();
    this.stopConnection();
    this.statusHandlers.length = 0;
    this.errorHandlers.length = 0;
    this.eventHandlers.clear();
  }
}