import { apiClient, type ApiResult } from '../api';
import type { Result } from '../../types/api';
import type {
  UpdateProfileRequest,
  ProfileDto,
  UploadProfileImageResponse
} from '../../types/auth';
import { API_ENDPOINTS } from '../../config/api';

/**
 * Profile Service
 * Handles user profile management operations
 */
export class ProfileService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResult<Result<ProfileDto>>> {
    const response = await apiClient.get<Result<ProfileDto>>(API_ENDPOINTS.PROFILE.BASE);
    return response;
  }

  /**
   * Update user profile
   */
  async updateProfile(request: UpdateProfileRequest): Promise<ApiResult<Result<ProfileDto>>> {
    const response = await apiClient.put<Result<ProfileDto>>(API_ENDPOINTS.PROFILE.BASE, request);
    return response;
  }

  /**
   * Upload profile image
   */
  async uploadProfileImage(file: File): Promise<ApiResult<Result<UploadProfileImageResponse>>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<Result<UploadProfileImageResponse>>(
      API_ENDPOINTS.PROFILE.AVATAR,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response;
  }

  /**
   * Delete profile image
   */
  async deleteProfileImage(): Promise<ApiResult<Result<void>>> {
    const response = await apiClient.delete<Result<void>>(API_ENDPOINTS.PROFILE.AVATAR);
    return response;
  }

  /**
   * Get privacy settings
   */
  async getPrivacySettings(): Promise<ApiResult<Result<any>>> {
    const response = await apiClient.get<Result<any>>(API_ENDPOINTS.PROFILE.PRIVACY);
    return response;
  }

  /**
   * Update privacy settings
   */
  async updatePrivacySettings(request: any): Promise<ApiResult<Result<void>>> {
    const response = await apiClient.put<Result<void>>(API_ENDPOINTS.PROFILE.PRIVACY, request);
    return response;
  }

  /**
   * Deactivate account
   */
  async deactivateAccount(request: { password: string; reason?: string }): Promise<ApiResult<Result<void>>> {
    const response = await apiClient.post<Result<void>>(API_ENDPOINTS.PROFILE.DEACTIVATE, request);
    return response;
  }

  /**
   * Delete account permanently
   */
  async deleteAccount(request: { password: string; confirmation: string }): Promise<ApiResult<Result<void>>> {
    const response = await apiClient.delete<Result<void>>(API_ENDPOINTS.PROFILE.DELETE, { data: request });
    return response;
  }

  /**
   * Change user password
   */
  async changePassword(request: any): Promise<ApiResult<Result<void>>> {
    const response = await apiClient.post<Result<void>>(API_ENDPOINTS.PASSWORD.CHANGE, request);
    return response;
  }

  /**
   * Forgot password request
   */
  async forgotPassword(request: any): Promise<ApiResult<Result<void>>> {
    const response = await apiClient.post<Result<void>>(API_ENDPOINTS.PASSWORD.FORGOT, request);
    return response;
  }

  /**
   * Reset password request
   */
  async resetPassword(request: any): Promise<ApiResult<Result<void>>> {
    const response = await apiClient.post<Result<void>>(API_ENDPOINTS.PASSWORD.RESET, request);
    return response;
  }
}

/**
 * @deprecated Use ProfileService instead
 */
export class AuthProfileService extends ProfileService { }

export const profileService = new ProfileService();
