import { apiClient, type ApiResult } from '../api';
import type { Result } from '../../types/api';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  UserDto
} from '../../types/auth';
import { API_ENDPOINTS } from '../../config/api';

/**
 * Auth Core Service
 * Handles core authentication operations
 */
export class AuthCoreService {
  /**
   * Login with email and password
   */
  async login(request: LoginRequest): Promise<ApiResult<Result<LoginResponse>>> {
    const response = await apiClient.post<Result<LoginResponse>>(API_ENDPOINTS.AUTH.LOGIN, request);
    return response;
  }

  /**
   * Register new user account
   */
  async register(request: RegisterRequest): Promise<ApiResult<Result<any>>> {
    const response = await apiClient.post<Result<any>>(API_ENDPOINTS.AUTH.REGISTER, request);
    return response;
  }

  /**
   * Logout current user
   */
  async logout(): Promise<ApiResult<Result<void>>> {
    const response = await apiClient.post<Result<void>>(API_ENDPOINTS.AUTH.LOGOUT, {});
    return response;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    const token = localStorage.getItem('auth_token');

    if (!refreshToken || !token) {
      throw new Error('No refresh token available');
    }

    const request: RefreshTokenRequest = {
      token,
      refreshToken
    };

    const response = await apiClient.post<Result<LoginResponse>>(API_ENDPOINTS.AUTH.REFRESH, request);

    // Update stored tokens if refresh successful
    const authData = response.data?.data;
    if (response.succeeded && response.data?.succeeded && authData?.token) {
      localStorage.setItem('auth_token', authData.token);
      if (authData.refreshToken) {
        localStorage.setItem('refresh_token', authData.refreshToken);
      }
      apiClient.setAuthToken(authData.token);
    }

    return response;
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<ApiResult<Result<any>>> {
    const response = await apiClient.get<Result<any>>('/v1/auth/me');
    return response;
  }

  /**
   * Verify token validity
   */
  async verifyToken(token: string): Promise<boolean> {
    try {
      // Set the token temporarily
      const originalToken = apiClient.getAuthToken();
      apiClient.setAuthToken(token);

      // Try to get current user
      const response = await this.getCurrentUser();

      // Restore original token
      if (originalToken) {
        apiClient.setAuthToken(originalToken);
      }

      return response.succeeded;
    } catch (error) {
      return false;
    }
  }

  /**
   * Confirm email address
   */
  async confirmEmail(userId: string, token: string): Promise<ApiResult<Result<any>>> {
    const response = await apiClient.post<Result<any>>(API_ENDPOINTS.AUTH.CONFIRM_EMAIL, {
      userId,
      token
    });
    return response;
  }

  /**
   * Resend email confirmation
   */
  async resendEmailConfirmation(email: string): Promise<ApiResult<Result<any>>> {
    const response = await apiClient.post<Result<any>>(API_ENDPOINTS.AUTH.RESEND_CONFIRMATION, email);
    return response;
  }

  /**
   * Revoke specific token
   */
  async revokeToken(token: string): Promise<ApiResult<Result<any>>> {
    const response = await apiClient.post<Result<any>>(API_ENDPOINTS.AUTH.REVOKE_TOKEN, token);
    return response;
  }

  /**
   * Store authentication tokens
   */
  storeTokens(token: string, refreshToken: string): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    apiClient.setAuthToken(token);
  }

  /**
   * Clear authentication tokens
   */
  clearTokens(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    apiClient.clearAuthToken();
  }

  /**
   * Get stored access token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
}
