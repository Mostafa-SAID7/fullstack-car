import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection | null = null;
  private connectionStateSubject = new BehaviorSubject<boolean>(false);
  public connectionState$ = this.connectionStateSubject.asObservable();

  // Notification events
  private notificationReceivedSubject = new BehaviorSubject<any>(null);
  public notificationReceived$ = this.notificationReceivedSubject.asObservable();

  constructor(private authService: AuthService) {
    // Auto-connect when user is authenticated
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
      
      console.log('Starting SignalR connection...', {
        hasToken: !!token,
        tokenPreview: token?.substring(0, 20) + '...',
        hubUrl: `${environment.hubUrl}/notificationHub`
      });

      this.hubConnection = new HubConnectionBuilder()
        .withUrl(`${environment.hubUrl}/notificationHub`, {
          accessTokenFactory: () => token || ''
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      // Set up event handlers
      this.setupEventHandlers();

      await this.hubConnection.start();
      console.log('SignalR connection established successfully');
      this.connectionStateSubject.next(true);

      // Join user group for notifications if authenticated
      const userId = this.authService.currentUser?.id;
      if (userId && token) {
        try {
          await this.hubConnection.invoke('JoinUserGroup', userId);
          console.log('Joined user group:', userId);
        } catch (error) {
          console.error('Error joining user group:', error);
        }
      }

    } catch (error) {
      console.error('Error starting SignalR connection:', error);
      this.connectionStateSubject.next(false);
      
      // Retry connection after delay only if we have a token
      if (this.authService.token) {
        setTimeout(() => this.startConnection(), 5000);
      }
    }
  }

  private setupEventHandlers(): void {
    if (!this.hubConnection) return;

    // Handle notification received
    this.hubConnection.on('NotificationReceived', (notification: any) => {
      console.log('Notification received via SignalR:', notification);
      this.notificationReceivedSubject.next(notification);
    });

    // Handle connection events
    this.hubConnection.onreconnecting(() => {
      console.log('SignalR reconnecting...');
      this.connectionStateSubject.next(false);
    });

    this.hubConnection.onreconnected(() => {
      console.log('SignalR reconnected');
      this.connectionStateSubject.next(true);
      
      // Rejoin user group after reconnection
      const userId = this.authService.currentUser?.id;
      if (userId) {
        this.hubConnection?.invoke('JoinUserGroup', userId);
      }
    });

    this.hubConnection.onclose(() => {
      console.log('SignalR connection closed');
      this.connectionStateSubject.next(false);
    });
  }

  public async stopConnection(): Promise<void> {
    if (this.hubConnection) {
      try {
        await this.hubConnection.stop();
        console.log('SignalR connection stopped');
      } catch (error) {
        console.error('Error stopping SignalR connection:', error);
      } finally {
        this.hubConnection = null;
        this.connectionStateSubject.next(false);
      }
    }
  }

  public async sendMessage(method: string, ...args: any[]): Promise<any> {
    if (this.hubConnection?.state === 'Connected') {
      try {
        return await this.hubConnection.invoke(method, ...args);
      } catch (error) {
        console.error(`Error invoking ${method}:`, error);
        throw error;
      }
    } else {
      throw new Error('SignalR connection not established');
    }
  }

  public get isConnected(): boolean {
    return this.hubConnection?.state === 'Connected';
  }

  /**
   * Register a handler for a specific SignalR event
   * @param eventName The name of the event to listen for
   * @param handler The callback function to execute when the event is received
   */
  public on<T>(eventName: string, handler: (data: T) => void): void {
    if (this.hubConnection) {
      this.hubConnection.on(eventName, handler);
      console.log(`Registered handler for event: ${eventName}`);
    } else {
      console.warn(`Cannot register handler for ${eventName}: No active connection`);
    }
  }

  /**
   * Unregister a handler for a specific SignalR event
   * @param eventName The name of the event to stop listening for
   */
  public off(eventName: string): void {
    if (this.hubConnection) {
      this.hubConnection.off(eventName);
      console.log(`Unregistered handler for event: ${eventName}`);
    }
  }

  /**
   * Get the underlying HubConnection for advanced scenarios
   */
  public getConnection(): HubConnection | null {
    return this.hubConnection;
  }
}