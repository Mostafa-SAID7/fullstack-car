import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { QASignalRService, ConnectionStatus } from '../../services/qa-signalr.service';
import { ToastService } from '../../../../../../core/services/toast.service';
import { StatusIndicatorComponent, StatusType } from '../../../../../../shared/components/status-indicator/status-indicator.component';

@Component({
    selector: 'app-connection-status',
    standalone: true,
    imports: [CommonModule, StatusIndicatorComponent],
    template: `
    <app-status-indicator
      [status]="getMappedStatus()"
      [label]="getStatusText()"
      [icon]="getStatusIcon()"
      [actionIcon]="(connectionStatus === 'Failed' || connectionStatus === 'Disconnected') ? 'fa-rotate-right' : ''"
      [actionDisabled]="isRetrying"
      [showDetails]="showDetails"
      (action)="onRetry()">
      
      <!-- Details Content -->
      <div *ngIf="showDetails" class="mt-2 space-y-1 text-xs text-muted-foreground font-bold">
        <div>Status: {{ connectionStatus }}</div>
        <div *ngIf="isReconnecting">Reconnecting...</div>
        <div *ngIf="connectionStats">
          Attempts: {{ connectionStats.connectionAttempts }} | 
          Success Rate: {{ getSuccessRate() }}%
        </div>
      </div>
    </app-status-indicator>
  `
})
export class ConnectionStatusComponent implements OnInit, OnDestroy {
    connectionStatus: ConnectionStatus = ConnectionStatus.Disconnected;
    isReconnecting = false;
    isRetrying = false;
    showDetails = false;
    connectionStats: any = null;

    // Make enum available to template
    ConnectionStatus = ConnectionStatus;

    private destroy$ = new Subject<void>();

    constructor(
        private qaSignalRService: QASignalRService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.setupConnectionMonitoring();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupConnectionMonitoring(): void {
        this.qaSignalRService.connectionState$
            .pipe(takeUntil(this.destroy$))
            .subscribe(status => {
                const previousStatus = this.connectionStatus;
                this.connectionStatus = status;
                if (previousStatus !== status) {
                    this.handleStatusChange(previousStatus, status);
                }
            });

        this.qaSignalRService.reconnecting$
            .pipe(takeUntil(this.destroy$))
            .subscribe(isReconnecting => {
                this.isReconnecting = isReconnecting;
            });

        this.qaSignalRService.connectionError$
            .pipe(takeUntil(this.destroy$))
            .subscribe(error => {
                console.error('QA Connection Error:', error);
            });

        setInterval(() => {
            this.connectionStats = this.qaSignalRService.getConnectionStats();
        }, 5000);
    }

    private handleStatusChange(previousStatus: ConnectionStatus, newStatus: ConnectionStatus): void {
        if (newStatus === ConnectionStatus.Connected && previousStatus === ConnectionStatus.Reconnecting) {
            this.toastService.success('Real-time updates restored', 'Connected');
        }
    }

    getStatusIcon(): string {
        switch (this.connectionStatus) {
            case ConnectionStatus.Connected: return 'fa-wifi';
            case ConnectionStatus.Connecting: return 'fa-search';
            case ConnectionStatus.Reconnecting: return 'fa-sync fa-spin';
            case ConnectionStatus.Disconnected: return 'fa-ban';
            case ConnectionStatus.Failed: return 'fa-exclamation-circle';
            default: return 'fa-question';
        }
    }

    getMappedStatus(): StatusType {
        switch (this.connectionStatus) {
            case ConnectionStatus.Connected: return 'success';
            case ConnectionStatus.Connecting: return 'warning';
            case ConnectionStatus.Reconnecting: return 'warning';
            case ConnectionStatus.Disconnected: return 'neutral';
            case ConnectionStatus.Failed: return 'error';
            default: return 'neutral';
        }
    }

    getStatusText(): string {
        switch (this.connectionStatus) {
            case ConnectionStatus.Connected: return 'Live updates active';
            case ConnectionStatus.Connecting: return 'Connecting...';
            case ConnectionStatus.Reconnecting: return 'Reconnecting...';
            case ConnectionStatus.Disconnected: return 'Updates paused';
            case ConnectionStatus.Failed: return 'Connection failed';
            default: return 'Unknown status';
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
            setTimeout(() => {
                this.isRetrying = false;
            }, 2000);
        }
    }

    getSuccessRate(): string {
        if (!this.connectionStats) return '0.0';
        const rate = (this.connectionStats.successfulConnections / Math.max(1, this.connectionStats.connectionAttempts) * 100);
        return rate.toFixed(1);
    }
}
