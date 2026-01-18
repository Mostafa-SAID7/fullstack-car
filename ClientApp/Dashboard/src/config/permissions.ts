/**
 * Administrative Permission Configuration
 * Defines the complete permission matrix for all administrative roles
 */

import { AdminRole, type RolePermissions } from '../types/admin';

// Complete permission matrix for all administrative roles
export const ADMIN_ROLE_PERMISSIONS: Record<AdminRole, RolePermissions> = {
  [AdminRole.SUPER_ADMIN]: {
    role: AdminRole.SUPER_ADMIN,
    permissions: [
      { module: '*', actions: ['*'] } // Full access to everything
    ]
  },

  [AdminRole.ADMINISTRATION_ADMIN]: {
    role: AdminRole.ADMINISTRATION_ADMIN,
    permissions: [
      { module: 'users', actions: ['read', 'create', 'update', 'delete'] },
      { module: 'system', actions: ['read', 'update', 'monitor'] },
      { module: 'analytics', actions: ['read'] },
      { module: 'audit', actions: ['read'] },
      { module: 'notifications', actions: ['read', 'create', 'update'] },
      { module: 'settings', actions: ['read', 'update'] },
      { module: 'health-monitor', actions: ['read'] },
      { module: 'sessions', actions: ['read', 'delete'] }
    ]
  },

  [AdminRole.CONTENT_ADMIN]: {
    role: AdminRole.CONTENT_ADMIN,
    permissions: [
      { module: 'content', actions: ['read', 'create', 'update', 'delete', 'publish'] },
      { module: 'media', actions: ['read', 'create', 'update', 'delete'] },
      { module: 'cms', actions: ['read', 'create', 'update', 'delete'] },
      { module: 'moderation', actions: ['read', 'create', 'update', 'approve', 'reject'] },
      { module: 'media-review', actions: ['read', 'approve', 'reject'] },
      { module: 'folders', actions: ['read', 'create', 'update', 'delete'] },
      { module: 'seo', actions: ['read', 'update'] },
      { module: 'localization', actions: ['read', 'update'] },
      { module: 'community-content', actions: ['read', 'moderate', 'flag', 'unflag'] }
    ]
  },

  [AdminRole.MARKETPLACE_ADMIN]: {
    role: AdminRole.MARKETPLACE_ADMIN,
    permissions: [
      { module: 'marketplace', actions: ['read', 'create', 'update', 'delete'] },
      { module: 'vendors', actions: ['read', 'create', 'update', 'verify', 'suspend'] },
      { module: 'products', actions: ['read', 'create', 'update', 'approve', 'reject'] },
      { module: 'services', actions: ['read', 'create', 'update', 'approve', 'reject'] },
      { module: 'transactions', actions: ['read', 'update', 'refund'] },
      { module: 'disputes', actions: ['read', 'resolve', 'escalate'] },
      { module: 'marketplace-analytics', actions: ['read'] },
      { module: 'pricing', actions: ['read', 'update'] },
      { module: 'inventory', actions: ['read', 'update'] }
    ]
  },

  [AdminRole.AI_AGENT_ADMIN]: {
    role: AdminRole.AI_AGENT_ADMIN,
    permissions: [
      { module: 'ai-agents', actions: ['read', 'create', 'update', 'delete', 'deploy'] },
      { module: 'models', actions: ['read', 'create', 'train', 'evaluate', 'deploy'] },
      { module: 'datasets', actions: ['read', 'create', 'update', 'delete'] },
      { module: 'conversations', actions: ['read', 'monitor', 'analyze'] },
      { module: 'ai-analytics', actions: ['read'] },
      { module: 'training', actions: ['read', 'create', 'monitor', 'stop'] },
      { module: 'ai-config', actions: ['read', 'update'] },
      { module: 'ai-performance', actions: ['read', 'monitor'] }
    ]
  },

  [AdminRole.MARKETING_ADMIN]: {
    role: AdminRole.MARKETING_ADMIN,
    permissions: [
      { module: 'campaigns', actions: ['read', 'create', 'update', 'delete', 'launch'] },
      { module: 'audiences', actions: ['read', 'create', 'update', 'segment'] },
      { module: 'marketing-content', actions: ['read', 'create', 'update'] },
      { module: 'marketing-analytics', actions: ['read'] },
      { module: 'social-media', actions: ['read', 'create', 'update', 'schedule', 'publish'] },
      { module: 'email-marketing', actions: ['read', 'create', 'update', 'send'] },
      { module: 'lead-management', actions: ['read', 'update'] },
      { module: 'conversion-tracking', actions: ['read'] },
      { module: 'marketing-automation', actions: ['read', 'create', 'update'] }
    ]
  }
};

// Helper function to get permissions for a role
export function getRolePermissions(role: AdminRole): Permission[] {
  return ADMIN_ROLE_PERMISSIONS[role]?.permissions || [];
}

// Helper function to check if a role has a specific permission
export function roleHasPermission(
  role: AdminRole,
  module: string,
  action: string,
  resource?: string
): boolean {
  const rolePermissions = ADMIN_ROLE_PERMISSIONS[role];
  if (!rolePermissions) return false;

  // Super admin has all permissions
  if (role === AdminRole.SUPER_ADMIN) return true;

  for (const permission of rolePermissions.permissions) {
    // Check wildcard permissions
    if (permission.module === '*' && permission.actions.includes('*')) return true;
    if (permission.module === module && permission.actions.includes('*')) return true;
    if (permission.module === module && permission.actions.includes(action)) {
      // Check resource-specific permissions if needed
      if (resource && permission.resources) {
        return permission.resources.includes(resource);
      }
      return true;
    }
  }

  return false;
}

// Helper function to get all modules a role can access
export function getRoleModules(role: AdminRole): string[] {
  const rolePermissions = ADMIN_ROLE_PERMISSIONS[role];
  if (!rolePermissions) return [];

  if (role === AdminRole.SUPER_ADMIN) {
    // Return all possible modules for super admin
    return [
      'users', 'system', 'analytics', 'audit', 'notifications', 'settings',
      'content', 'media', 'cms', 'moderation', 'seo', 'localization',
      'marketplace', 'vendors', 'products', 'services', 'transactions',
      'ai-agents', 'models', 'datasets', 'conversations', 'training',
      'campaigns', 'audiences', 'marketing-content', 'social-media'
    ];
  }

  return rolePermissions.permissions
    .map(p => p.module)
    .filter(module => module !== '*');
}

// Helper function to check if user has any of the required roles
export function hasAnyRole(userRoles: AdminRole[], requiredRoles: AdminRole[]): boolean {
  return requiredRoles.some(role => userRoles.includes(role));
}

// Helper function to check if user has all required roles
export function hasAllRoles(userRoles: AdminRole[], requiredRoles: AdminRole[]): boolean {
  return requiredRoles.every(role => userRoles.includes(role));
}