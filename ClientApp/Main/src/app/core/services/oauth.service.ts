import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  GoogleLoginRequest,
  GitHubLoginRequest,
  FacebookLoginRequest,
  ExternalLoginInfo,
  LoginResponse
} from '../models/auth.model';
import { Result } from '../models/result.model';

@Injectable({
  providedIn: 'root'
})
export class OAuthService {
  private readonly apiUrl = `${environment.apiUrl}/v1/oauth`;

  constructor(private http: HttpClient) {}

  googleLogin(request: GoogleLoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/google`, request);
  }

  githubLogin(request: GitHubLoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/github`, request);
  }

  facebookLogin(request: FacebookLoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/facebook`, request);
  }

  linkExternalAccount(provider: string, providerKey: string): Observable<Result<void>> {
    return this.http.post<Result<void>>(`${this.apiUrl}/link/${provider}`, providerKey);
  }

  unlinkExternalAccount(provider: string): Observable<Result<void>> {
    return this.http.delete<Result<void>>(`${this.apiUrl}/unlink/${provider}`);
  }

  getExternalLogins(): Observable<Result<ExternalLoginInfo[]>> {
    return this.http.get<Result<ExternalLoginInfo[]>>(`${this.apiUrl}/external-logins`);
  }

  // Helper methods for OAuth providers
  initializeGoogleAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && (window as any).google) {
        resolve((window as any).google);
      } else {
        // Load Google API script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => resolve((window as any).google);
        script.onerror = reject;
        document.head.appendChild(script);
      }
    });
  }

  initializeFacebookAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && (window as any).FB) {
        resolve((window as any).FB);
      } else {
        // Load Facebook SDK
        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        script.onload = () => {
          (window as any).FB.init({
            appId: 'YOUR_FACEBOOK_APP_ID', // Replace with actual app ID
            cookie: true,
            xfbml: true,
            version: 'v18.0'
          });
          resolve((window as any).FB);
        };
        script.onerror = reject;
        document.head.appendChild(script);
      }
    });
  }

  getGitHubAuthUrl(): string {
    const clientId = 'YOUR_GITHUB_CLIENT_ID'; // Replace with actual client ID
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/github/callback`);
    const scope = encodeURIComponent('user:email');
    const state = this.generateRandomState();
    
    localStorage.setItem('github_oauth_state', state);
    
    return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
  }

  private generateRandomState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}