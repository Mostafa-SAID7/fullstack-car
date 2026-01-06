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
    // Temporary mock data for testing
    const mockUsers: User[] = [
      {
        id: '1',
        firstName: 'Alexander',
        lastName: 'Rodriguez',
        fullName: 'Alexander Rodriguez',
        email: 'ceo@fully2car.com',
        status: 'Active',
        isActive: true,
        isEmailConfirmed: true,
        phoneNumberConfirmed: false,
        twoFactorEnabled: false,
        lockoutEnabled: false,
        accessFailedCount: 0,
        createdAt: '2023-01-15T00:00:00Z',
        joinDate: '2023-01-15T00:00:00Z',
        lastLogin: '2024-01-06T00:00:00Z',
        lastLoginAt: '2024-01-06T00:00:00Z',
        postsCount: 25,
        groupsCount: 5,
        reviewsCount: 12,
        roles: ['SuperAdmin']
      },
      {
        id: '2',
        firstName: 'Sophia',
        lastName: 'Chen',
        fullName: 'Sophia Chen',
        email: 'cto@fully2car.com',
        status: 'Active',
        isActive: true,
        isEmailConfirmed: true,
        phoneNumberConfirmed: false,
        twoFactorEnabled: true,
        lockoutEnabled: false,
        accessFailedCount: 0,
        createdAt: '2023-01-20T00:00:00Z',
        joinDate: '2023-01-20T00:00:00Z',
        lastLogin: '2024-01-05T00:00:00Z',
        lastLoginAt: '2024-01-05T00:00:00Z',
        postsCount: 18,
        groupsCount: 3,
        reviewsCount: 8,
        roles: ['SuperAdmin']
      },
      {
        id: '3',
        firstName: 'Marcus',
        lastName: 'Thompson',
        fullName: 'Marcus Thompson',
        email: 'usermgr1@fully2car.com',
        status: 'Active',
        isActive: true,
        isEmailConfirmed: true,
        phoneNumberConfirmed: true,
        twoFactorEnabled: false,
        lockoutEnabled: false,
        accessFailedCount: 0,
        createdAt: '2023-02-10T00:00:00Z',
        joinDate: '2023-02-10T00:00:00Z',
        lastLogin: '2024-01-06T00:00:00Z',
        lastLoginAt: '2024-01-06T00:00:00Z',
        postsCount: 32,
        groupsCount: 7,
        reviewsCount: 15,
        roles: ['UserManager']
      },
      {
        id: '4',
        firstName: 'Isabella',
        lastName: 'Martinez',
        fullName: 'Isabella Martinez',
        email: 'usermgr2@fully2car.com',
        status: 'Active',
        isActive: true,
        isEmailConfirmed: true,
        phoneNumberConfirmed: false,
        twoFactorEnabled: true,
        lockoutEnabled: false,
        accessFailedCount: 0,
        createdAt: '2023-02-15T00:00:00Z',
        joinDate: '2023-02-15T00:00:00Z',
        lastLogin: '2024-01-04T00:00:00Z',
        lastLoginAt: '2024-01-04T00:00:00Z',
        postsCount: 28,
        groupsCount: 4,
        reviewsCount: 11,
        roles: ['UserManager']
      },
      {
        id: '5',
        firstName: 'James',
        lastName: 'Wilson',
        fullName: 'James Wilson',
        email: 'contentmgr1@fully2car.com',
        status: 'Active',
        isActive: true,
        isEmailConfirmed: true,
        phoneNumberConfirmed: true,
        twoFactorEnabled: false,
        lockoutEnabled: false,
        accessFailedCount: 0,
        createdAt: '2023-03-01T00:00:00Z',
        joinDate: '2023-03-01T00:00:00Z',
        lastLogin: '2024-01-03T00:00:00Z',
        lastLoginAt: '2024-01-03T00:00:00Z',
        postsCount: 45,
        groupsCount: 6,
        reviewsCount: 22,
        roles: ['ContentManager']
      }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Apply search filter
    let filteredUsers = mockUsers;
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredUsers = mockUsers.filter(user => 
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply role filter
    if (params.role) {
      filteredUsers = filteredUsers.filter(user => 
        user.roles.includes(params.role!)
      );
    }

    // Apply status filter
    if (params.status) {
      filteredUsers = filteredUsers.filter(user => 
        user.status === params.status
      );
    }

    // Apply pagination
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const totalCount = filteredUsers.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      users: paginatedUsers,
      totalCount,
      pageNumber: page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    };

    /* Real API call - commented out for testing
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`${this.baseUrl}?${searchParams.toString()}`);
    
    if (!response.succeeded) {
      throw new Error(response.errors?.join(', ') || 'Failed to fetch users');
    }
    
    return response.data;
    */
  }

  async getUserById(id: string): Promise<UserDetailResponse> {
    // Mock data for testing
    const mockUser: UserDetailResponse = {
      id,
      firstName: 'Alexander',
      lastName: 'Rodriguez',
      fullName: 'Alexander Rodriguez',
      email: 'ceo@fully2car.com',
      status: 'Active',
      isActive: true,
      isEmailConfirmed: true,
      phoneNumberConfirmed: false,
      twoFactorEnabled: false,
      lockoutEnabled: false,
      accessFailedCount: 0,
      createdAt: '2023-01-15T00:00:00Z',
      joinDate: '2023-01-15T00:00:00Z',
      lastLogin: '2024-01-06T00:00:00Z',
      lastLoginAt: '2024-01-06T00:00:00Z',
      postsCount: 25,
      groupsCount: 5,
      reviewsCount: 12,
      roles: ['SuperAdmin'],
      recentActivity: [],
      securityLogs: [],
      reports: []
    };

    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUser;

    /* Real API call - commented out for testing
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    
    if (!response.succeeded) {
      throw new Error(response.errors?.join(', ') || 'Failed to fetch user details');
    }
    
    return response.data;
    */
  }

  async searchUsers(params: {
    searchTerm: string;
    limit?: number;
    role?: string;
    isActive?: boolean;
  }): Promise<User[]> {
    // Mock search results
    const mockResults: User[] = [
      {
        id: '1',
        firstName: 'Alexander',
        lastName: 'Rodriguez',
        fullName: 'Alexander Rodriguez',
        email: 'ceo@fully2car.com',
        status: 'Active',
        isActive: true,
        isEmailConfirmed: true,
        phoneNumberConfirmed: false,
        twoFactorEnabled: false,
        lockoutEnabled: false,
        accessFailedCount: 0,
        createdAt: '2023-01-15T00:00:00Z',
        joinDate: '2023-01-15T00:00:00Z',
        lastLogin: '2024-01-06T00:00:00Z',
        lastLoginAt: '2024-01-06T00:00:00Z',
        postsCount: 25,
        groupsCount: 5,
        reviewsCount: 12,
        roles: ['SuperAdmin']
      }
    ].filter(user => 
      user.firstName.toLowerCase().includes(params.searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(params.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(params.searchTerm.toLowerCase())
    );

    await new Promise(resolve => setTimeout(resolve, 200));
    return mockResults.slice(0, params.limit || 10);

    /* Real API call - commented out for testing
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`${this.baseUrl}/search?${searchParams.toString()}`);
    
    if (!response.succeeded) {
      throw new Error(response.errors?.join(', ') || 'Failed to search users');
    }
    
    return response.data;
    */
  }

  async suspendUser(id: string, reason: string, suspendUntil?: string, isPermanent = false): Promise<UserAction> {
    const response = await apiClient.post(`${this.baseUrl}/${id}/suspend`, {
      reason,
      suspendUntil,
      isPermanent
    });
    
    if (!response.succeeded) {
      throw new Error(response.errors?.join(', ') || 'Failed to suspend user');
    }
    
    return response.data;
  }

  async banUser(id: string, reason: string, isPermanent = true): Promise<UserAction> {
    const response = await apiClient.post(`${this.baseUrl}/${id}/ban`, {
      reason,
      isPermanent
    });
    
    if (!response.succeeded) {
      throw new Error(response.errors?.join(', ') || 'Failed to ban user');
    }
    
    return response.data;
  }

  async deleteUser(id: string, reason: string, deleteAllContent = false): Promise<UserAction> {
    // For DELETE requests with body, we need to use a different approach
    const response = await apiClient.post(`${this.baseUrl}/${id}/delete`, {
      reason,
      deleteAllContent
    });
    
    if (!response.succeeded) {
      throw new Error(response.errors?.join(', ') || 'Failed to delete user');
    }
    
    return response.data;
  }

  async sendMessageToUser(id: string, subject: string, message: string, isUrgent = false): Promise<UserAction> {
    const response = await apiClient.post(`${this.baseUrl}/${id}/message`, {
      subject,
      message,
      isUrgent
    });
    
    if (!response.succeeded) {
      throw new Error(response.errors?.join(', ') || 'Failed to send message');
    }
    
    return response.data;
  }

  async updateUserRoles(id: string, roleNames: string[]): Promise<UserAction> {
    const response = await apiClient.put(`${this.baseUrl}/${id}/roles`, {
      roleNames
    });
    
    if (!response.succeeded) {
      throw new Error(response.errors?.join(', ') || 'Failed to update user roles');
    }
    
    return response.data;
  }

  async impersonateUser(id: string, reason: string, durationMinutes = 60): Promise<UserAction> {
    const response = await apiClient.post(`${this.baseUrl}/${id}/impersonate`, {
      reason,
      durationMinutes
    });
    
    if (!response.succeeded) {
      throw new Error(response.errors?.join(', ') || 'Failed to impersonate user');
    }
    
    return response.data;
  }
}

export const usersService = new UsersService();