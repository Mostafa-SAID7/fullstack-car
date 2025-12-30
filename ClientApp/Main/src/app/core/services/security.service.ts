import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  UserSessionResponse, 
  TwoFactorSetupResponse, 
  SecurityLogResponse 
} from '../models/auth.model';
import { Result } from '../models/result.model';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private readonly apiUrl = `${environment.apiUrl}/v1/security`;

  constructor(private http: HttpClient) {}

  // Two-Factor Authentication
  enableTwoFactor(): Observable<Result<TwoFactorSetupResponse>> {
    return this.http.post<Result<TwoFactorSetupResponse>>(`${this.apiUrl}/2fa/enable`, {});
  }

  disableTwoFactor(code: string): Observable<Result<void>> {
    return this.http.post<Result<void>>(`${this.apiUrl}/2fa/disable`, { code });
  }

  getTwoFactorStatus(): Observable<Result<{ isEnabled: boolean }>> {
    return this.http.get<Result<{ isEnabled: boolean }>>(`${this.apiUrl}/2fa/status`);
  }

  generateRecoveryCodes(): Observable<Result<{ recoveryCodes: string[] }>> {
    return this.http.post<Result<{ recoveryCodes: string[] }>>(`${this.apiUrl}/2fa/recovery-codes`, {});
  }

  verifyTwoFactorToken(token: string): Observable<Result<{ isValid: boolean }>> {
    return this.http.post<Result<{ isValid: boolean }>>(`${this.apiUrl}/2fa/verify`, token);
  }

  // Session Management
  getActiveSessions(): Observable<Result<UserSessionResponse[]>> {
    return this.http.get<Result<UserSessionResponse[]>>(`${this.apiUrl}/sessions`);
  }

  revokeSession(sessionId: string): Observable<Result<void>> {
    return this.http.delete<Result<void>>(`${this.apiUrl}/sessions/${sessionId}`);
  }

  revokeAllSessions(): Observable<Result<void>> {
    return this.http.delete<Result<void>>(`${this.apiUrl}/sessions`);
  }

  revokeOtherSessions(currentSessionId: string): Observable<Result<void>> {
    return this.http.delete<Result<void>>(`${this.apiUrl}/sessions/others`, { body: currentSessionId });
  }

  // Security Logs
  getSecurityLogs(page: number = 1, pageSize: number = 20): Observable<Result<SecurityLogResponse[]>> {
    return this.http.get<Result<SecurityLogResponse[]>>(`${this.apiUrl}/logs`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  // Account Lockout (Admin only)
  lockAccount(userId: string, lockoutDuration: number, reason: string): Observable<Result<void>> {
    return this.http.post<Result<void>>(`${this.apiUrl}/lock/${userId}`, {
      lockoutDuration,
      reason
    });
  }

  unlockAccount(userId: string): Observable<Result<void>> {
    return this.http.post<Result<void>>(`${this.apiUrl}/unlock/${userId}`, {});
  }

  isAccountLocked(): Observable<Result<{ isLocked: boolean }>> {
    return this.http.get<Result<{ isLocked: boolean }>>(`${this.apiUrl}/locked`);
  }
}