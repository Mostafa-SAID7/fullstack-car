import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@angular/cdk/platform';
import { PWAService } from './pwa.service';
import { Observable, BehaviorSubject, fromEvent } from 'rxjs';
import { map, filter } from 'rxjs/operators';

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface PushNotificationPreferences {
  enabled: boolean;
  messages: boolean;
  groupUpdates: boolean;
  mentions: boolean;
  likes: boolean;
  comments: boolean;
  systemUpdates: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
  };
  sound: boolean;
  vibration: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private http = inject(HttpClient);
  private platform = inject(Platform);
  private pwaService = inject(PWAService);

  private readonly apiUrl = '/api/push-notifications';
  private readonly vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY'; // Replace with actual key

  // Reactive state
  private _isSupported = signal(false);
  private _permission = signal<NotificationPermission>('default');
  private _isSubscribed = signal(false);
  private _subscription = signal<PushSubscription | null>(null);
  private _preferences = signal<PushNotificationPreferences>({
    enabled: true,
    messages: true,
    groupUpdates: true,
    mentions: true,
    likes: false,
    comments: true,
    systemUpdates: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    sound: true,
    vibration: true
  });

  // Public readonly signals
  readonly isSupported = this._isSupported.asReadonly();
  readonly permission = this._permission.asReadonly();
  readonly isSubscribed = this._isSubscribed.asReadonly();
  readonly subscription = this._subscription.asReadonly();
  readonly preferences = this._preferences.asReadonly();

  // Computed properties
  readonly canSubscribe = computed(() => 
    this._isSupported() && this._permission() === 'granted' && !this._isSubscribed()
  );

  readonly needsPermission = computed(() => 
    this._isSupported() && this._permission() === 'default'
  );

  readonly isBlocked = computed(() => 
    this._permission() === 'denied'
  );

  // Observables
  private notificationClickSubject = new BehaviorSubject<any>(null);
  readonly notificationClick$ = this.notificationClickSubject.asObservable()
    .pipe(filter(data => data !== null));

  constructor() {
    this.initializePushNotifications();
    this.setupNotificationListeners();
  }

  /**
   * Initialize push notification functionality
   */
  private initializePushNotifications(): void {
    if (!this.platform.isBrowser) return;

    // Check if push notifications are supported
    const isSupported = 'Notification' in window && 
                       'serviceWorker' in navigator && 
                       'PushManager' in window;
    
    this._isSupported.set(isSupported);

    if (!isSupported) {
      console.warn('Push notifications not supported');
      return;
    }

    // Get current permission status
    this._permission.set(Notification.permission);

    // Check if already subscribed
    this.checkExistingSubscription();

    // Load preferences from storage
    this.loadPreferences();
  }

  /**
   * Set up notification event listeners
   */
  private setupNotificationListeners(): void {
    if (!this.platform.isBrowser || !('serviceWorker' in navigator)) return;

    // Listen for notification clicks
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
        this.notificationClickSubject.next(event.data.payload);
      }
    });

    // Listen for permission changes
    if ('permissions' in navigator) {
      (navigator as any).permissions.query({ name: 'notifications' })
        .then((permissionStatus: any) => {
          permissionStatus.addEventListener('change', () => {
            this._permission.set(permissionStatus.state);
          });
        });
    }
  }

  /**
   * Check for existing push subscription
   */
  private async checkExistingSubscription(): Promise<void> {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        this._subscription.set(subscription);
        this._isSubscribed.set(true);
      }
    } catch (error) {
      console.error('Failed to check existing subscription:', error);
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this._isSupported()) {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      this._permission.set(permission);
      return permission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(): Promise<boolean> {
    if (!this.canSubscribe()) {
      console.warn('Cannot subscribe to push notifications');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey) as BufferSource
      });

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);

      this._subscription.set(subscription);
      this._isSubscribed.set(true);

      return true;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    const subscription = this._subscription();
    if (!subscription) {
      return true;
    }

    try {
      // Unsubscribe from browser
      await subscription.unsubscribe();

      // Remove subscription from server
      await this.removeSubscriptionFromServer(subscription);

      this._subscription.set(null);
      this._isSubscribed.set(false);

      return true;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  /**
   * Send subscription to server
   */
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    const subscriptionData: PushSubscriptionData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
        auth: this.arrayBufferToBase64(subscription.getKey('auth')!)
      }
    };

    await this.http.post(`${this.apiUrl}/subscribe`, {
      subscription: subscriptionData,
      preferences: this._preferences()
    }).toPromise();
  }

  /**
   * Remove subscription from server
   */
  private async removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
    await this.http.post(`${this.apiUrl}/unsubscribe`, {
      endpoint: subscription.endpoint
    }).toPromise();
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: Partial<PushNotificationPreferences>): Promise<void> {
    const updatedPreferences = { ...this._preferences(), ...preferences };
    this._preferences.set(updatedPreferences);

    // Save to local storage
    localStorage.setItem('push_notification_preferences', JSON.stringify(updatedPreferences));

    // Send to server if subscribed
    if (this._isSubscribed()) {
      try {
        await this.http.put(`${this.apiUrl}/preferences`, updatedPreferences).toPromise();
      } catch (error) {
        console.error('Failed to update preferences on server:', error);
      }
    }
  }

  /**
   * Load preferences from storage
   */
  private loadPreferences(): void {
    try {
      const stored = localStorage.getItem('push_notification_preferences');
      if (stored) {
        const preferences = JSON.parse(stored);
        this._preferences.set({ ...this._preferences(), ...preferences });
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
    }
  }

  /**
   * Show local notification
   */
  showNotification(payload: NotificationPayload): Notification | null {
    if (!this._isSupported() || this._permission() !== 'granted') {
      return null;
    }

    // Check quiet hours
    if (this.isInQuietHours()) {
      return null;
    }

    const options: NotificationOptions = {
      body: payload.body,
      icon: payload.icon || '/assets/icons/icon-192x192.png',
      badge: payload.badge || '/assets/icons/icon-72x72.png',
      tag: payload.tag,
      data: payload.data,
      requireInteraction: payload.requireInteraction,
      silent: payload.silent
    };

    // Add vibrate if supported and enabled
    if (this._preferences().vibration && payload.vibrate) {
      (options as any).vibrate = payload.vibrate;
    }

    return new Notification(payload.title, options);
  }

  /**
   * Check if current time is in quiet hours
   */
  private isInQuietHours(): boolean {
    const preferences = this._preferences();
    if (!preferences.quietHours.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = preferences.quietHours.start.split(':').map(Number);
    const [endHour, endMin] = preferences.quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime <= endTime) {
      // Same day range
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Overnight range
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  /**
   * Test notification
   */
  async testNotification(): Promise<void> {
    if (!this._isSupported() || this._permission() !== 'granted') {
      throw new Error('Notifications not available');
    }

    this.showNotification({
      title: 'Test Notification',
      body: 'This is a test notification to verify everything is working correctly.',
      icon: '/assets/icons/icon-192x192.png',
      tag: 'test-notification',
      requireInteraction: false
    });
  }

  /**
   * Get notification statistics
   */
  getNotificationStats(): {
    isSupported: boolean;
    permission: NotificationPermission;
    isSubscribed: boolean;
    preferences: PushNotificationPreferences;
  } {
    return {
      isSupported: this._isSupported(),
      permission: this._permission(),
      isSubscribed: this._isSubscribed(),
      preferences: this._preferences()
    };
  }

  // Utility methods

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}