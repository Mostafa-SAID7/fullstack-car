// Auth Service - Account Management

import { apiClient } from '../api';

export class AuthAccountService {
  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post('/auth/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response as any;
  }

  async deleteAvatar() {
    const response = await apiClient.delete('/auth/avatar');
    return response as any;
  }

  async getPrivacySettings() {
    // This would need to be implemented in the auth service
    return {
      isEmailPublic: false,
      isPhonePublic: false,
      allowDirectMessages: true,
      showOnlineStatus: true
    };
  }

  async updatePrivacySettings(settings: any) {
    // This would need to be implemented in the auth service
    const response = await apiClient.put('/auth/privacy-settings', settings);
    return response as any;
  }

  async deactivateAccount(reason?: string) {
    const response = await apiClient.post('/auth/deactivate', { reason });
    return response as any;
  }

  async deleteAccount(password?: string) {
    const response = await apiClient.post('/auth/delete', { password });
    return response as any;
  }
}





