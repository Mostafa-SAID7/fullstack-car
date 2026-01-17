import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfflineService } from '../../../core/services/offline.service';
import { PWAService } from '../../../core/services/pwa.service';

/**
 * Offline Indicator Component
 * 
 * Shows connection status and pending actions
 */
@Component({
  selector: 'app-offline-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offline-indicator.component.html',
  styles: [`
    @keyframes slide-down {
      from {
        transform: translateY(-100%);
      }
      to {
        transform: translateY(0);
      }
    }

    .animate-slide-down {
      animation: slide-down 0.3s ease-out;
    }
  `]
})
export class OfflineIndicatorComponent {
  private offlineService = inject(OfflineService);
  private pwaService = inject(PWAService);

  // Local state
  showPendingDetails = signal(false);
  private wasOffline = false;
  private backOnlineTimer: any = null;

  // Computed properties from services
  readonly isOnline = computed(() => this.offlineService.isOnline());
  readonly isOffline = computed(() => this.offlineService.isOffline());
  readonly pendingActions = computed(() => this.offlineService.pendingActions());
  readonly hasPendingActions = computed(() => this.offlineService.hasPendingActions());
  readonly pendingActionsCount = computed(() => this.pendingActions().length);

  // Display logic
  readonly showOfflineBanner = computed(() => this.isOffline());
  
  readonly showReconnectingBanner = computed(() => {
    // This would be based on actual reconnection state
    return false; // Placeholder
  });

  readonly showBackOnlineBanner = computed(() => {
    const isOnline = this.isOnline();
    
    if (isOnline && this.wasOffline) {
      if (this.backOnlineTimer) {
        clearTimeout(this.backOnlineTimer);
      }
      
      this.backOnlineTimer = setTimeout(() => {
        this.wasOffline = false;
      }, 3000);
      
      return true;
    }
    
    if (!isOnline) {
      this.wasOffline = true;
    }
    
    return false;
  });

  readonly showFloatingIndicator = computed(() => {
    return this.isOffline() || this.hasPendingActions();
  });

  readonly floatingIndicatorClasses = computed(() => {
    const base = 'transition-all duration-300';
    
    if (this.isOffline()) {
      return `${base} bg-red-600 text-white`;
    } else if (this.hasPendingActions()) {
      return `${base} bg-yellow-600 text-white`;
    } else {
      return `${base} bg-green-600 text-white`;
    }
  });

  readonly statusIconClasses = computed(() => {
    const base = 'w-2 h-2 rounded-full';
    
    if (this.isOffline()) {
      return `${base} bg-red-300 animate-pulse`;
    } else if (this.hasPendingActions()) {
      return `${base} bg-yellow-300 animate-pulse`;
    } else {
      return `${base} bg-green-300`;
    }
  });

  readonly statusText = computed(() => {
    if (this.isOffline()) {
      return 'Offline';
    } else if (this.hasPendingActions()) {
      return 'Syncing';
    } else {
      return 'Online';
    }
  });

  getActionIcon(type: string): string {
    switch (type) {
      case 'message':
        return 'fa-solid fa-comment text-blue-500';
      case 'post':
        return 'fa-solid fa-edit text-green-500';
      case 'like':
        return 'fa-solid fa-heart text-red-500';
      case 'comment':
        return 'fa-solid fa-reply text-purple-500';
      case 'join_group':
        return 'fa-solid fa-users text-indigo-500';
      case 'update_profile':
        return 'fa-solid fa-user text-orange-500';
      default:
        return 'fa-solid fa-clock text-gray-500';
    }
  }

  getActionLabel(type: string): string {
    switch (type) {
      case 'message':
        return 'Send message';
      case 'post':
        return 'Create post';
      case 'like':
        return 'Like content';
      case 'comment':
        return 'Add comment';
      case 'join_group':
        return 'Join group';
      case 'update_profile':
        return 'Update profile';
      default:
        return 'Unknown action';
    }
  }

  formatTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    
    return new Date(timestamp).toLocaleDateString();
  }

  showPendingDetailsPanel(): void {
    this.showPendingDetails.set(true);
  }

  hidePendingDetails(): void {
    this.showPendingDetails.set(false);
  }

  async forceSync(): Promise<void> {
    try {
      await this.offlineService.forceSync();
    } catch (error) {
      console.error('Failed to force sync:', error);
    }
  }
}