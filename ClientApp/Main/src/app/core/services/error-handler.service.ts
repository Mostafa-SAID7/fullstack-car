import { Injectable, inject, signal, computed, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface AppError {
  id: string;
  type: 'network' | 'validation' | 'authentication' | 'authorization' | 'server' | 'client' | 'unknown';
  message: string;
  details?: any;
  timestamp: Date;
  url?: string;
  userId?: string;
  userAgent: string;
  stackTrace?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  handled: boolean;
  retryable: boolean;
}

export interface ErrorRecoveryAction {
  label: string;
  action: () => void;
  primary?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  // Reactive state
  private _errors = signal<AppError[]>([]);
  private _isOnline = signal(navigator.onLine);

  // Public readonly signals
  readonly errors = this._errors.asReadonly();
  readonly recentErrors = computed(() => 
    this._errors().filter(error => 
      Date.now() - error.timestamp.getTime() < 5 * 60 * 1000 // Last 5 minutes
    )
  );
  readonly criticalErrors = computed(() => 
    this._errors().filter(error => error.severity === 'critical')
  );

  // Error reporting endpoint
  private readonly errorReportingUrl = `${environment.apiUrl}/errors/report`;

  constructor() {
    this.setupNetworkListeners();
    this.setupUnhandledRejectionListener();
  }

  /**
   * Angular ErrorHandler implementation
   */
  handleError(error: any): void {
    console.error('Unhandled error:', error);
    
    const appError = this.createAppError(error, 'client', 'high');
    this.logError(appError);
    this.reportError(appError);
    
    // Show user-friendly error message
    this.showErrorToUser(appError);
  }

  /**
   * Handle HTTP errors
   */
  handleHttpError(error: HttpErrorResponse, context?: string): AppError {
    const appError = this.createHttpError(error, context);
    this.logError(appError);
    
    // Don't report authentication errors to avoid spam
    if (appError.type !== 'authentication') {
      this.reportError(appError);
    }
    
    this.showErrorToUser(appError);
    return appError;
  }

  /**
   * Handle application errors with context
   */
  handleAppError(
    error: Error | string, 
    type: AppError['type'] = 'client',
    severity: AppError['severity'] = 'medium',
    context?: any
  ): AppError {
    const appError = this.createAppError(error, type, severity, context);
    this.logError(appError);
    this.reportError(appError);
    this.showErrorToUser(appError);
    return appError;
  }

  /**
   * Create AppError from HTTP error
   */
  private createHttpError(error: HttpErrorResponse, context?: string): AppError {
    let type: AppError['type'] = 'server';
    let severity: AppError['severity'] = 'medium';
    let message = 'An unexpected error occurred';
    let retryable = false;

    switch (error.status) {
      case 0:
        type = 'network';
        message = 'Network connection failed. Please check your internet connection.';
        severity = 'high';
        retryable = true;
        break;
      case 400:
        type = 'validation';
        message = error.error?.message || 'Invalid request data';
        severity = 'low';
        break;
      case 401:
        type = 'authentication';
        message = 'Authentication required. Please log in again.';
        severity = 'high';
        this.handleAuthenticationError();
        break;
      case 403:
        type = 'authorization';
        message = 'You do not have permission to perform this action.';
        severity = 'medium';
        break;
      case 404:
        type = 'client';
        message = 'The requested resource was not found.';
        severity = 'low';
        break;
      case 429:
        type = 'client';
        message = 'Too many requests. Please wait a moment and try again.';
        severity = 'medium';
        retryable = true;
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        type = 'server';
        message = 'Server error. Please try again later.';
        severity = 'high';
        retryable = true;
        break;
      default:
        message = error.error?.message || `HTTP ${error.status}: ${error.statusText}`;
    }

    return {
      id: this.generateErrorId(),
      type,
      message,
      details: {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        error: error.error,
        context
      },
      timestamp: new Date(),
      url: error.url || undefined,
      userId: this.authService.currentUser()?.id,
      userAgent: navigator.userAgent,
      severity,
      handled: true,
      retryable
    };
  }

  /**
   * Create AppError from generic error
   */
  private createAppError(
    error: Error | string, 
    type: AppError['type'],
    severity: AppError['severity'],
    context?: any
  ): AppError {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    
    return {
      id: this.generateErrorId(),
      type,
      message: errorObj.message,
      details: context,
      timestamp: new Date(),
      url: window.location.href,
      userId: this.authService.currentUser()?.id,
      userAgent: navigator.userAgent,
      stackTrace: errorObj.stack,
      severity,
      handled: true,
      retryable: false
    };
  }

  /**
   * Log error to console and storage
   */
  private logError(error: AppError): void {
    // Add to errors array
    this._errors.update(errors => [error, ...errors.slice(0, 99)]); // Keep last 100 errors

    // Log to console based on severity
    const logMethod = error.severity === 'critical' ? 'error' : 
                     error.severity === 'high' ? 'error' :
                     error.severity === 'medium' ? 'warn' : 'info';
    
    console[logMethod]('App Error:', {
      id: error.id,
      type: error.type,
      message: error.message,
      details: error.details,
      timestamp: error.timestamp,
      stackTrace: error.stackTrace
    });

    // Store in localStorage for debugging
    try {
      const storedErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      storedErrors.unshift(error);
      localStorage.setItem('app_errors', JSON.stringify(storedErrors.slice(0, 50)));
    } catch (e) {
      console.warn('Failed to store error in localStorage:', e);
    }
  }

  /**
   * Report error to backend
   */
  private async reportError(error: AppError): Promise<void> {
    if (!environment.production || !this._isOnline()) {
      return;
    }

    try {
      await fetch(this.errorReportingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(error)
      });
    } catch (reportingError) {
      console.warn('Failed to report error to backend:', reportingError);
    }
  }

  /**
   * Show error to user with appropriate UI
   */
  private showErrorToUser(error: AppError): void {
    const actions: ErrorRecoveryAction[] = [];

    // Add retry action for retryable errors
    if (error.retryable) {
      actions.push({
        label: 'Retry',
        action: () => window.location.reload(),
        primary: true
      });
    }

    // Add specific actions based on error type
    switch (error.type) {
      case 'network':
        actions.push({
          label: 'Check Connection',
          action: () => this.checkNetworkConnection()
        });
        break;
      case 'authentication':
        actions.push({
          label: 'Login',
          action: () => this.router.navigate(['/auth/login']),
          primary: true
        });
        break;
      case 'authorization':
        actions.push({
          label: 'Go Home',
          action: () => this.router.navigate(['/'])
        });
        break;
    }

    // Show notification based on severity
    if (error.severity === 'critical') {
      this.showCriticalErrorDialog(error, actions);
    } else if (error.severity === 'high') {
      this.notificationService.error(error.message, { 
        duration: 10000,
        actions: actions.map(a => ({ label: a.label, action: a.action }))
      });
    } else if (error.severity === 'medium') {
      this.notificationService.warning(error.message, { duration: 5000 });
    } else {
      this.notificationService.info(error.message, { duration: 3000 });
    }
  }

  /**
   * Show critical error dialog
   */
  private showCriticalErrorDialog(error: AppError, actions: ErrorRecoveryAction[]): void {
    // This would typically open a modal dialog
    // For now, use confirm dialog as fallback
    const message = `Critical Error: ${error.message}\n\nWould you like to reload the page?`;
    
    if (confirm(message)) {
      window.location.reload();
    }
  }

  /**
   * Handle authentication errors
   */
  private handleAuthenticationError(): void {
    // Clear auth token and redirect to login
    localStorage.removeItem('auth_token');
    this.authService.logout();
    this.router.navigate(['/auth/login'], { 
      queryParams: { returnUrl: this.router.url } 
    });
  }

  /**
   * Check network connection
   */
  private checkNetworkConnection(): void {
    if (navigator.onLine) {
      this.notificationService.success('Network connection is available');
    } else {
      this.notificationService.error('No network connection detected');
    }
  }

  /**
   * Set up network status listeners
   */
  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this._isOnline.set(true);
      this.notificationService.success('Connection restored');
    });

    window.addEventListener('offline', () => {
      this._isOnline.set(false);
      this.notificationService.warning('Connection lost - working offline');
    });
  }

  /**
   * Set up unhandled promise rejection listener
   */
  private setupUnhandledRejectionListener(): void {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      const error = this.createAppError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        'client',
        'high'
      );
      
      this.logError(error);
      this.reportError(error);
      this.showErrorToUser(error);
      
      // Prevent default browser error handling
      event.preventDefault();
    });
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear old errors
   */
  clearErrors(): void {
    this._errors.set([]);
    localStorage.removeItem('app_errors');
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    recent: number;
  } {
    const errors = this._errors();
    const recent = this.recentErrors();
    
    const byType = errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const bySeverity = errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: errors.length,
      byType,
      bySeverity,
      recent: recent.length
    };
  }

  /**
   * Export errors for debugging
   */
  exportErrors(): string {
    return JSON.stringify(this._errors(), null, 2);
  }
}