import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.forgotPasswordForm.invalid) return;

    this.loading = true;
    this.error = null;
    this.success = null;

    try {
      const result = await firstValueFrom(this.authService.forgotPassword(this.forgotPasswordForm.value));
      if (result?.succeeded) {
        this.success = 'Password reset link has been sent to your email.';
      } else {
        this.error = result?.errors?.[0] || 'Failed to send reset link. Please try again.';
      }
    } catch (error: any) {
      this.error = error.message || 'Failed to send reset link. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}