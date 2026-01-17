import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import type {
  NotificationPreferenceDto,
  UpdatePreferencesRequest,
  RegisterDeviceRequest,
  DeviceTokensResponse
} from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationPreferenceService {
  private readonly apiUrl = `${environment.apiUrl}/v1/notifications/preferences`;

  constructor(private http: HttpClient) {}

  /**
   * Get all notification preferences for current user
   */
  getPreferences(): Observable<NotificationPreferenceDto[]> {
    return this.http.get<NotificationPreferenceDto[]>(this.apiUrl);
  }

  /**
   * Update notification preferences
   */
  updatePreferences(preferences: NotificationPreferenceDto[]): Observable<void> {
    const request: UpdatePreferencesRequest = { preferences };
    return this.http.put<void>(this.apiUrl, request);
  }

  /**
   * Register device token for push notifications
   */
  registerDevice(deviceToken: string, platform: 'iOS' | 'Android' | 'Web'): Observable<void> {
    const request: RegisterDeviceRequest = { deviceToken, platform };
    return this.http.post<void>(`${this.apiUrl}/device`, request);
  }

  /**
   * Unregister device token
   */
  unregisterDevice(deviceToken: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/device/${encodeURIComponent(deviceToken)}`);
  }

  /**
   * Get all registered device tokens
   */
  getDevices(): Observable<string[]> {
    return this.http.get<DeviceTokensResponse>(`${this.apiUrl}/devices`).pipe(
      map(response => response.tokens)
    );
  }
}
