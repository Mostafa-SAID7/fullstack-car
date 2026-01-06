import { apiClient } from '../../../../services/api';
import type { Role } from '../types/role';

export class RolesService {
  private readonly baseUrl = '/api/v3.0/admin/users/roles';

  async getRoles(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    isSystemRole?: boolean;
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

  async getRoleById(id: string): Promise<Role> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createRole(role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) {
    const response = await apiClient.post(this.baseUrl, role);
    return response.data;
  }

  async updateRole(id: string, role: Partial<Role>) {
    const response = await apiClient.put(`${this.baseUrl}/${id}`, role);
    return response.data;
  }

  async deleteRole(id: string) {
    const response = await apiClient.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }
}

export const rolesService = new RolesService();