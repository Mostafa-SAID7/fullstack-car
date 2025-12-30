import { apiClient } from './api';
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  UserInfo,
  ConfirmEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ApiResult
} from '../types/auth';

export class AuthService {
  private static instance: AuthService;
  private currentUser: UserInfo | null = null;
  private listeners: ((user: UserInfo | null) => void)[] = [];

  private constructor() {
    this.loadStoredAuth();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  getCurrentUser(): UserInfo | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser && !!localStorage.getItem('token');
  }

  subscribe(listener: (user: UserInfo | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/v1/auth/login', request);
    this.setAuthData(response);
    return response;
  }

  async register(request: RegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/v1/auth/register', request);
    this.setAuthData(response);
    return response;
  }

  async confirmEmail(request: ConfirmEmailRequest): Promise<ApiResult<void>> {
    return apiClient.post<ApiResult<void>>('/v1/auth/confirm-email', request);
  }

  async resendEmailConfirmation(email: string): Promise<ApiResult<void>> {
    return apiClient.post<ApiResult<void>>('/v1/auth/resend-email-confirmation', email);
  }

  async forgotPassword(request: ForgotPasswordRequest): Promise<ApiResult<void>> {
    return apiClient.post<ApiResult<void>>('/v1/password/forgot', request);
  }

  async resetPassword(request: ResetPasswordRequest): Promise<ApiResult<void>> {
    return apiClient.post<ApiResult<void>>('/v1/password/reset', request);
  }

  async changePassword(request: ChangePasswordRequest): Promise<ApiResult<void>> {
    return apiClient.post<ApiResult<void>>('/v1/password/change', request);
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post<ApiResult<void>>('/v1/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  async revokeToken(token: string): Promise<ApiResult<void>> {
    return apiClient.post<ApiResult<void>>('/v1/auth/revoke-token', token);
  }

  private setAuthData(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('tokenExpiry', response.expiresAt);
    
    this.currentUser = response.user;
    this.notifyListeners();
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    const expiry = localStorage.getItem('tokenExpiry');

    if (token && userJson && expiry) {
      const expiryDate = new Date(expiry);
      if (expiryDate > new Date()) {
        this.currentUser = JSON.parse(userJson);
        this.notifyListeners();
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
    
    this.currentUser = null;
    this.notifyListeners();
  }
}

export const authService = AuthService.getInstance();