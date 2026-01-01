import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { ConfirmEmailRequest } from '../../../../core/models/auth.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirm-email.component.html'
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
  ) { }

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
      const request: ConfirmEmailRequest = {
        userId: this.userId!,
        token: this.token!
      };

      const result = await firstValueFrom(this.authService.confirmEmail(request));

      if (result?.succeeded) {
        this.success = true;
      } else {
        this.error = result?.errors?.[0] || 'Email confirmation failed. The link may be expired or invalid.';
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

      if (result?.succeeded) {
        this.resendSuccess = true;
      } else {
        this.error = result?.errors?.[0] || 'Failed to resend confirmation email.';
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