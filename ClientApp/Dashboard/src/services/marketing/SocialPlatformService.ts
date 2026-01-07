import { ApiService } from '../api/ApiService';
import type { ApiResult } from '../api';
import type { SocialPlatform, PlatformAnalytics } from './types';

export class SocialPlatformService extends ApiService {
  private readonly baseUrl = '/marketing/platforms';

  async getPlatforms(): Promise<ApiResult<SocialPlatform[]>> {
    return this.get<SocialPlatform[]>(this.baseUrl);
  }

  async getPlatform(id: string): Promise<ApiResult<SocialPlatform>> {
    return this.get<SocialPlatform>(`${this.baseUrl}/${id}`);
  }

  async getPlatformAnalytics(id: string, params?: {
    startDate?: string;
    endDate?: string;
    timeRange?: string;
  }): Promise<ApiResult<PlatformAnalytics>> {
    return this.get<PlatformAnalytics>(`${this.baseUrl}/${id}/analytics`, { params });
  }

  async connectPlatform(platformData: {
    name: string;
    accessToken: string;
    refreshToken?: string;
    expiresAt?: string;
  }): Promise<ApiResult<SocialPlatform>> {
    return this.post<SocialPlatform>(`${this.baseUrl}/connect`, platformData);
  }

  async disconnectPlatform(id: string): Promise<ApiResult<boolean>> {
    return this.delete<boolean>(`${this.baseUrl}/${id}/disconnect`);
  }

  async refreshPlatformToken(id: string): Promise<ApiResult<SocialPlatform>> {
    return this.patch<SocialPlatform>(`${this.baseUrl}/${id}/refresh-token`);
  }

  async syncPlatformData(id: string): Promise<ApiResult<SocialPlatform>> {
    return this.patch<SocialPlatform>(`${this.baseUrl}/${id}/sync`);
  }
}