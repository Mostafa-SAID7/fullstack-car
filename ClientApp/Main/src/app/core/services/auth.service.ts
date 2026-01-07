import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse, 
  UserInfo, 
  RefreshTokenRequest,
  ConfirmEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest
} from '../models/auth.model';
import { Result } from '../models/result.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/v1/auth`;
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredAuth();
  }

  get currentUser(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return this.tokenSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.token && !!this.currentUser;
  }

  login(request: LoginRequest): Observable<Result<LoginResponse>> {
    console.log('[Angular AuthService] Making login request to:', `${this.apiUrl}/login`);
    console.log('[Angular AuthService] Request payload:', request);
    
    return this.http.post<Result<any>>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => {
          console.log('[Angular AuthService] Login response:', response);
          if (response.succeeded && response.data) {
            // Backend returns AuthResponse, map it to LoginResponse
            const authResponse = response.data;
            const loginResponse: LoginResponse = {
              token: authResponse.token,
              refreshToken: authResponse.refreshToken,
              user: authResponse.user,
              expiresAt: authResponse.expiresAt
            };
            this.setAuthData(loginResponse);
          }
        })
      );
  }

  register(request: RegisterRequest): Observable<Result<LoginResponse>> {
    return this.http.post<Result<LoginResponse>>(`${this.apiUrl}/register`, request)
      .pipe(
        tap(response => {
          if (response.succeeded && response.data) {
            this.setAuthData(response.data);
          }
        })
      );
  }

  refreshToken(): Observable<Result<LoginResponse>> {
    const refreshToken = localStorage.getItem('refreshToken');
    const token = this.token;
    
    if (!refreshToken || !token) {
      throw new Error('No refresh token available');
    }

    const request: RefreshTokenRequest = { token, refreshToken };
    
    return this.http.post<Result<LoginResponse>>(`${this.apiUrl}/refresh-token`, request)
      .pipe(
        tap(response => {
          if (response.succeeded && response.data) {
            this.setAuthData(response.data);
          }
        })
      );
  }

  confirmEmail(request: ConfirmEmailRequest): Observable<Result<void>> {
    return this.http.post<Result<void>>(`${this.apiUrl}/confirm-email`, request);
  }

  resendEmailConfirmation(email: string): Observable<Result<void>> {
    return this.http.post<Result<void>>(`${this.apiUrl}/resend-email-confirmation`, email);
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<Result<void>> {
    return this.http.post<Result<void>>(`${environment.apiUrl}/v1/password/forgot`, request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<Result<void>> {
    return this.http.post<Result<void>>(`${environment.apiUrl}/v1/password/reset`, request);
  }

  changePassword(request: ChangePasswordRequest): Observable<Result<void>> {
    return this.http.post<Result<void>>(`${environment.apiUrl}/v1/password/change`, request);
  }

  logout(): Observable<Result<void>> {
    return this.http.post<Result<void>>(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => {
          this.clearAuthData();
        })
      );
  }

  revokeToken(token: string): Observable<Result<void>> {
    return this.http.post<Result<void>>(`${this.apiUrl}/revoke-token`, token);
  }

  private setAuthData(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('tokenExpiry', response.expiresAt);
    
    this.tokenSubject.next(response.token);
    this.currentUserSubject.next(response.user);
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    const expiry = localStorage.getItem('tokenExpiry');

    if (token && userJson && expiry) {
      const expiryDate = new Date(expiry);
      if (expiryDate > new Date()) {
        this.tokenSubject.next(token);
        this.currentUserSubject.next(JSON.parse(userJson));
      } else {
        this.clearAuthData();
      }
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }
}