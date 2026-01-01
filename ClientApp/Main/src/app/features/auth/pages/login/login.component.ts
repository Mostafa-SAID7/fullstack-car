import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error: string | null = null;

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
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = null;

    try {
      await firstValueFrom(this.authService.login(this.loginForm.value));
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.error = error.message || 'Login failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      await this.oauthService.initializeGoogleAuth();
      // Implement Google OAuth flow
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
      // Implement Facebook OAuth flow
      console.log('Facebook login not implemented yet');
    } catch (error) {
      console.error('Facebook login error:', error);
    }
  }
}