import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { QASignalRService, ConnectionStatus } from '../../services/qa-signalr.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-connection-status',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="connection-status" [ngClass]="getStatusClasses()">
      <div class="flex items-center space-x-2">
        <!-- Status Icon -->
        <div class="status-icon" [ngClass]="getIconClasses()">
          <mat-icon>{{ getStatusIcon() }}</mat-icon>
        </div>

        <!-- Status Text -->
        <span class="status-text text-sm font-medium">
          {{ getStatusText() }}
        </span>

        <!-- Retry Button (shown when disconnected) -->
        <button 
          *ngIf="connectionStatus === 'Failed' || connectionStatus === 'Disconnected'"
          class="retry-button"
          (click)="onRetry()"
          [disabled]="isRetrying">
          <mat-icon>refresh</mat-icon>
        </button>
      </div>

      <!-- Connection Details (expandable) -->
      <div class="connection-details" *ngIf="showDetails">
        <div class="text-xs text-gray-600 mt-2 space-y-1">
          <div>Status: {{ connectionStatus }}</div>
          <div *ngIf="isReconnecting">Reconnecting...</div>
          <div *ngIf="connectionStats">
            Attempts: {{ connectionStats.connectionAttempts }} | 
            Success Rate: {{ getSuccessRate() }}%
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .connection-status {
      @apply px-3 py-2 rounded-lg border transition-all duration-300;
    }

    .connection-status.connected {
      @apply bg-green-50 border-green-200 text-green-800;
    }

    .connection-status.connecting {
      @apply bg-yellow-50 border-yellow-200 text-yellow-800;
    }

    .connection-status.reconnecting {
      @apply bg-orange-50 border-orange-200 text-orange-800;
    }

    .connection-status.disconnected {
      @apply bg-red-50 border-red-200 text-red-800;
    }

    .connection-status.failed {
      @apply bg-red-50 border-red-200 text-red-800;
    }

    .status-icon {
      @apply flex items-center justify-center w-5 h-5;
    }

    .status-icon.connected {
      @apply text-green-600;
    }

    .status-icon.connecting {
      @apply text-yellow-600 animate-pulse;
    }

    .status-icon.reconnecting {
      @apply text-orange-600 animate-spin;
    }

    .status-icon.disconnected {
      @apply text-red-600;
    }

    .status-icon.failed {
      @apply text-red-600;
    }

    .retry-button {
      @apply p-1 rounded-full hover:bg-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
    }

    .retry-button:hover:not(:disabled) {
      @apply bg-white/70;
    }

    mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `]
})
export class ConnectionStatusComponent implements OnInit, OnDestroy {
  connectionStatus: ConnectionStatus = ConnectionStatus.Disconnected;
  isReconnecting = false;
  isRetrying = false;
  showDetails = false;
  connectionStats: any = null;

  private destroy$ = new Subject<void>();

  constructor(
    private qaSignalRService: QASignalRService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.setupConnectionMonitoring();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupConnectionMonitoring(): void {
    // Monitor connection state
    this.qaSignalRService.connectionState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        const previousStatus = this.connectionStatus;
        this.connectionStatus = status;

        // Show notifications for important state changes
        if (previousStatus !== status) {
          this.handleStatusChange(previousStatus, status);
        }
      });

    // Monitor reconnection state
    this.qaSignalRService.reconnecting$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isReconnecting => {
        this.isReconnecting = isReconnecting;
      });

    // Monitor connection errors
    this.qaSignalRService.connectionError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        console.error('QA Connection Error:', error);
        if (!error.isRecoverable) {
          this.toastService.error('Connection failed. Please refresh the page.', 'Connection Error');
        }
      });

    // Update connection stats periodically
    setInterval(() => {
      this.connectionStats = this.qaSignalRService.getConnectionStats();
    }, 5000);
  }

  private handleStatusChange(previousStatus: ConnectionStatus, newStatus: ConnectionStatus): void {
    switch (newStatus) {
      case ConnectionStatus.Connected:
        if (previousStatus === ConnectionStatus.Reconnecting) {
          this.toastService.success('Real-time updates restored', 'Connected');
        }
        break;
      
      case ConnectionStatus.Disconnected:
        if (previousStatus === ConnectionStatus.Connected) {
          this.toastService.warning('Real-time updates paused', 'Disconnected');
        }
        break;
      
      case ConnectionStatus.Failed:
        this.toastService.error('Unable to connect for real-time updates', 'Connection Failed');
        break;
    }
  }

  getStatusClasses(): string {
    const baseClasses = 'connection-status';
    
    switch (this.connectionStatus) {
      case ConnectionStatus.Connected:
        return `${baseClasses} connected`;
      case ConnectionStatus.Connecting:
        return `${baseClasses} connecting`;
      case ConnectionStatus.Reconnecting:
        return `${baseClasses} reconnecting`;
      case ConnectionStatus.Disconnected:
        return `${baseClasses} disconnected`;
      case ConnectionStatus.Failed:
        return `${baseClasses} failed`;
      default:
        return baseClasses;
    }
  }

  getIconClasses(): string {
    const baseClasses = 'status-icon';
    
    switch (this.connectionStatus) {
      case ConnectionStatus.Connected:
        return `${baseClasses} connected`;
      case ConnectionStatus.Connecting:
        return `${baseClasses} connecting`;
      case ConnectionStatus.Reconnecting:
        return `${baseClasses} reconnecting`;
      case ConnectionStatus.Disconnected:
        return `${baseClasses} disconnected`;
      case ConnectionStatus.Failed:
        return `${baseClasses} failed`;
      default:
        return baseClasses;
    }
  }

  getStatusIcon(): string {
    switch (this.connectionStatus) {
      case ConnectionStatus.Connected:
        return 'wifi';
      case ConnectionStatus.Connecting:
        return 'wifi_find';
      case ConnectionStatus.Reconnecting:
        return 'sync';
      case ConnectionStatus.Disconnected:
        return 'wifi_off';
      case ConnectionStatus.Failed:
        return 'error';
      default:
        return 'help';
    }
  }

  getStatusText(): string {
    switch (this.connectionStatus) {
      case ConnectionStatus.Connected:
        return 'Live updates active';
      case ConnectionStatus.Connecting:
        return 'Connecting...';
      case ConnectionStatus.Reconnecting:
        return 'Reconnecting...';
      case ConnectionStatus.Disconnected:
        return 'Updates paused';
      case ConnectionStatus.Failed:
        return 'Connection failed';
      default:
        return 'Unknown status';
    }
  }

  async onRetry(): Promise<void> {
    if (this.isRetrying) return;

    this.isRetrying = true;
    try {
      this.qaSignalRService.forceReconnect();
      this.toastService.info('Attempting to reconnect...', 'Reconnecting');
    } catch (error) {
      console.error('Error during manual reconnection:', error);
      this.toastService.error('Failed to reconnect. Please try again.', 'Retry Failed');
    } finally {
      // Reset retry state after a delay
      setTimeout(() => {
        this.isRetrying = false;
      }, 2000);
    }
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  getSuccessRate(): string {
    if (!this.connectionStats) return '0.0';
    const rate = (this.connectionStats.successfulConnections / Math.max(1, this.connectionStats.connectionAttempts) * 100);
    return rate.toFixed(1);
  }
}