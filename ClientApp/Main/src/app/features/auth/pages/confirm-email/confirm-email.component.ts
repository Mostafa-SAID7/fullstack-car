import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-confirm-email',
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <div *ngIf="loading" class="space-y-4">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <h2 class="text-2xl font-bold text-gray-900">Confirming your email...</h2>
            <p class="text-gray-600">Please wait while we verify your email address.</p>
          </div>

          <div *ngIf="success" class="space-y-4">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">Email confirmed!</h2>
            <p class="text-gray-600">Your email has been successfully verified. You can now access all features.</p>
            <button
              (click)="goToLogin()"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue to Sign In
            </button>
          </div>

          <div *ngIf="error" class="space-y-4">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">Confirmation failed</h2>
            <p class="text-gray-600">{{ error }}</p>
            <div class="space-y-2">
              <button
                (click)="resendConfirmation()"
                [disabled]="resendLoading"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <span *ngIf="resendLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                {{ resendLoading ? 'Sending...' : 'Resend confirmation email' }}
              </button>
              <div>
                <a routerLink="/auth/login" class="text-sm text-indigo-600 hover:text-indigo-500">
                  Back to Sign In
                </a>
              </div>
            </div>
          </div>

          <div *ngIf="resendSuccess" class="mt-4 text-green-600 text-sm">
            Confirmation email has been sent. Please check your inbox.
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConfirmEmailComponent implements OnInit {
  loading = true;
  success = false;
  error: string | null = null;
  resendLoading = false;
  resendSuccess = false;
  
  private userId: string | null = null;
  private token: string | null = null;
  private email: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      this.token = params['token'];
      this.email = params['email'];
      
      if (this.userId && this.token) {
        this.confirmEmail();
      } else {
        this.loading = false;
        this.error = 'Invalid confirmation link. Please check your email for the correct link.';
      }
    });
  }

  private async confirmEmail(): Promise<void> {
    if (!this.userId || !this.token) return;

    try {
      const request = {
        userId: this.userId,
        token: this.token
      };

      const result = await firstValueFrom(this.authService.confirmEmail(request));
      
      if (result?.isSuccess) {
        this.success = true;
      } else {
        this.error = result?.message || 'Email confirmation failed. The link may be expired or invalid.';
      }
    } catch (error: any) {
      this.error = error.message || 'Email confirmation failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  async resendConfirmation(): Promise<void> {
    if (!this.email) {
      this.error = 'Email address not available. Please try signing up again.';
      return;
    }

    this.resendLoading = true;
    this.resendSuccess = false;

    try {
      const result = await firstValueFrom(this.authService.resendEmailConfirmation(this.email));
      
      if (result?.isSuccess) {
        this.resendSuccess = true;
      } else {
        this.error = result?.message || 'Failed to resend confirmation email.';
      }
    } catch (error: any) {
      this.error = error.message || 'Failed to resend confirmation email.';
    } finally {
      this.resendLoading = false;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}