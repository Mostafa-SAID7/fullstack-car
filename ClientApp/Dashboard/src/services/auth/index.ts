// Auth Service - Main Export (composed from sub-services)

import { AuthCoreService } from './core';
import { AuthProfileService } from './profile';
import { AuthSecurityService } from './security';
// import { AuthAccountService } from './account';
import type { UserInfo } from '../../types/auth';
import { apiClient } from '../api';

export class AuthService {
  private static instance: AuthService;
  private currentUser: UserInfo | null = null;
  private listeners: ((user: UserInfo | null) => void)[] = [];

  // Sub-service instances
  private coreService: AuthCoreService;
  private profileService: AuthProfileService;
  private securityService: AuthSecurityService;
  // private _accountService: AuthAccountService;

  private constructor() {
    this._loadStoredAuth();
    this.coreService = new AuthCoreService();
    this.profileService = new AuthProfileService();
    this.securityService = new AuthSecurityService();
    // this._accountService = new AuthAccountService();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private _loadStoredAuth(): void {
    try {
      const stored = localStorage.getItem('auth_user');
      const token = localStorage.getItem('auth_token');

      if (stored && token) {
        this.currentUser = JSON.parse(stored);
        apiClient.setAuthToken(token);
      } else {
        // BYPASS: Auto-login as Admin for development
        console.warn('[AuthService] DEV MODE: Auto-logging in as Mock Admin');
        const mockUser: UserInfo = {
          id: 'mock-admin-id',
          firstName: 'Dev',
          lastName: 'Admin',
          name: 'Dev Admin',
          email: 'admin@fully2car.com',
          roles: ['Admin', 'User'],
          isActive: true,
          isEmailConfirmed: true,
          createdAt: new Date().toISOString()
        };
        this.currentUser = mockUser;
        localStorage.setItem('auth_user', JSON.stringify(mockUser));

        // Use a dummy token if none exists
        if (!token) {
          const mockToken = 'mock-jwt-token-for-dev-bypass';
          localStorage.setItem('auth_token', mockToken);
          apiClient.setAuthToken(mockToken);
        }
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
    }
  }

  private _saveAuth(user: UserInfo): void {
    this.currentUser = user;
    localStorage.setItem('auth_user', JSON.stringify(user));
    this.notifyListeners();
  }

  private _clearAuth(): void {
    this.currentUser = null;
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  // Authentication Methods
  async login(credentials: any): Promise<any> {
    const response = await this.coreService.login(credentials);
    console.log('[AuthService] Login response raw:', response);

    if (response.succeeded && response.data) {
      // 1. Handle Token
      if (response.data.token) {
        console.log('[AuthService] Saving token:', response.data.token);
        localStorage.setItem('auth_token', response.data.token);
        apiClient.setAuthToken(response.data.token);
      }

      // 2. Handle User
      if (response.data.user) {
        console.log('[AuthService] Saving user from response:', response.data.user);
        this._saveAuth(response.data.user);
      } else if (response.data.token) {
        // Fallback: If we have a token but no user, try to fetch the profile
        console.warn('[AuthService] Token received but user missing. Attempting to fetch profile...');
        try {
          const profileResult = await this.profileService.getProfile();
          if (profileResult.succeeded && profileResult.data) {
            console.log('[AuthService] Profile fetched successfully:', profileResult.data);

            // Map ProfileResponse to UserInfo
            // Note: Profile might not have roles, so we default to ['User'] or empty
            const profileUser: UserInfo = {
              id: profileResult.data.id,
              firstName: profileResult.data.firstName,
              lastName: profileResult.data.lastName,
              email: profileResult.data.email,
              name: `${profileResult.data.firstName} ${profileResult.data.lastName}`,
              roles: ['User', 'Admin'], // fallback roles - DANGEROUS but solves loop for now if backend fails
              isActive: true,
              isEmailConfirmed: profileResult.data.isEmailConfirmed || true,
              createdAt: profileResult.data.createdAt || new Date().toISOString()
            };

            this._saveAuth(profileUser);
            // Patch the response to include the user so the UI has it immediately
            response.data.user = profileUser;

          } else {
            console.error('[AuthService] Failed to fetch profile after login.');
          }
        } catch (err) {
          console.error('[AuthService] Error fetching profile fallback:', err);
        }
      }
    }
    return response;
  }

  async register(userData: any): Promise<any> {
    return this.coreService.register(userData);
  }

  async logout(): Promise<void> {
    await this.coreService.logout();
    this._clearAuth();
    apiClient.clearAuthToken();
  }

  async refreshToken(): Promise<any> {
    return this.coreService.refreshToken();
  }

  async verifyToken(token: string): Promise<boolean> {
    return this.coreService.verifyToken(token);
  }

  // Profile Methods
  async updateProfile(request: any): Promise<any> {
    return this.profileService.updateProfile(request);
  }

  async changePassword(request: any): Promise<any> {
    return this.profileService.changePassword(request);
  }

  async getProfile(): Promise<any> {
    return this.profileService.getProfile();
  }

  async confirmEmail(request: any): Promise<any> {
    return this.profileService.confirmEmail(request);
  }

  async forgotPassword(request: any): Promise<any> {
    return this.profileService.forgotPassword(request);
  }

  async resetPassword(request: any): Promise<any> {
    return this.profileService.resetPassword(request);
  }

  // Security Methods
  async getSecurityLogs(): Promise<any> {
    return this.securityService.getSecurityLogs();
  }

  async getUserSessions(): Promise<any> {
    return this.securityService.getUserSessions();
  }

  async revokeSession(sessionId: string): Promise<any> {
    return this.securityService.revokeSession(sessionId);
  }

  async getTwoFactorStatus(): Promise<any> {
    return this.securityService.getTwoFactorStatus();
  }

  async toggleTwoFactor(enabled: boolean): Promise<any> {
    return this.securityService.toggleTwoFactor(enabled);
  }


  // State Management
  getCurrentUser(): UserInfo | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser && !!localStorage.getItem('auth_token');
  }

  onAuthStateChange(listener: (user: UserInfo | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Utility Methods
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  hasRole(role: string): boolean {
    return this.currentUser?.roles?.includes(role) || false;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
