import { apiClient } from '../api';
import type { LoginRequest, RegisterRequest } from '../../types/auth';
import { API_ENDPOINTS } from '../../config/api';

export class AuthCoreService {
  async login(request: LoginRequest) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, request);
    return response as any;
  }

  async register(request: RegisterRequest) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, request);
    return response as any;
  }

  async logout() {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});
    return response as any;
  }

  async refreshToken() {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {});
    return response as any;
  }

  async verifyToken(_token: string): Promise<boolean> {
    // Mock token verification
    return true;
  }
}







