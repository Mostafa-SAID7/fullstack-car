import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { NotificationDto } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  private notificationReceivedSubject = new BehaviorSubject<NotificationDto | null>(null);
  public notificationReceived$ = this.notificationReceivedSubject.asObservable();

  private connectionStateSubject = new BehaviorSubject<signalR.HubConnectionState | null>(null);
  public connectionState$ = this.connectionStateSubject.asObservable();

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
      const hubUrl = `${environment.apiUrl}/hubs/notifications`;
      const token = localStorage.getItem('auth_token') || '';

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => token
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
        console.log('SignalR: Notification received', notification);
        this.notificationReceivedSubject.next(notification);
      });

      this.connection.on('Connected', (data: { userId: string; connectionId: string }) => {
        console.log('SignalR: Connected', data);
      });

      this.connection.on('NotificationAcknowledged', (notificationId: string) => {
        console.log('SignalR: Notification acknowledged', notificationId);
      });

      this.connection.on('Pong', (timestamp: string) => {
        console.log('SignalR: Pong received', timestamp);
      });

      this.connection.onreconnecting(() => {
        console.log('SignalR: Reconnecting...');
        this.connectionStateSubject.next(signalR.HubConnectionState.Reconnecting);
      });

      this.connection.onreconnected(() => {
        console.log('SignalR: Reconnected');
        this.reconnectAttempts = 0;
        this.connectionStateSubject.next(signalR.HubConnectionState.Connected);
      });

      this.connection.onclose((error) => {
        console.log('SignalR: Connection closed', error);
        this.connectionStateSubject.next(signalR.HubConnectionState.Disconnected);
        this.isConnecting = false;
      });

      await this.connection.start();
      console.log('SignalR: Connected successfully');
      this.reconnectAttempts = 0;
      this.connectionStateSubject.next(signalR.HubConnectionState.Connected);
    } catch (error) {
      console.error('SignalR: Connection error', error);
      this.connectionStateSubject.next(signalR.HubConnectionState.Disconnected);
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
      this.connectionStateSubject.next(signalR.HubConnectionState.Disconnected);
    }
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
