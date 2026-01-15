import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoadingService, LoadingState } from '../../services/loading/loading.service';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isLoading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div class="bg-white rounded-lg p-6 shadow-xl max-w-sm">
        <div class="flex flex-col items-center space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p *ngIf="message" class="text-gray-700 text-center">{{ message }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `]
})
export class LoadingOverlayComponent implements OnInit, OnDestroy {
  isLoading = false;
  message?: string;
  private subscription?: Subscription;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.subscription = this.loadingService.loading$.subscribe(state => {
      this.isLoading = state.size > 0;
      
      // Get the first loading state's message
      const firstState = Array.from(state.values())[0];
      this.message = firstState?.message;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
