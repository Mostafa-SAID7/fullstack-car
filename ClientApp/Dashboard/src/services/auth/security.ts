import { apiClient } from '../api';
import type { ApiResult } from '../api';
import type {
  SessionDto,
  SessionListResponse,
  SecurityLogDto,
  SecurityLogListResponse,
  MFASetupResponse,
  MFAVerifyRequest
} from '../../types/auth';

/**
 * Security Service
 * Handles security, sessions, and MFA operations
 */
export class SecurityService {
  /**
   * Get active user sessions
   */
  async getSessions(): Promise<ApiResult<SessionListResponse>> {
    const response = await apiClient.get<SessionListResponse>('/v1/security/sessions');
    return response;
  }

  /**
   * Get sessions (alias for backward compatibility)
   */
  async getUserSessions(): Promise<ApiResult<SessionListResponse>> {
    return this.getSessions();
  }

  /**
   * Terminate specific session
   */
  async terminateSession(sessionId: string): Promise<ApiResult<void>> {
    const response = await apiClient.delete<void>(`/v1/security/sessions/${sessionId}`);
    return response;
  }

  /**
   * Terminate all sessions
   */
  async terminateAllSessions(): Promise<ApiResult<void>> {
    const response = await apiClient.delete<void>('/v1/security/sessions');
    return response;
  }

  /**
   * Terminate all other sessions (except current)
   */
  async terminateOtherSessions(currentSessionId: string): Promise<ApiResult<void>> {
    const response = await apiClient.delete<void>('/v1/security/sessions/others', {
      data: currentSessionId
    });
    return response;
  }

  /**
   * Get security logs with pagination
   */
  async getSecurityLogs(page: number = 1, pageSize: number = 20): Promise<ApiResult<SecurityLogListResponse>> {
    const response = await apiClient.get<SecurityLogListResponse>('/v1/security/logs', {
      params: { page, pageSize }
    });
    return response;
  }

  /**
   * Enable MFA (Multi-Factor Authentication)
   */
  async enableMFA(): Promise<ApiResult<MFASetupResponse>> {
    const response = await apiClient.post<MFASetupResponse>('/v1/security/mfa/enable', {});
    return response;
  }

  /**
   * Disable MFA
   */
  async disableMFA(password: string, verificationCode: string): Promise<ApiResult<void>> {
    const response = await apiClient.post<void>('/v1/security/mfa/disable', {
      password,
      verificationCode
    });
    return response;
  }

  /**
   * Verify MFA code
   */
  async verifyMFA(request: MFAVerifyRequest): Promise<ApiResult<{ success: boolean }>> {
    const response = await apiClient.post<{ success: boolean }>('/v1/security/mfa/verify', request);
    return response;
  }

  /**
   * Get MFA status
   */
  async getMFAStatus(): Promise<ApiResult<{ isEnabled: boolean }>> {
    const response = await apiClient.get<{ isEnabled: boolean }>('/v1/security/mfa/status');
    return response;
  }

  /**
   * Enable Two-Factor Authentication (alias for MFA)
   */
  async enableTwoFactor(): Promise<ApiResult<MFASetupResponse>> {
    return this.enableMFA();
  }

  /**
   * Get Two-Factor status (alias for MFA)
   */
  async getTwoFactorStatus(): Promise<ApiResult<{ isEnabled: boolean }>> {
    return this.getMFAStatus();
  }

  /**
   * Toggle Two-Factor (alias for MFA)
   */
  async toggleTwoFactor(enabled: boolean, password?: string, code?: string): Promise<ApiResult<any>> {
    if (enabled) {
      return this.enableMFA();
    } else {
      if (!password || !code) {
        throw new Error('Password and verification code required to disable MFA');
      }
      return this.disableMFA(password, code);
    }
  }

  /**
   * Generate recovery codes
   */
  async generateRecoveryCodes(): Promise<ApiResult<string[]>> {
    const response = await apiClient.post<string[]>('/v1/security/2fa/recovery-codes', {});
    return response;
  }

  /**
   * Check if account is locked
   */
  async isAccountLocked(): Promise<ApiResult<{ isLocked: boolean }>> {
    const response = await apiClient.get<{ isLocked: boolean }>('/v1/security/locked');
    return response;
  }
}

/**
 * @deprecated Use SecurityService instead
 */
export class AuthSecurityService extends SecurityService { }

export const securityService = new SecurityService();
