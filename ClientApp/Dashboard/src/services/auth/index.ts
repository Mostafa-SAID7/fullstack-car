// Auth Service - Main Export (composed from sub-services)

import { AuthCoreService } from './core';
import { AuthProfileService } from './profile';
import { AuthSecurityService } from './security';
// import { AuthAccountService } from './account';
import type { UserInfo } from '../../types/auth';

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
      if (stored) {
        this.currentUser = JSON.parse(stored);
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
    if (response.succeeded && response.data?.user) {
      this._saveAuth(response.data.user);
    }
    return response;
  }

  async register(userData: any): Promise<any> {
    return this.coreService.register(userData);
  }

  async logout(): Promise<void> {
    await this.coreService.logout();
    this._clearAuth();
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
