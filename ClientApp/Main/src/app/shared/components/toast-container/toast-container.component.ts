import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.component.html'
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

  trackById(index: number, item: Toast): string {
    return item.id;
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success':
        return 'fas fa-check';
      case 'error':
        return 'fas fa-exclamation';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
        return 'fas fa-info';
      default:
        return 'fas fa-bell';
    }
  }

  removeToast(id: string): void {
    this.toastService.removeToast(id);
  }
}