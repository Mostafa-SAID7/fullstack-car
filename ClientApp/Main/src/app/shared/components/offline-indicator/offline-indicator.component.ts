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
  template: `
    <!-- Connection Status Banner -->
    @if (showOfflineBanner()) {
      <div class="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-2 text-center text-sm font-medium">
        <div class="flex items-center justify-center space-x-2">
          <i class="fa-solid fa-wifi-slash"></i>
          <span>You're offline</span>
          @if (hasPendingActions()) {
            <span class="mx-2">•</span>
            <span>{{ pendingActionsCount() }} actions pending</span>
          }
        </div>
      </div>
    }

    <!-- Reconnecting Banner -->
    @if (showReconnectingBanner()) {
      <div class="fixed top-0 left-0 right-0 z-50 bg-yellow-600 text-white px-4 py-2 text-center text-sm font-medium">
        <div class="flex items-center justify-center space-x-2">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Reconnecting...</span>
        </div>
      </div>
    }

    <!-- Back Online Banner -->
    @if (showBackOnlineBanner()) {
      <div class="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white px-4 py-2 text-center text-sm font-medium animate-slide-down">
        <div class="flex items-center justify-center space-x-2">
          <i class="fa-solid fa-wifi"></i>
          <span>Back online</span>
          @if (hasPendingActions()) {
            <span class="mx-2">•</span>
            <span>Syncing {{ pendingActionsCount() }} actions...</span>
          }
        </div>
      </div>
    }

    <!-- Floating Status Indicator -->
    @if (showFloatingIndicator()) {
      <div class="fixed bottom-4 right-4 z-40">
        <div [class]="floatingIndicatorClasses()" class="px-3 py-2 rounded-full shadow-lg text-sm font-medium flex items-center space-x-2">
          <div [class]="statusIconClasses()"></div>
          <span>{{ statusText() }}</span>
          
          @if (hasPendingActions()) {
            <div class="bg-white bg-opacity-20 rounded-full px-2 py-1 text-xs">
              {{ pendingActionsCount() }}
            </div>
          }
        </div>
      </div>
    }

    <!-- Pending Actions Detail (expandable) -->
    @if (showPendingDetails()) {
      <div class="fixed bottom-20 right-4 z-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
            Pending Actions
          </h4>
          <button
            (click)="hidePendingDetails()"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>

        <div class="space-y-2 max-h-40 overflow-y-auto">
          @for (action of pendingActions(); track action.id) {
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center space-x-2">
                <i [class]="getActionIcon(action.type)"></i>
                <span class="text-gray-600 dark:text-gray-400">
                  {{ getActionLabel(action.type) }}
                </span>
              </div>
              <div class="flex items-center space-x-1">
                @if (action.retryCount > 0) {
                  <span class="text-yellow-600 dark:text-yellow-400">
                    Retry {{ action.retryCount }}
                  </span>
                }
                <span class="text-gray-500">
                  {{ formatTime(action.timestamp) }}
                </span>
              </div>
            </div>
          }
        </div>

        @if (isOnline()) {
          <button
            (click)="forceSync()"
            class="w-full mt-3 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <i class="fa-solid fa-sync mr-2"></i>
            Sync Now
          </button>
        }
      </div>
    }
  `,
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