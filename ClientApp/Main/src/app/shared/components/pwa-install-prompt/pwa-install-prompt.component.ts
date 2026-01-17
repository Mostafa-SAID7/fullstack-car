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
  templateUrl: './pwa-install-prompt.component.html'
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