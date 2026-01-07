import * as signalR from '@microsoft/signalr';
import type { Notification } from '../../types/notification';

export class SignalRManager {
  private connection: signalR.HubConnection | null = null;
  private connectionPromise: Promise<void> | null = null;
  private listeners: Set<(notification: Notification) => void> = new Set();

  constructor() {
    this.initializeSignalR();
  }

  private async initializeSignalR() {
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        console.warn('No auth token found, SignalR connection will not be established');
        return;
      }

      // Use the API base URL for SignalR connection
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5101/api';
      const baseUrl = apiBaseUrl.replace('/api', ''); // Remove /api suffix for hub connection
      
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/hubs/notifications`, {
          accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .build();

      // Set up event handlers
      this.connection.on('ReceiveNotification', (notification: Notification) => {
        console.log('Received real-time notification:', notification);
        this.listeners.forEach(listener => listener(notification));
      });

      this.connection.on('ReceiveSystemNotification', (message: string) => {
        console.log('Received system notification:', message);
        const systemNotification: Notification = {
          id: `system-${Date.now()}`,
          userId: 'system',
          title: 'System Notification',
          message: message,
          type: 'info',
          category: 'system',
          priority: 'medium',
          read: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.listeners.forEach(listener => listener(systemNotification));
      });

      this.connection.onreconnecting(() => {
        console.log('SignalR connection lost, attempting to reconnect...');
      });

      this.connection.onreconnected(() => {
        console.log('SignalR connection restored');
      });

      this.connection.onclose(() => {
        console.log('SignalR connection closed');
      });

      // Start the connection
      this.connectionPromise = this.connection.start();
      await this.connectionPromise;
      console.log('SignalR connection established');
    } catch (error) {
      console.error('Failed to initialize SignalR connection:', error);
    }
  }

  async ensureConnection(): Promise<void> {
    if (this.connectionPromise) {
      await this.connectionPromise;
    }
  }

  // Real-time subscription
  subscribeToNotifications(callback: (notification: Notification) => void): () => void {
    this.listeners.add(callback);
    
    return () => {
      this.listeners.delete(callback);
    };
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.connectionPromise = null;
    }
  }
}