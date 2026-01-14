import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';


export type ErrorType = 'network' | 'server' | 'notFound' | 'unauthorized' | 'forbidden' | 'timeout' | 'validation' | 'generic';
export type ErrorSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-display.component.html',
  styleUrls: ['./error-display.component.scss']
})
export class ErrorDisplayComponent {
  @Input() type: ErrorType = 'generic';
  @Input() title = '';
  @Input() message = '';
  @Input() details = '';
  @Input() showRetry = true;
  @Input() showHome = true;
  @Input() showDetails = false;
  @Input() size: ErrorSize = 'md';

  @Output() retry = new EventEmitter<void>();
  @Output() goHome = new EventEmitter<void>();

  get errorConfig() {
    const configs = {
      network: {
        icon: 'fas fa-wifi-slash',
        title: 'Connection Error',
        message: 'Unable to connect to the server. Please check your internet connection.',
        color: 'text-orange-500'
      },
      server: {
        icon: 'fas fa-server',
        title: 'Server Error',
        message: 'Something went wrong on our end. Please try again later.',
        color: 'text-red-500'
      },
      notFound: {
        icon: 'fas fa-search',
        title: 'Not Found',
        message: 'The content you\'re looking for doesn\'t exist or has been moved.',
        color: 'text-blue-500'
      },
      unauthorized: {
        icon: 'fas fa-lock',
        title: 'Access Denied',
        message: 'You need to sign in to access this content.',
        color: 'text-yellow-500'
      },
      forbidden: {
        icon: 'fas fa-ban',
        title: 'Forbidden',
        message: 'You don\'t have permission to access this content.',
        color: 'text-red-500'
      },
      timeout: {
        icon: 'fas fa-clock',
        title: 'Request Timeout',
        message: 'The request took too long to complete. Please try again.',
        color: 'text-orange-500'
      },
      validation: {
        icon: 'fas fa-exclamation-triangle',
        title: 'Validation Error',
        message: 'Please check your input and try again.',
        color: 'text-yellow-500'
      },
      generic: {
        icon: 'fas fa-exclamation-circle',
        title: 'Something went wrong',
        message: 'An unexpected error occurred. Please try again.',
        color: 'text-red-500'
      }
    };

    return configs[this.type];
  }

  get sizeConfig() {
    const configs = {
      sm: {
        container: 'p-4',
        icon: 'text-2xl',
        iconContainer: 'w-12 h-12',
        title: 'text-lg',
        message: 'text-sm',
        button: 'px-3 py-1.5 text-sm'
      },
      md: {
        container: 'p-6',
        icon: 'text-3xl',
        iconContainer: 'w-16 h-16',
        title: 'text-xl',
        message: 'text-base',
        button: 'px-4 py-2 text-sm'
      },
      lg: {
        container: 'p-8',
        icon: 'text-4xl',
        iconContainer: 'w-20 h-20',
        title: 'text-2xl',
        message: 'text-lg',
        button: 'px-6 py-3 text-base'
      }
    };

    return configs[this.size];
  }

  get displayTitle(): string {
    return this.title || this.errorConfig.title;
  }

  get displayMessage(): string {
    return this.message || this.errorConfig.message;
  }

  onRetry(): void {
    this.retry.emit();
  }

  onGoHome(): void {
    this.goHome.emit();
  }
}