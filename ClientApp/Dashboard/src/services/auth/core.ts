import { apiClient } from '../api';
import type { LoginRequest, RegisterRequest } from '../../types/auth';
import { API_ENDPOINTS } from '../../config/api';

export class AuthCoreService {
  async login(request: LoginRequest) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, request);
    return response;
  }

  async register(request: RegisterRequest) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, request);
    return response;
  }

  async logout() {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});
    return response;
  }

  async refreshToken() {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {});
    return response;
  }

  async verifyToken(_token: string): Promise<boolean> {
    // Mock token verification
    return true;
  }
}



