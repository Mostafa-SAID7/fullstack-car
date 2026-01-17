import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PWAService } from '../../../core/services/pwa.service';

/**
 * PWA Install Prompt Component
 * 
 * Shows install prompt for PWA when available
 */
@Component({
  selector: 'app-pwa-install-prompt',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Install Banner -->
    @if (showInstallBanner()) {
      <div class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <img 
                src="/assets/icons/icon-72x72.png" 
                alt="App Icon" 
                class="w-12 h-12 rounded-lg">
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Install Main App
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Get the full app experience with offline access and push notifications
              </p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <button
              (click)="dismissInstallPrompt()"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
              Not now
            </button>
            <button
              (click)="installApp()"
              [disabled]="isInstalling()"
              class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
              @if (isInstalling()) {
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Installing...</span>
              } @else {
                <i class="fa-solid fa-download"></i>
                <span>Install</span>
              }
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Install Card (for in-content placement) -->
    @if (showInstallCard()) {
      <div class="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            <div class="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
              <i class="fa-solid fa-mobile-alt text-2xl text-primary"></i>
            </div>
          </div>
          
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Install as App
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Install Main App on your device for a better experience with:
            </p>
            
            <ul class="space-y-2 mb-4">
              <li class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <i class="fa-solid fa-check text-green-500"></i>
                <span>Offline access to your content</span>
              </li>
              <li class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <i class="fa-solid fa-check text-green-500"></i>
                <span>Push notifications for messages</span>
              </li>
              <li class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <i class="fa-solid fa-check text-green-500"></i>
                <span>Faster loading and better performance</span>
              </li>
              <li class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <i class="fa-solid fa-check text-green-500"></i>
                <span>Native app-like experience</span>
              </li>
            </ul>
            
            <div class="flex items-center space-x-3">
              <button
                (click)="installApp()"
                [disabled]="isInstalling()"
                class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
                @if (isInstalling()) {
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Installing...</span>
                } @else {
                  <i class="fa-solid fa-download"></i>
                  <span>Install Now</span>
                }
              </button>
              
              <button
                (click)="dismissInstallPrompt()"
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- iOS Install Instructions -->
    @if (showIOSInstructions()) {
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            <i class="fa-brands fa-apple text-2xl text-blue-600"></i>
          </div>
          
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Install on iOS
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              To install this app on your iOS device:
            </p>
            
            <ol class="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
              <li class="flex items-start space-x-2">
                <span class="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">1</span>
                <span>Tap the <i class="fa-solid fa-share mx-1"></i> share button in Safari</span>
              </li>
              <li class="flex items-start space-x-2">
                <span class="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">2</span>
                <span>Scroll down and tap "Add to Home Screen"</span>
              </li>
              <li class="flex items-start space-x-2">
                <span class="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">3</span>
                <span>Tap "Add" to install the app</span>
              </li>
            </ol>
            
            <button
              (click)="dismissInstallPrompt()"
              class="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors">
              Got it
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Update Available Banner -->
    @if (showUpdateBanner()) {
      <div class="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white px-4 py-2 text-center text-sm font-medium">
        <div class="flex items-center justify-center space-x-4">
          <div class="flex items-center space-x-2">
            <i class="fa-solid fa-sync-alt"></i>
            <span>App update available</span>
          </div>
          
          <div class="flex items-center space-x-2">
            <button
              (click)="dismissUpdate()"
              class="text-blue-200 hover:text-white transition-colors">
              Later
            </button>
            <button
              (click)="updateApp()"
              [disabled]="isUpdating()"
              class="bg-white text-blue-600 px-3 py-1 rounded text-xs font-medium hover:bg-blue-50 transition-colors disabled:opacity-50">
              @if (isUpdating()) {
                <span>Updating...</span>
              } @else {
                <span>Update</span>
              }
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class PWAInstallPromptComponent {
  private pwaService = inject(PWAService);

  // Local state
  protected isInstalling = signal(false);
  protected isUpdating = signal(false);
  protected isDismissed = signal(false);
  protected updateDismissed = signal(false);

  // Computed properties from PWA service
  readonly canInstall = computed(() => this.pwaService.canInstall());
  readonly isInstalled = computed(() => this.pwaService.isInstalled());
  readonly updateAvailable = computed(() => this.pwaService.updateAvailable());
  readonly isStandalone = computed(() => this.pwaService.isStandalone());

  // Display logic
  readonly showInstallBanner = computed(() =>
    this.canInstall() && !this.isDismissed() && !this.isIOSDevice()
  );

  readonly showInstallCard = computed(() =>
    this.canInstall() && !this.isDismissed() && !this.isIOSDevice()
  );

  readonly showIOSInstructions = computed(() =>
    this.isIOSDevice() && !this.isStandalone() && !this.isDismissed()
  );

  readonly showUpdateBanner = computed(() =>
    this.updateAvailable() && !this.updateDismissed()
  );

  private isIOSDevice(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  async installApp(): Promise<void> {
    if (this.isInstalling()) return;

    this.isInstalling.set(true);

    try {
      const success = await this.pwaService.promptInstall();

      if (success) {
        this.isDismissed.set(true);
        this.showInstallSuccessMessage();
      }
    } catch (error) {
      console.error('Failed to install app:', error);
      this.showInstallErrorMessage();
    } finally {
      this.isInstalling.set(false);
    }
  }

  async updateApp(): Promise<void> {
    if (this.isUpdating()) return;

    this.isUpdating.set(true);

    try {
      await this.pwaService.applyUpdate();
      this.updateDismissed.set(true);
    } catch (error) {
      console.error('Failed to update app:', error);
    } finally {
      this.isUpdating.set(false);
    }
  }

  dismissInstallPrompt(): void {
    this.isDismissed.set(true);

    // Remember dismissal for 7 days
    const dismissedUntil = Date.now() + (7 * 24 * 60 * 60 * 1000);
    localStorage.setItem('pwa_install_dismissed', dismissedUntil.toString());
  }

  dismissUpdate(): void {
    this.updateDismissed.set(true);
  }

  private showInstallSuccessMessage(): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('App Installed Successfully', {
        body: 'Main App has been installed and is ready to use!',
        icon: '/assets/icons/icon-192x192.png'
      });
    }
  }

  private showInstallErrorMessage(): void {
    // This could be replaced with a toast notification service
    alert('Failed to install the app. Please try again.');
  }

  constructor() {
    // Check if install prompt was previously dismissed
    const dismissed = localStorage.getItem('pwa_install_dismissed');
    if (dismissed) {
      const dismissedUntil = parseInt(dismissed);
      if (Date.now() < dismissedUntil) {
        this.isDismissed.set(true);
      } else {
        localStorage.removeItem('pwa_install_dismissed');
      }
    }
  }
}