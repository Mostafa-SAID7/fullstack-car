// Auth Service - Profile Management

import { apiClient, type ApiResult } from '../api';
import type { UpdateProfileRequest, ChangePasswordRequest, ProfileResponse } from '../../types/auth';

export class AuthProfileService {
  async updateProfile(request: UpdateProfileRequest) {
    const response = await apiClient.put('/auth/profile', request);
    return response;
  }

  async changePassword(request: ChangePasswordRequest) {
    const response = await apiClient.put('/auth/change-password', request);
    return response;
  }

  async getProfile(): Promise<ApiResult<ProfileResponse>> {
    const response = await apiClient.get<ProfileResponse>('/auth/profile');
    return response;
  }

  async confirmEmail(request: { userId: string; token: string }) {
    const response = await apiClient.post('/auth/confirm-email', request);
    return response;
  }

  async forgotPassword(request: { email: string }) {
    const response = await apiClient.post('/auth/forgot-password', request);
    return response;
  }

  async resetPassword(request: { email: string; token: string; newPassword: string; confirmPassword: string }) {
    const response = await apiClient.post('/auth/reset-password', request);
    return response;
  }
}



