// Auth Service - Security Management

import { apiClient } from '../api';
import type { ApiResult } from '../api';
import type { SecurityLogResponse, UserSessionResponse } from '../../types/auth';

export class AuthSecurityService {
  async getSecurityLogs(): Promise<ApiResult<SecurityLogResponse[]>> {
    const response = await apiClient.get('/auth/security-logs');
    return response as any;
  }

  async getUserSessions(): Promise<ApiResult<UserSessionResponse[]>> {
    const response = await apiClient.get('/auth/sessions');
    return response as any;
  }

  async revokeSession(sessionId: string): Promise<ApiResult<any>> {
    const response = await apiClient.delete(`/auth/sessions/${sessionId}`);
    return response as any;
  }

  // 2FA methods (placeholder implementations)
  async getTwoFactorStatus() {
    // This would need to be implemented in the auth service
    return { enabled: false };
  }

  async toggleTwoFactor(enabled: boolean): Promise<ApiResult<any>> {
    // This would need to be implemented in the auth service
    console.log('Toggling 2FA:', enabled);
    throw new Error('Two-factor authentication not implemented yet');
  }
}





