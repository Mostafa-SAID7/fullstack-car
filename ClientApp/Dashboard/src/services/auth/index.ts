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
        // BYPASS: Auto-login removed to prevent infinite loop with real backend verification
        /*
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
        */
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
    }
  }

  private _saveAuth(user: UserInfo): void {
    console.log('[AuthService] _saveAuth called with user:', user.name);
    this.currentUser = user;
    localStorage.setItem('auth_user', JSON.stringify(user));
    console.log('[AuthService] User saved to localStorage and currentUser updated');
    this.notifyListeners();
    console.log('[AuthService] Listeners notified');
  }

  private _clearAuth(): void {
    console.log('[AuthService] _clearAuth called');
    this.currentUser = null;
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refreshToken');
    apiClient.clearAuthToken();
    this.notifyListeners();
    console.log('[AuthService] Auth state cleared completely');
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  // Authentication Methods
  async login(credentials: any): Promise<any> {
    console.log('[AuthService] Login attempt with credentials:', { email: credentials.email, rememberMe: credentials.rememberMe });
    
    const response = await this.coreService.login(credentials);
    console.log('[AuthService] Login response raw:', response);

    // HttpClient wraps backend response: { succeeded: true, data: backendResponse }
    // Backend returns: { succeeded: true, data: AuthResponse, errors: [] }
    if (response.succeeded && response.data && response.data.succeeded) {
      const authData = response.data.data; // The actual AuthResponse object
      
      let token = null;
      let userInfo = null;

      // 1. Handle Token (lowercase property name from backend)
      if (authData.token) {
        token = authData.token;
        console.log('[AuthService] Token received:', token.substring(0, 50) + '...');
        localStorage.setItem('auth_token', token);
        apiClient.setAuthToken(token);
      }

      // 2. Handle User (lowercase property name from backend)
      if (authData.user) {
        console.log('[AuthService] User data received:', authData.user);
        
        // Map backend UserDto to frontend UserInfo (handle lowercase property names)
        userInfo = {
          id: authData.user.id,
          firstName: authData.user.firstName,
          lastName: authData.user.lastName,
          email: authData.user.email,
          name: `${authData.user.firstName} ${authData.user.lastName}`,
          roles: authData.user.roles || ['User'],
          isActive: authData.user.isActive,
          isEmailConfirmed: authData.user.isEmailConfirmed,
          createdAt: authData.user.createdAt
        };
        
        console.log('[AuthService] Mapped user info:', userInfo);
      } else if (token) {
        // Fallback: If we have a token but no user, try to fetch the profile
        console.warn('[AuthService] Token received but user missing. Attempting to fetch profile...');
        try {
          const profileResult = await this.profileService.getProfile();
          if (profileResult.succeeded && profileResult.data) {
            console.log('[AuthService] Profile fetched successfully:', profileResult.data);

            // Map ProfileResponse to UserInfo
            userInfo = {
              id: profileResult.data.id,
              firstName: profileResult.data.firstName,
              lastName: profileResult.data.lastName,
              email: profileResult.data.email,
              name: `${profileResult.data.firstName} ${profileResult.data.lastName}`,
              roles: ['User'], // fallback roles
              isActive: true,
              isEmailConfirmed: profileResult.data.isEmailConfirmed || true,
              createdAt: profileResult.data.createdAt || new Date().toISOString()
            };
          } else {
            console.error('[AuthService] Failed to fetch profile after login.');
          }
        } catch (err) {
          console.error('[AuthService] Error fetching profile fallback:', err);
        }
      }

      // 3. Only save auth state if we have both token and user
      if (token && userInfo) {
        console.log('[AuthService] Saving complete auth state:', { 
          hasToken: !!token, 
          hasUser: !!userInfo,
          userName: userInfo.name 
        });
        
        // Save auth state
        this._saveAuth(userInfo);
        
        // Small delay to ensure localStorage is written
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Verify the state was saved correctly
        const isAuthAfterSave = this.isAuthenticated();
        const currentUserAfterSave = this.getCurrentUser();
        
        console.log('[AuthService] Authentication state after save:', {
          isAuthenticated: isAuthAfterSave,
          hasCurrentUser: !!currentUserAfterSave,
          currentUserName: currentUserAfterSave?.name
        });
        
        if (!isAuthAfterSave || !currentUserAfterSave) {
          console.error('[AuthService] Authentication state verification failed!');
          console.error('[AuthService] Debug info:', {
            currentUser: this.currentUser,
            tokenInStorage: !!localStorage.getItem('auth_token'),
            userInStorage: !!localStorage.getItem('auth_user')
          });
          
          // Clear potentially corrupted state
          this._clearAuth();
          return {
            succeeded: false,
            message: 'Authentication state error. Please try again.',
            errors: ['Failed to establish authentication state']
          };
        }

        // Return success response in expected format
        return {
          succeeded: true,
          message: authData.message || 'Login successful',
          data: {
            token: token,
            user: userInfo
          }
        };
      } else {
        console.error('[AuthService] Incomplete authentication data:', { hasToken: !!token, hasUser: !!userInfo });
        return {
          succeeded: false,
          message: 'Incomplete authentication data received.',
          errors: ['Missing token or user data']
        };
      }
    } else {
      console.error('[AuthService] Login failed:', response);
      return {
        succeeded: false,
        message: response.message || response.data?.message || 'Login failed',
        errors: response.errors || response.data?.errors || ['Login failed']
      };
    }
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
    const hasUser = !!this.currentUser;
    const hasToken = !!localStorage.getItem('auth_token');
    const result = hasUser && hasToken;
    
    console.log('[AuthService] isAuthenticated check:', {
      hasUser,
      hasToken,
      result,
      currentUser: this.currentUser?.name
    });
    
    return result;
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
