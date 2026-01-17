import { Injectable, inject, signal, computed } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { Platform } from '@angular/cdk/platform';
import { filter, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';

export interface InstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

@Injectable({
  providedIn: 'root'
})
export class PWAService {
  private swUpdate = inject(SwUpdate);
  private platform = inject(Platform);

  // Reactive state
  private _isOnline = signal(navigator.onLine);
  private _updateAvailable = signal(false);
  private _isInstallable = signal(false);
  private _isInstalled = signal(false);
  private _installPromptEvent = signal<InstallPromptEvent | null>(null);

  // Public readonly signals
  readonly isOnline = this._isOnline.asReadonly();
  readonly updateAvailable = this._updateAvailable.asReadonly();
  readonly isInstallable = this._isInstallable.asReadonly();
  readonly isInstalled = this._isInstalled.asReadonly();

  // Computed properties
  readonly canInstall = computed(() => 
    this._isInstallable() && !this._isInstalled() && this._installPromptEvent() !== null
  );

  readonly isPWASupported = computed(() => 
    this.platform.isBrowser && 'serviceWorker' in navigator
  );

  readonly isStandalone = computed(() => 
    this.platform.isBrowser && 
    (window.matchMedia('(display-mode: standalone)').matches || 
     (window.navigator as any).standalone === true)
  );

  // Observables for events
  private connectionStatusSubject = new BehaviorSubject<boolean>(navigator.onLine);
  readonly connectionStatus$ = this.connectionStatusSubject.asObservable();

  constructor() {
    this.initializePWA();
    this.setupNetworkListeners();
    this.setupInstallListeners();
    this.checkIfInstalled();
  }

  /**
   * Initialize PWA functionality
   */
  private initializePWA(): void {
    if (!this.isPWASupported()) {
      console.warn('PWA features not supported in this browser');
      return;
    }

    // Check for service worker updates
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(
          filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
        )
        .subscribe(() => {
          this._updateAvailable.set(true);
          this.showUpdateNotification();
        });

      // Check for updates every 30 seconds
      setInterval(() => {
        this.swUpdate.checkForUpdate();
      }, 30000);
    }
  }

  /**
   * Set up network status listeners
   */
  private setupNetworkListeners(): void {
    if (!this.platform.isBrowser) return;

    fromEvent(window, 'online').subscribe(() => {
      this._isOnline.set(true);
      this.connectionStatusSubject.next(true);
    });

    fromEvent(window, 'offline').subscribe(() => {
      this._isOnline.set(false);
      this.connectionStatusSubject.next(false);
    });
  }

  /**
   * Set up install prompt listeners
   */
  private setupInstallListeners(): void {
    if (!this.platform.isBrowser) return;

    // Listen for beforeinstallprompt event
    fromEvent<InstallPromptEvent>(window, 'beforeinstallprompt').subscribe((event) => {
      event.preventDefault();
      this._installPromptEvent.set(event);
      this._isInstallable.set(true);
    });

    // Listen for app installed event
    fromEvent(window, 'appinstalled').subscribe(() => {
      this._isInstalled.set(true);
      this._isInstallable.set(false);
      this._installPromptEvent.set(null);
    });
  }

  /**
   * Check if app is already installed
   */
  private checkIfInstalled(): void {
    if (!this.platform.isBrowser) return;

    // Check if running in standalone mode
    this._isInstalled.set(this.isStandalone());

    // Additional check for iOS Safari
    if ((navigator as any).standalone) {
      this._isInstalled.set(true);
    }
  }

  /**
   * Show update notification to user
   */
  private showUpdateNotification(): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('App Update Available', {
        body: 'A new version of the app is available. Click to update.',
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/icon-72x72.png',
        tag: 'app-update',
        requireInteraction: true,
        // Note: actions are not supported in all browsers
        ...(('actions' in Notification.prototype) && {
          actions: [
            {
              action: 'update',
              title: 'Update Now'
            },
            {
              action: 'dismiss',
              title: 'Later'
            }
          ]
        })
      } as any);

      notification.onclick = () => {
        this.applyUpdate();
        notification.close();
      };
    }
  }

  /**
   * Apply available update
   */
  async applyUpdate(): Promise<void> {
    if (!this.swUpdate.isEnabled || !this._updateAvailable()) {
      return;
    }

    try {
      await this.swUpdate.activateUpdate();
      this._updateAvailable.set(false);
      
      // Reload the page to apply the update
      if (confirm('Update installed successfully. Reload the page to apply changes?')) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to apply update:', error);
    }
  }

  /**
   * Prompt user to install the app
   */
  async promptInstall(): Promise<boolean> {
    const promptEvent = this._installPromptEvent();
    if (!promptEvent) {
      return false;
    }

    try {
      await promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        this._isInstalled.set(true);
        this._isInstallable.set(false);
        this._installPromptEvent.set(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to prompt install:', error);
      return false;
    }
  }

  /**
   * Check for app updates manually
   */
  async checkForUpdate(): Promise<boolean> {
    if (!this.swUpdate.isEnabled) {
      return false;
    }

    try {
      const updateFound = await this.swUpdate.checkForUpdate();
      return updateFound;
    } catch (error) {
      console.error('Failed to check for updates:', error);
      return false;
    }
  }

  /**
   * Get network information
   */
  getNetworkInfo(): any {
    if (!this.platform.isBrowser || !('connection' in navigator)) {
      return null;
    }

    const connection = (navigator as any).connection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'default') {
      return await Notification.requestPermission();
    }

    return Notification.permission;
  }

  /**
   * Show a local notification
   */
  showNotification(title: string, options?: NotificationOptions): Notification | null {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return null;
    }

    const defaultOptions: NotificationOptions & { vibrate?: number[] } = {
      icon: '/assets/icons/icon-192x192.png',
      badge: '/assets/icons/icon-72x72.png',
      // Note: vibrate is not part of standard NotificationOptions
      ...('vibrate' in navigator && { vibrate: [200, 100, 200] }),
      ...options
    };

    return new Notification(title, defaultOptions as NotificationOptions);
  }

  /**
   * Clear all caches (for debugging)
   */
  async clearCaches(): Promise<void> {
    if (!this.platform.isBrowser || !('caches' in window)) {
      return;
    }

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared');
    } catch (error) {
      console.error('Failed to clear caches:', error);
    }
  }

  /**
   * Get cache storage usage
   */
  async getCacheUsage(): Promise<{ used: number; quota: number } | null> {
    if (!this.platform.isBrowser || !('storage' in navigator && 'estimate' in navigator.storage)) {
      return null;
    }

    try {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0
      };
    } catch (error) {
      console.error('Failed to get cache usage:', error);
      return null;
    }
  }

  /**
   * Register for background sync
   */
  async registerBackgroundSync(tag: string): Promise<void> {
    if (!this.swUpdate.isEnabled || !('serviceWorker' in navigator)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      if ('sync' in registration) {
        await (registration as any).sync.register(tag);
      }
    } catch (error) {
      console.error('Failed to register background sync:', error);
    }
  }
}