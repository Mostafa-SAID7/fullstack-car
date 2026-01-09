import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      @for (toast of toasts; track toast.id) {
        <div class="transform transition-all duration-300 ease-in-out animate-in slide-in-from-right-full"
          [class]="getToastClasses(toast)">
          
          <div class="flex items-start gap-3 p-4 rounded-lg shadow-lg border backdrop-blur-sm">
            <div class="flex-shrink-0 mt-0.5">
              <i [class]="getIconClass(toast.type)"></i>
            </div>
            
            <div class="flex-1 min-w-0">
              @if (toast.title) {
                <p class="text-sm font-semibold mb-1">{{ toast.title }}</p>
              }
              <p class="text-sm">{{ toast.message }}</p>
            </div>
            
            <button 
              (click)="removeToast(toast.id)"
              class="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors">
              <i class="fas fa-times text-xs"></i>
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  private readonly toastService = inject(ToastService);
  toasts: Toast[] = [];
  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getToastClasses(toast: Toast): string {
    const baseClasses = 'relative overflow-hidden';
    
    switch (toast.type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-green-200 text-green-800`;
      case 'error':
        return `${baseClasses} bg-red-50 border-red-200 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-200 text-yellow-800`;
      case 'info':
        return `${baseClasses} bg-blue-50 border-blue-200 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-50 border-gray-200 text-gray-800`;
    }
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle text-green-500';
      case 'error':
        return 'fas fa-exclamation-circle text-red-500';
      case 'warning':
        return 'fas fa-exclamation-triangle text-yellow-500';
      case 'info':
        return 'fas fa-info-circle text-blue-500';
      default:
        return 'fas fa-bell text-gray-500';
    }
  }

  removeToast(id: string): void {
    this.toastService.removeToast(id);
  }
}