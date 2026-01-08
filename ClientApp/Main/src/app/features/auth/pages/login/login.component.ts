import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { OAuthService } from '../../../../core/services/oauth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private oauthService: OAuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = null;

    const loginData = this.loginForm.value;
    console.log('[Angular LoginComponent] Form data:', loginData);
    console.log('[Angular LoginComponent] Form valid:', this.loginForm.valid);
    console.log('[Angular LoginComponent] Form errors:', this.loginForm.errors);

    // Log individual field values and validation
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      console.log(`[Angular LoginComponent] Field ${key}:`, {
        value: control?.value,
        valid: control?.valid,
        errors: control?.errors
      });
    });

    try {
      const result = await firstValueFrom(this.authService.login(loginData));
      console.log('[Angular LoginComponent] Login result:', result);

      if (result.succeeded) {
        console.log('[Angular LoginComponent] Login successful, navigating to app dashboard');
        this.router.navigate(['/community']);
      } else {
        const errorMessage = (result.errors && result.errors.length > 0)
          ? result.errors.join(', ')
          : 'Login failed. Please try again.';
        console.error('[Angular LoginComponent] Login failed:', errorMessage);
        console.error('[Angular LoginComponent] Full result:', result);
        this.error = errorMessage;
      }
    } catch (error: any) {
      console.error('[Angular LoginComponent] Login exception:', error);
      this.error = error.message || 'Login failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      await this.oauthService.initializeGoogleAuth();
      console.log('Google login not implemented yet');
    } catch (error) {
      console.error('Google login error:', error);
    }
  }

  async loginWithGitHub(): Promise<void> {
    const authUrl = this.oauthService.getGitHubAuthUrl();
    window.location.href = authUrl;
  }

  async loginWithFacebook(): Promise<void> {
    try {
      await this.oauthService.initializeFacebookAuth();
      console.log('Facebook login not implemented yet');
    } catch (error) {
      console.error('Facebook login error:', error);
    }
  }

  get emailControl() {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl() {
    return this.loginForm.get('password') as FormControl;
  }
}
