/**
 * AdminUserManagement Component
 * Comprehensive admin user management interface for Super Administrators
 */

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { AdminRole } from '../../types/admin';
import { 
  Users,
  Shield,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Crown,
  Settings,
  Mail,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  MoreVertical,
  UserPlus,
  Lock,
  Unlock
} from 'lucide-react';
import { AdminInput, LoadingSpinner, ErrorBoundary } from '../ui';
import { Card, CardContent, CardHeader, CardTitle } from '../ui';
import { Button } from '../ui';
import { AdminRegistrationForm } from '../auth';

// Admin user interface
interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: AdminRole[];
  isActive: boolean;
  isLocked: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  loginAttempts: number;
  ipAddress?: string;
}

// Filter options
interface FilterOptions {
  role?: AdminRole;
  status?: 'active' | 'inactive' | 'locked';
  search: string;
}

// Mock admin users data
const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: '1',
    email: 'super.admin@example.com',
    firstName: 'Super',
    lastName: 'Administrator',
    roles: [AdminRole.SUPER_ADMIN],
    isActive: true,
    isLocked: false,
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    loginAttempts: 0,
    ipAddress: '192.168.1.100'
  },
  {
    id: '2',
    email: 'john.smith@example.com',
    firstName: 'John',
    lastName: 'Smith',
    roles: [AdminRole.ADMINISTRATION_ADMIN],
    isActive: true,
    isLocked: false,
    lastLogin: new Date(Date.now() - 30 * 60 * 1000),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    loginAttempts: 0,
    ipAddress: '192.168.1.101'
  },
  {
    id: '3',
    email: 'sarah.johnson@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    roles: [AdminRole.CONTENT_ADMIN, AdminRole.MARKETING_ADMIN],
    isActive: true,
    isLocked: false,
    lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
    loginAttempts: 1,
    ipAddress: '192.168.1.102'
  },
  {
    id: '4',
    email: 'mike.wilson@example.com',
    firstName: 'Mike',
    lastName: 'Wilson',
    roles: [AdminRole.MARKETPLACE_ADMIN],
    isActive: false,
    isLocked: true,
    lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date(),
    loginAttempts: 5,
    ipAddress: '192.168.1.103'
  }
];

// Role configuration for display
const ROLE_CONFIG: Record<AdminRole, { label: string; color: string; icon: React.ComponentType<any> }> = {
  [AdminRole.SUPER_ADMIN]: {
    label: 'Super Admin',
    color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20',
    icon: Crown
  },
  [AdminRole.ADMINISTRATION_ADMIN]: {
    label: 'Administration',
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20',
    icon: Shield
  },
  [AdminRole.CONTENT_ADMIN]: {
    label: 'Content',
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
    icon: Shield
  },
  [AdminRole.MARKETPLACE_ADMIN]: {
    label: 'Marketplace',
    color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20',
    icon: Shield
  },
  [AdminRole.AI_AGENT_ADMIN]: {
    label: 'AI Agent',
    color: 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/20',
    icon: Shield
  },
  [AdminRole.MARKETING_ADMIN]: {
    label: 'Marketing',
    color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20',
    icon: Shield
  }
};

/**
 * AdminUserManagement Component
 * 
 * Provides comprehensive admin user management including:
 * - User listing with filtering and search
 * - Role assignment and management
 * - User creation and editing
 * - Account status management
 * - Security controls (lock/unlock)
 */
export const AdminUserManagement: React.FC = () => {
  const { adminUser, hasRole } = useAdminAuth();
  
  // Component state
  const [users, setUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  const [filters, setFilters] = useState<FilterOptions>({ search: '' });
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Check if user has Super Admin access
  if (!hasRole(AdminRole.SUPER_ADMIN)) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="p-8 text-center">
          <Shield className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Super Administrator access required to manage admin users.
          </p>
        </Card>
      </div>
    );
  }

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    // Role filter
    if (filters.role) {
      filtered = filtered.filter(user => user.roles.includes(filters.role!));
    }

    // Status filter
    if (filters.status) {
      switch (filters.status) {
        case 'active':
          filtered = filtered.filter(user => user.isActive && !user.isLocked);
          break;
        case 'inactive':
          filtered = filtered.filter(user => !user.isActive);
          break;
        case 'locked':
          filtered = filtered.filter(user => user.isLocked);
          break;
      }
    }

    setFilteredUsers(filtered);
  }, [users, filters]);

  const handleCreateSuccess = (newUser: any) => {
    // Add new user to the list
    const adminUser: AdminUser = {
      id: `admin_${Date.now()}`,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      roles: newUser.roles,
      isActive: true,
      isLocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      loginAttempts: 0
    };
    
    setUsers(prev => [adminUser, ...prev]);
    setShowCreateForm(false);
  };

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create Admin User
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Add a new administrative user to the system
            </p>
          </div>
          
          <Button
            onClick={() => setShowCreateForm(false)}
            variant="outline"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>

        <AdminRegistrationForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage administrative users and their permissions
            </p>
          </div>
          
          <Button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Create Admin User
          </Button>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <AdminInput
                  placeholder="Search users..."
                  leftIcon={Search}
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>

              {/* Role Filter */}
              <div>
                <select
                  value={filters.role || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    role: e.target.value ? e.target.value as AdminRole : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Roles</option>
                  {Object.entries(ROLE_CONFIG).map(([role, config]) => (
                    <option key={role} value={role}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    status: e.target.value ? e.target.value as 'active' | 'inactive' | 'locked' : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="locked">Locked</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Admin Users ({filteredUsers.length})
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8">
                <LoadingSpinner text="Loading users..." />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No admin users found matching your criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Roles
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Login Attempts
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        {/* User Info */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Roles */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role) => {
                              const config = ROLE_CONFIG[role];
                              const Icon = config.icon;
                              return (
                                <span
                                  key={role}
                                  className={`
                                    inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                    ${config.color}
                                  `}
                                >
                                  <Icon className="h-3 w-3 mr-1" />
                                  {config.label}
                                </span>
                              );
                            })}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {user.isLocked ? (
                              <>
                                <AlertTriangle className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
                                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                  Locked
                                </span>
                              </>
                            ) : !user.isActive ? (
                              <>
                                <X className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  Inactive
                                </span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                  Active
                                </span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Last Login */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.lastLogin ? (
                            <div>
                              <div>{user.lastLogin.toLocaleDateString()}</div>
                              <div className="text-xs">{user.lastLogin.toLocaleTimeString()}</div>
                            </div>
                          ) : (
                            'Never'
                          )}
                        </td>

                        {/* Login Attempts */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <span className={user.loginAttempts > 3 ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                            {user.loginAttempts}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default AdminUserManagement;