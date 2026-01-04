import { apiClient } from './api';
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  UserInfo,
  ConfirmEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  ProfileResponse,
  SecurityLogResponse,
  UserSessionResponse,
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

  async verifyToken(_token: string): Promise<boolean> {
    try {
      // We can verify by trying to fetch the profile
      await this.getProfile();
      return true;
    } catch {
      return false;
    }
  }

  async refreshToken(request: { token: string; refreshToken: string }): Promise<LoginResponse> {
    // Manually trigger a refresh
    // Note: apiClient handles this automatically usually, but if called explicitly:
    const response = await apiClient.post<any>('/v1/auth/refresh-token', request);

    // Map response to LoginResponse structure if needed, or assume backend returns new tokens
    const loginResponse: LoginResponse = {
      success: true,
      message: 'Token refreshed',
      token: response.token,
      refreshToken: response.refreshToken,
      expiresAt: response.expiresAt,
      user: response.user
    };

    this.setAuthData(loginResponse);
    return loginResponse;
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

  async updateProfile(request: UpdateProfileRequest): Promise<ApiResult<UserInfo>> {
    const response = await apiClient.put<UserInfo>('/v1/profile', request);
    // Update local storage if user info changed
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const updatedUser = { ...user, ...response };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      this.currentUser = updatedUser;
      this.notifyListeners();
    }
    return { succeeded: true, data: response } as any;
  }

  async getProfile(): Promise<ApiResult<ProfileResponse>> {
    return apiClient.get<ApiResult<ProfileResponse>>('/v1/profile');
  }

  async getSecurityLogs(page = 1, pageSize = 10): Promise<ApiResult<SecurityLogResponse[]>> {
    return apiClient.get<ApiResult<SecurityLogResponse[]>>(`/v1/security/logs?page=${page}&pageSize=${pageSize}`);
  }

  async getActiveSessions(): Promise<ApiResult<UserSessionResponse[]>> {
    return apiClient.get<ApiResult<UserSessionResponse[]>>('/v1/security/sessions');
  }

  async revokeSession(sessionId: string): Promise<ApiResult<void>> {
    return apiClient.delete<ApiResult<void>>(`/v1/security/sessions/${sessionId}`);
  }

  async revokeAllSessions(): Promise<ApiResult<void>> {
    return apiClient.delete<ApiResult<void>>('/v1/security/sessions');
  }

  async getTwoFactorStatus(): Promise<ApiResult<{ isEnabled: boolean }>> {
    return apiClient.get<ApiResult<{ isEnabled: boolean }>>('/v1/security/2fa/status');
  }

  async toggleTwoFactor(enable: boolean): Promise<ApiResult<void>> {
    const endpoint = enable ? '/v1/security/2fa/enable' : '/v1/security/2fa/disable';
    return apiClient.post<ApiResult<void>>(endpoint);
  }

  // --- Profile Advanced Methods ---

  async uploadAvatar(file: File): Promise<ApiResult<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.upload<ApiResult<{ url: string }>>('/v1/profile/avatar', formData);
  }

  async deleteAvatar(): Promise<ApiResult<void>> {
    return apiClient.delete<ApiResult<void>>('/v1/profile/avatar');
  }

  async getPrivacySettings(): Promise<ApiResult<any>> {
    return apiClient.get<ApiResult<any>>('/v1/profile/privacy');
  }

  async updatePrivacySettings(request: any): Promise<ApiResult<void>> {
    return apiClient.put<ApiResult<void>>('/v1/profile/privacy', request);
  }

  async deactivateAccount(request: { reason: string }): Promise<ApiResult<void>> {
    return apiClient.post<ApiResult<void>>('/v1/profile/deactivate', request);
  }

  async deleteAccount(request: { password: string }): Promise<ApiResult<void>> {
    return apiClient.delete<ApiResult<void>>('/v1/profile/delete', request);
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
        try {
          this.currentUser = JSON.parse(userJson);
          if (!this.currentUser || !Array.isArray(this.currentUser.roles)) {
            // throw new Error('Invalid user data: missing roles');
            // Be more lenient or handle role-less users
          }
          this.notifyListeners();
        } catch (e) {
          console.error("Failed to parse stored user", e);
          this.clearAuthData();
        }
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