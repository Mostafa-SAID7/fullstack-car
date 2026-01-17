import { httpClient } from '../api/HttpClient';
import type {
  NotificationPreferenceDto,
  UpdatePreferencesRequest,
  RegisterDeviceRequest,
  DeviceTokensResponse
} from '../../types/notification';

/**
 * Notification Preference Service
 * Manages user notification preferences and device tokens
 */
export class NotificationPreferenceService {
  private readonly baseUrl = '/v1/notifications/preferences';

  /**
   * Get all notification preferences for current user
   */
  async getPreferences(): Promise<NotificationPreferenceDto[]> {
    const response = await httpClient.get<NotificationPreferenceDto[]>(this.baseUrl);
    return response.data!;
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: NotificationPreferenceDto[]): Promise<void> {
    const request: UpdatePreferencesRequest = { preferences };
    await httpClient.put(this.baseUrl, request);
  }

  /**
   * Register device token for push notifications
   */
  async registerDevice(deviceToken: string, platform: 'iOS' | 'Android' | 'Web'): Promise<void> {
    const request: RegisterDeviceRequest = { deviceToken, platform };
    await httpClient.post(`${this.baseUrl}/device`, request);
  }

  /**
   * Unregister device token
   */
  async unregisterDevice(deviceToken: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/device/${encodeURIComponent(deviceToken)}`);
  }

  /**
   * Get all registered device tokens
   */
  async getDevices(): Promise<string[]> {
    const response = await httpClient.get<DeviceTokensResponse>(`${this.baseUrl}/devices`);
    return response.data!.tokens;
  }
}

// Export singleton instance
export const notificationPreferenceService = new NotificationPreferenceService();

// Default export
export default notificationPreferenceService;
