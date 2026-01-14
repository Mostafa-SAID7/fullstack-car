// Auth Service - Profile Management

import { apiClient, type ApiResult } from '../api';
import type { UpdateProfileRequest, ChangePasswordRequest, ProfileResponse } from '../../types/auth';
import { API_ENDPOINTS } from '../../config/api';

export class AuthProfileService {
  async updateProfile(request: UpdateProfileRequest) {
    const response = await apiClient.put(API_ENDPOINTS.PROFILE.BASE, request);
    return response as any;
  }

  async changePassword(request: ChangePasswordRequest) {
    const response = await apiClient.post(API_ENDPOINTS.PASSWORD.CHANGE, request);
    return response as any;
  }

  async getProfile(): Promise<ApiResult<ProfileResponse>> {
    const response = await apiClient.get<ProfileResponse>(API_ENDPOINTS.PROFILE.BASE);
    return response as any;
  }

  async confirmEmail(request: { userId: string; token: string }) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.CONFIRM_EMAIL, request);
    return response as any;
  }

  async forgotPassword(request: { email: string }) {
    const response = await apiClient.post(API_ENDPOINTS.PASSWORD.FORGOT, request);
    return response as any;
  }

  async resetPassword(request: { email: string; token: string; newPassword: string; confirmPassword: string }) {
    const response = await apiClient.post(API_ENDPOINTS.PASSWORD.RESET, request);
    return response as any;
  }
}






