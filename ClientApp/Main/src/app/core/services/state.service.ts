import { Injectable, signal, computed, effect } from '@angular/core';

/**
 * Application State Interface
 */
export interface AppState {
  isLoading: boolean;
  user: User | null;
  notifications: Notification[];
  theme: 'light' | 'dark';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

/**
 * State Service using Angular Signals
 * 
 * Modern Angular 19 service demonstrating:
 * - Signal-based state management
 * - Computed signals for derived state
 * - Effects for side effects
 * - Immutable state updates
 */
@Injectable({
  providedIn: 'root'
})
export class StateService {
  // Private signals for internal state
  private _isLoading = signal(false);
  private _user = signal<User | null>(null);
  private _notifications = signal<Notification[]>([]);
  private _theme = signal<'light' | 'dark'>('light');

  // Public readonly signals
  readonly isLoading = this._isLoading.asReadonly();
  readonly user = this._user.asReadonly();
  readonly notifications = this._notifications.asReadonly();
  readonly theme = this._theme.asReadonly();

  // Computed signals
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly unreadNotificationCount = computed(() => 
    this._notifications().filter(n => !n.read).length
  );
  readonly hasNotifications = computed(() => 
    this._notifications().length > 0
  );

  constructor() {
    // Effect to persist theme to localStorage
    effect(() => {
      const currentTheme = this._theme();
      localStorage.setItem('theme', currentTheme);
      document.documentElement.classList.toggle('dark', currentTheme === 'dark');
      console.log(`Theme changed to: ${currentTheme}`);
    });

    // Effect to log authentication state changes
    effect(() => {
      const authenticated = this.isAuthenticated();
      console.log(`Authentication state: ${authenticated ? 'logged in' : 'logged out'}`);
    });

    // Initialize theme from localStorage
    this.initializeTheme();
  }

  /**
   * Initialize theme from localStorage
   */
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      this._theme.set(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this._theme.set(prefersDark ? 'dark' : 'light');
    }
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  /**
   * Set user
   */
  setUser(user: User | null): void {
    this._user.set(user);
  }

  /**
   * Update user
   */
  updateUser(updates: Partial<User>): void {
    this._user.update(currentUser => {
      if (!currentUser) return null;
      return { ...currentUser, ...updates };
    });
  }

  /**
   * Add notification
   */
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false
    };

    this._notifications.update(notifications => [newNotification, ...notifications]);
  }

  /**
   * Mark notification as read
   */
  markNotificationAsRead(notificationId: string): void {
    this._notifications.update(notifications =>
      notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  }

  /**
   * Mark all notifications as read
   */
  markAllNotificationsAsRead(): void {
    this._notifications.update(notifications =>
      notifications.map(n => ({ ...n, read: true }))
    );
  }

  /**
   * Remove notification
   */
  removeNotification(notificationId: string): void {
    this._notifications.update(notifications =>
      notifications.filter(n => n.id !== notificationId)
    );
  }

  /**
   * Clear all notifications
   */
  clearNotifications(): void {
    this._notifications.set([]);
  }

  /**
   * Toggle theme
   */
  toggleTheme(): void {
    this._theme.update(current => current === 'light' ? 'dark' : 'light');
  }

  /**
   * Set theme
   */
  setTheme(theme: 'light' | 'dark'): void {
    this._theme.set(theme);
  }

  /**
   * Reset state
   */
  reset(): void {
    this._isLoading.set(false);
    this._user.set(null);
    this._notifications.set([]);
    // Don't reset theme as it's a user preference
  }
}
