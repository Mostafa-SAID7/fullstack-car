/**
 * Administrative Authentication Context
 * Provides comprehensive authentication state management for administrative users
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AdminRole, type AdminUserInfo, type AdminLoginRequest, type AdminSession } from '../types/admin';
import { authService } from '../services/auth';

// Administrative Authentication Context Type
export interface AdminAuthContextType {
  // State
  adminUser: AdminUserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  session: AdminSession | null;

  // Authentication Actions
  login: (credentials: AdminLoginRequest) => Promise<{ succeeded: boolean; message?: string; errors?: string[] }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<{ succeeded: boolean; message?: string }>;
  clearError: () => void;

  // Role and Permission Checking
  hasRole: (role: AdminRole) => boolean;
  hasAnyRole: (roles: AdminRole[]) => boolean;
  hasAllRoles: (roles: AdminRole[]) => boolean;
  hasPermission: (module: string, action: string, resource?: string) => boolean;
  canAccessModule: (module: string) => boolean;

  // Session Management
  getCurrentSession: () => AdminSession | null;
  refreshSession: () => Promise<void>;
  
  // User Management
  updateAdminUser: (updates: Partial<AdminUserInfo>) => void;
}

// Create the context
const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Provider Props
interface AdminAuthProviderProps {
  children: ReactNode;
}

// Administrative Authentication Provider
export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  // State
  const [adminUser, setAdminUser] = useState<AdminUserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<AdminSession | null>(null);

  // Computed state
  const isAuthenticated = !!adminUser && !!session && authService.isAuthenticated();

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check for existing token
        const token = localStorage.getItem('admin_auth_token');
        if (token) {
          // Verify token and get admin user info
          const currentUser = authService.getCurrentUser();
          
          if (currentUser && authService.isAuthenticated()) {
            // Convert regular user to admin user if needed
            const adminUserInfo: AdminUserInfo = {
              id: currentUser.id,
              email: currentUser.email,
              firstName: currentUser.firstName,
              lastName: currentUser.lastName,
              roles: currentUser.roles as AdminRole[],
              permissions: [], // Will be populated based on roles
              isActive: currentUser.isActive,
              lastLogin: new Date(),
              createdAt: new Date(currentUser.createdAt),
              updatedAt: new Date()
            };

            setAdminUser(adminUserInfo);
            
            // Create session info
            const sessionInfo: AdminSession = {
              id: `session_${Date.now()}`,
              userId: currentUser.id,
              token: token,
              refreshToken: localStorage.getItem('admin_refresh_token') || '',
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
              createdAt: new Date(),
              lastActivity: new Date(),
              ipAddress: 'unknown',
              userAgent: navigator.userAgent
            };
            
            setSession(sessionInfo);
          }
        }
      } catch (error) {
        console.error('Admin auth initialization failed:', error);
        // Clear any invalid tokens
        localStorage.removeItem('admin_auth_token');
        localStorage.removeItem('admin_refresh_token');
        setError('Authentication initialization failed');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Update session activity
  useEffect(() => {
    if (session && isAuthenticated) {
      const updateActivity = () => {
        setSession(prev => prev ? {
          ...prev,
          lastActivity: new Date()
        } : null);
      };

      // Update activity every 5 minutes
      const interval = setInterval(updateActivity, 5 * 60 * 1000);
      
      // Update on user interaction
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
      events.forEach(event => {
        document.addEventListener(event, updateActivity, { passive: true });
      });

      return () => {
        clearInterval(interval);
        events.forEach(event => {
          document.removeEventListener(event, updateActivity);
        });
      };
    }
  }, [session, isAuthenticated]);

  // Auto-logout on session expiry
  useEffect(() => {
    if (session && session.expiresAt) {
      const timeUntilExpiry = session.expiresAt.getTime() - Date.now();
      
      if (timeUntilExpiry <= 0) {
        // Session already expired
        logout();
        return;
      }

      // Set timeout for auto-logout
      const timeout = setTimeout(() => {
        logout();
        setError('Session expired. Please log in again.');
      }, timeUntilExpiry);

      return () => clearTimeout(timeout);
    }
  }, [session]);

  // Login function
  const login = useCallback(async (credentials: AdminLoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use existing auth service for login
      const result = await authService.login({
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe
      });

      if (result.succeeded) {
        const currentUser = authService.getCurrentUser();
        
        if (currentUser) {
          // Convert to admin user
          const adminUserInfo: AdminUserInfo = {
            id: currentUser.id,
            email: currentUser.email,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            roles: currentUser.roles as AdminRole[],
            permissions: [], // Will be populated based on roles
            isActive: currentUser.isActive,
            lastLogin: new Date(),
            createdAt: new Date(currentUser.createdAt),
            updatedAt: new Date()
          };

          setAdminUser(adminUserInfo);

          // Store admin tokens
          const token = localStorage.getItem('auth_token');
          const refreshToken = localStorage.getItem('refresh_token');
          
          if (token) {
            localStorage.setItem('admin_auth_token', token);
            if (refreshToken) {
              localStorage.setItem('admin_refresh_token', refreshToken);
            }

            // Create session
            const sessionInfo: AdminSession = {
              id: `admin_session_${Date.now()}`,
              userId: currentUser.id,
              token: token,
              refreshToken: refreshToken || '',
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
              createdAt: new Date(),
              lastActivity: new Date(),
              ipAddress: 'unknown',
              userAgent: navigator.userAgent
            };

            setSession(sessionInfo);
          }
        }
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      return {
        succeeded: false,
        message: errorMessage,
        errors: [errorMessage]
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Call auth service logout
      await authService.logout();
      
      // Clear admin-specific storage
      localStorage.removeItem('admin_auth_token');
      localStorage.removeItem('admin_refresh_token');
      
      // Clear state
      setAdminUser(null);
      setSession(null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Clear state even if logout fails
      setAdminUser(null);
      setSession(null);
      localStorage.removeItem('admin_auth_token');
      localStorage.removeItem('admin_refresh_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.refreshToken();
      
      if (result.succeeded) {
        // Update tokens
        const token = localStorage.getItem('auth_token');
        const refreshTokenValue = localStorage.getItem('refresh_token');
        
        if (token) {
          localStorage.setItem('admin_auth_token', token);
          if (refreshTokenValue) {
            localStorage.setItem('admin_refresh_token', refreshTokenValue);
          }

          // Update session
          if (session) {
            setSession(prev => prev ? {
              ...prev,
              token: token,
              refreshToken: refreshTokenValue || prev.refreshToken,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
              lastActivity: new Date()
            } : null);
          }
        }
      } else {
        // Refresh failed, logout
        await logout();
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
      setError(errorMessage);
      await logout();
      return {
        succeeded: false,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, [session, logout]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Role checking functions
  const hasRole = useCallback((role: AdminRole): boolean => {
    return adminUser?.roles?.includes(role) || false;
  }, [adminUser]);

  const hasAnyRole = useCallback((roles: AdminRole[]): boolean => {
    if (!adminUser?.roles) return false;
    return roles.some(role => adminUser.roles.includes(role));
  }, [adminUser]);

  const hasAllRoles = useCallback((roles: AdminRole[]): boolean => {
    if (!adminUser?.roles) return false;
    return roles.every(role => adminUser.roles.includes(role));
  }, [adminUser]);

  // Permission checking function
  const hasPermission = useCallback((module: string, action: string, resource?: string): boolean => {
    if (!adminUser || !adminUser.roles) return false;

    // Super admin has all permissions
    if (adminUser.roles.includes(AdminRole.SUPER_ADMIN)) return true;

    // Check permissions through auth service for now
    // This can be enhanced with more granular permission checking
    return authService.hasRole('Admin') || authService.hasRole('SuperAdmin');
  }, [adminUser]);

  // Module access checking
  const canAccessModule = useCallback((module: string): boolean => {
    if (!adminUser || !adminUser.roles) return false;

    // Super admin can access everything
    if (adminUser.roles.includes(AdminRole.SUPER_ADMIN)) return true;

    // Basic module access based on roles
    const moduleRoleMap: Record<string, AdminRole[]> = {
      'users': [AdminRole.ADMINISTRATION_ADMIN],
      'system': [AdminRole.ADMINISTRATION_ADMIN],
      'content': [AdminRole.CONTENT_ADMIN],
      'marketplace': [AdminRole.MARKETPLACE_ADMIN],
      'ai-agent': [AdminRole.AI_AGENT_ADMIN],
      'marketing': [AdminRole.MARKETING_ADMIN]
    };

    const allowedRoles = moduleRoleMap[module];
    if (!allowedRoles) return false;

    return hasAnyRole(allowedRoles);
  }, [adminUser, hasAnyRole]);

  // Session management functions
  const getCurrentSession = useCallback((): AdminSession | null => {
    return session;
  }, [session]);

  const refreshSession = useCallback(async (): Promise<void> => {
    if (session) {
      setSession(prev => prev ? {
        ...prev,
        lastActivity: new Date()
      } : null);
    }
  }, [session]);

  // Update admin user function
  const updateAdminUser = useCallback((updates: Partial<AdminUserInfo>) => {
    setAdminUser(prev => prev ? {
      ...prev,
      ...updates,
      updatedAt: new Date()
    } : null);
  }, []);

  // Context value
  const contextValue: AdminAuthContextType = {
    // State
    adminUser,
    isAuthenticated,
    isLoading,
    error,
    session,

    // Authentication Actions
    login,
    logout,
    refreshToken,
    clearError,

    // Role and Permission Checking
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    canAccessModule,

    // Session Management
    getCurrentSession,
    refreshSession,

    // User Management
    updateAdminUser
  };

  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Hook to use the admin auth context
export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

// Export the context for advanced usage
export { AdminAuthContext };