import * as signalR from '@microsoft/signalr';
import type { NotificationDto } from '../../types/notification';

/**
 * SignalR Manager for Real-Time Notifications
 */
export class SignalRManager {
  private connection: signalR.HubConnection | null = null;
  private listeners: ((notification: NotificationDto) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;

  /**
   * Initialize and connect to SignalR hub
   */
  async connect(): Promise<void> {
    if (this.isConnecting) {
      return;
    }

    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    this.isConnecting = true;

    try {
      const hubUrl = `${import.meta.env.VITE_API_BASE_URL}/hubs/notifications`;
      
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => localStorage.getItem('auth_token') || ''
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount < this.maxReconnectAttempts) {
              return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
            }
            return null;
          }
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Set up event handlers
      this.connection.on('ReceiveNotification', (notification: NotificationDto) => {
        this.listeners.forEach(listener => listener(notification));
      });

      this.connection.on('Connected', (data: { userId: string; connectionId: string }) => {
        console.log('SignalR connected:', data);
      });

      this.connection.on('NotificationAcknowledged', (notificationId: string) => {
        console.log('Notification acknowledged:', notificationId);
      });

      this.connection.onreconnecting(() => {
        console.log('SignalR reconnecting...');
      });

      this.connection.onreconnected(() => {
        console.log('SignalR reconnected');
        this.reconnectAttempts = 0;
      });

      this.connection.onclose((error) => {
        console.log('SignalR connection closed', error);
        this.isConnecting = false;
      });

      await this.connection.start();
      console.log('SignalR connected successfully');
      this.reconnectAttempts = 0;
    } catch (error) {
      console.error('SignalR connection error:', error);
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Disconnect from SignalR hub
   */
  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.isConnecting = false;
    }
  }

  /**
   * Subscribe to notification events
   */
  subscribe(callback: (notification: NotificationDto) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Acknowledge a notification
   */
  async acknowledgeNotification(notificationId: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke('AcknowledgeNotification', notificationId);
    }
  }

  /**
   * Join a priority group
   */
  async joinPriorityGroup(priority: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke('JoinPriorityGroup', priority);
    }
  }

  /**
   * Leave a priority group
   */
  async leavePriorityGroup(priority: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke('LeavePriorityGroup', priority);
    }
  }

  /**
   * Ping the server for health check
   */
  async ping(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke('Ping');
    }
  }

  /**
   * Get connection state
   */
  getState(): signalR.HubConnectionState | null {
    return this.connection?.state || null;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

// Export singleton instance
export const signalRManager = new SignalRManager();

// Default export
export default signalRManager;
