import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

@Component({
    selector: 'app-status-indicator',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="px-3 py-2 rounded-2xl border transition-all duration-300 flex items-center gap-2 w-fit"
         [ngClass]="getContainerClasses()">
      
      <!-- Icon -->
      <div class="flex items-center justify-center w-5 h-5" [ngClass]="getIconColorClasses()">
        <i [class]="'fas ' + icon + ' text-base'"></i>
      </div>

      <!-- Text -->
      <span class="text-sm font-bold uppercase tracking-widest">
        {{ label }}
      </span>

      <!-- Action Button -->
      <button 
        *ngIf="actionIcon"
        class="p-1 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-2"
        (click)="onAction()"
        [disabled]="actionDisabled">
        <i [class]="'fas ' + actionIcon + ' text-base'"></i>
      </button>

      <!-- Details Slot -->
      <div *ngIf="showDetails" class="w-full mt-2">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class StatusIndicatorComponent {
    @Input() status: StatusType = 'neutral';
    @Input() label = '';
    @Input() icon = '';
    @Input() actionIcon = '';
    @Input() actionDisabled = false;
    @Input() showDetails = false;

    @Output() action = new EventEmitter<void>();

    onAction() {
        if (!this.actionDisabled) {
            this.action.emit();
        }
    }

    getContainerClasses(): string {
        switch (this.status) {
            case 'success':
                return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300';
            case 'warning':
                return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300';
            case 'error':
                return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300';
            case 'info':
                return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300';
            default: // neutral
                return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-300';
        }
    }

    getIconColorClasses(): string {
        switch (this.status) {
            case 'success':
                return 'text-green-600 dark:text-green-400';
            case 'warning':
                return 'text-yellow-600 dark:text-yellow-400 animate-pulse';
            case 'error':
                return 'text-red-600 dark:text-red-400';
            case 'info':
                return 'text-blue-600 dark:text-blue-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    }
}
