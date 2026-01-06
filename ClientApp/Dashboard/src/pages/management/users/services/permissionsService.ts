import { apiClient } from '../../../../services/api';
import type { Permission } from '../types/permission';

export class PermissionsService {
  private readonly baseUrl = '/api/v3.0/admin/users/permissions';

  async getPermissions(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
    isSystemPermission?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(`${this.baseUrl}?${searchParams.toString()}`);
    return response.data;
  }

  async getPermissionByName(name: string): Promise<Permission> {
    const response = await apiClient.get(`${this.baseUrl}/${name}`);
    return response.data;
  }

  async createPermission(permission: Omit<Permission, 'createdAt' | 'updatedAt'>) {
    const response = await apiClient.post(this.baseUrl, permission);
    return response.data;
  }

  async updatePermission(name: string, permission: Partial<Permission>) {
    const response = await apiClient.put(`${this.baseUrl}/${name}`, permission);
    return response.data;
  }

  async deletePermission(name: string) {
    const response = await apiClient.delete(`${this.baseUrl}/${name}`);
    return response.data;
  }
}

export const permissionsService = new PermissionsService();