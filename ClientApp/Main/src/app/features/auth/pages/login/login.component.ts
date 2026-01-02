import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { OAuthService } from '../../../../core/services/oauth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { FormButtonComponent } from '../../../../shared/components/form-button/form-button.component';
import { OAuthButtonComponent } from '../../../../shared/components/oauth-button/oauth-button.component';
import { AuthLayoutComponent } from '../../../../shared/components/auth-layout/auth-layout.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormInputComponent,
    FormButtonComponent,
    OAuthButtonComponent,
    AuthLayoutComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

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
