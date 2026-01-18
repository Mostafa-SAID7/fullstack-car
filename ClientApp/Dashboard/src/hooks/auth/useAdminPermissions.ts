/**
 * Administrative Permissions Hook
 * Provides permission checking functionality for administrative users
 */

import { useCallback } from 'react';
import { useAuth } from './useAuth';
import { AdminRole, type PermissionCheck } from '../../types/admin';
import { ADMIN_ROLE_PERMISSIONS, roleHasPermission } from '../../config/permissions';

export interface UseAdminPermissionsReturn {
  hasPermission: (module: string, action: string, resource?: string) => boolean;
  hasAnyPermission: (permissions: PermissionCheck[]) => boolean;
  hasAllPermissions: (permissions: PermissionCheck[]) => boolean;
  hasRole: (role: AdminRole) => boolean;
  hasAnyRole: (roles: AdminRole[]) => boolean;
  hasAllRoles: (roles: AdminRole[]) => boolean;
  userRoles: AdminRole[];
  canAccessModule: (module: string) => boolean;
  getModuleActions: (module: string) => string[];
}

/**
 * Hook for checking administrative permissions
 * Provides comprehensive permission checking functionality
 */
export const useAdminPermissions = (): UseAdminPermissionsReturn => {
  const { user } = useAuth();

  // Check if user has a specific permission
  const hasPermission = useCallback((module: string, action: string, resource?: string): boolean => {
    if (!user || !user.roles) return false;

    // Super admin has all permissions
    if (user.roles.includes(AdminRole.SUPER_ADMIN)) return true;

    // Check each role for the permission
    for (const role of user.roles) {
      if (roleHasPermission(role as AdminRole, module, action, resource)) {
        return true;
      }
    }

    return false;
  }, [user]);

  // Check if user has any of the specified permissions
  const hasAnyPermission = useCallback((permissions: PermissionCheck[]): boolean => {
    return permissions.some(p => hasPermission(p.module, p.action, p.resource));
  }, [hasPermission]);

  // Check if user has all of the specified permissions
  const hasAllPermissions = useCallback((permissions: PermissionCheck[]): boolean => {
    return permissions.every(p => hasPermission(p.module, p.action, p.resource));
  }, [hasPermission]);

  // Check if user has a specific role
  const hasRole = useCallback((role: AdminRole): boolean => {
    return user?.roles?.includes(role) || false;
  }, [user]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles: AdminRole[]): boolean => {
    if (!user?.roles) return false;
    return roles.some(role => user.roles.includes(role));
  }, [user]);

  // Check if user has all of the specified roles
  const hasAllRoles = useCallback((roles: AdminRole[]): boolean => {
    if (!user?.roles) return false;
    return roles.every(role => user.roles.includes(role));
  }, [user]);

  // Check if user can access a module (has any permission for it)
  const canAccessModule = useCallback((module: string): boolean => {
    if (!user || !user.roles) return false;

    // Super admin can access everything
    if (user.roles.includes(AdminRole.SUPER_ADMIN)) return true;

    // Check if any role has permissions for this module
    for (const role of user.roles) {
      const rolePermissions = ADMIN_ROLE_PERMISSIONS[role as AdminRole];
      if (!rolePermissions) continue;

      for (const permission of rolePermissions.permissions) {
        if (permission.module === '*' || permission.module === module) {
          return true;
        }
      }
    }

    return false;
  }, [user]);

  // Get all actions user can perform on a module
  const getModuleActions = useCallback((module: string): string[] => {
    if (!user || !user.roles) return [];

    const actions = new Set<string>();

    // Super admin can do everything
    if (user.roles.includes(AdminRole.SUPER_ADMIN)) {
      return ['*'];
    }

    // Collect actions from all roles
    for (const role of user.roles) {
      const rolePermissions = ADMIN_ROLE_PERMISSIONS[role as AdminRole];
      if (!rolePermissions) continue;

      for (const permission of rolePermissions.permissions) {
        if (permission.module === '*') {
          return ['*'];
        }
        if (permission.module === module) {
          permission.actions.forEach(action => actions.add(action));
        }
      }
    }

    return Array.from(actions);
  }, [user]);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    userRoles: user?.roles || [],
    canAccessModule,
    getModuleActions
  };
};