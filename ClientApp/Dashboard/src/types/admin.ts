/**
 * Administrative Role-Based Access Control Types
 * Defines roles, permissions, and user types for the administrative dashboard
 */

// Administrative Role Definitions
export enum AdminRole {
  SUPER_ADMIN = 'SuperAdmin',
  ADMINISTRATION_ADMIN = 'AdministrationAdmin',
  CONTENT_ADMIN = 'ContentAdmin',
  MARKETPLACE_ADMIN = 'MarketplaceAdmin',
  AI_AGENT_ADMIN = 'AIAgentAdmin',
  MARKETING_ADMIN = 'MarketingAdmin'
}

// Permission Structure
export interface Permission {
  module: string;
  actions: string[];
  resources?: string[];
}

// Role Permission Configuration
export interface RolePermissions {
  role: AdminRole;
  permissions: Permission[];
  inherits?: AdminRole[];
}

// Administrative User Information
export interface AdminUserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: AdminRole[];
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Authentication Request/Response Types
export interface AdminLoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AdminLoginResponse {
  token: string;
  refreshToken: string;
  adminUser: AdminUserInfo;
  expiresIn: number;
}

export interface AdminRefreshTokenRequest {
  refreshToken: string;
}

export interface AdminRefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Permission Checking Types
export interface PermissionCheck {
  module: string;
  action: string;
  resource?: string;
}

// Administrative Session Information
export interface AdminSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  lastActivity: Date;
  ipAddress?: string;
  userAgent?: string;
}