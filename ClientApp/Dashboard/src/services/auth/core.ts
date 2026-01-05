// Auth Service - Core Authentication

import { apiClient } from '../api';
import type { LoginRequest, RegisterRequest } from '../../types/auth';

export class AuthCoreService {
  async login(request: LoginRequest) {
    const response = await apiClient.post('/auth/login', request);
    return response;
  }

  async register(request: RegisterRequest) {
    const response = await apiClient.post('/auth/register', request);
    return response;
  }

  async logout() {
    const response = await apiClient.post('/auth/logout', {});
    return response;
  }

  async refreshToken() {
    const response = await apiClient.post('/auth/refresh-token', {});
    return response;
  }

  async verifyToken(_token: string): Promise<boolean> {
    // Mock token verification
    return true;
  }
}



