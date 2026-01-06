import { apiClient } from '../../../../services/api';
import type { 
  User, 
  UserAction
} from '../types/user';
import type { 
  UserListResponse, 
  UserDetailResponse
} from '../types/responses';

export class UsersService {
  private readonly baseUrl = '/api/v3.0/admin/users';

  async getUsers(params: {
    page?: number;
    pageSize?: number;
    status?: string;
    search?: string;
    role?: string;
    joinedAfter?: string;
    joinedBefore?: string;
    isVerified?: boolean;
    sortBy?: string;
    sortDirection?: string;
  }): Promise<UserListResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`${this.baseUrl}?${searchParams.toString()}`);
    return response.data;
  }

  async getUserById(id: string): Promise<UserDetailResponse> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async searchUsers(params: {
    searchTerm: string;
    limit?: number;
    role?: string;
    isActive?: boolean;
  }): Promise<User[]> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`${this.baseUrl}/search?${searchParams.toString()}`);
    return response.data;
  }

  async suspendUser(id: string, reason: string, suspendUntil?: string, isPermanent = false): Promise<UserAction> {
    const response = await apiClient.post(`${this.baseUrl}/${id}/suspend`, {
      reason,
      suspendUntil,
      isPermanent
    });
    return response.data;
  }

  async banUser(id: string, reason: string, isPermanent = true): Promise<UserAction> {
    const response = await apiClient.post(`${this.baseUrl}/${id}/ban`, {
      reason,
      isPermanent
    });
    return response.data;
  }

  async deleteUser(id: string, reason: string, deleteAllContent = false): Promise<UserAction> {
    // For DELETE requests with body, we need to use a different approach
    const response = await apiClient.post(`${this.baseUrl}/${id}/delete`, {
      reason,
      deleteAllContent
    });
    return response.data;
  }

  async sendMessageToUser(id: string, subject: string, message: string, isUrgent = false): Promise<UserAction> {
    const response = await apiClient.post(`${this.baseUrl}/${id}/message`, {
      subject,
      message,
      isUrgent
    });
    return response.data;
  }

  async updateUserRoles(id: string, roleNames: string[]): Promise<UserAction> {
    const response = await apiClient.put(`${this.baseUrl}/${id}/roles`, {
      roleNames
    });
    return response.data;
  }

  async impersonateUser(id: string, reason: string, durationMinutes = 60): Promise<UserAction> {
    const response = await apiClient.post(`${this.baseUrl}/${id}/impersonate`, {
      reason,
      durationMinutes
    });
    return response.data;
  }
}

export const usersService = new UsersService();