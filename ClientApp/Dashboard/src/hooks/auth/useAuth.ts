import { useState, useEffect } from 'react';
import { authService } from '../../services/auth';
import type { UserInfo } from '../../types/auth';
import type { AdminUserInfo } from '../../types/admin';
import type { LoginRequest, RegisterRequest } from '../../types/auth/requests';

// Union type for user info to support both regular and admin users
type AuthUser = UserInfo | AdminUserInfo;

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize auth state
    const currentUser = authService.getCurrentUser();
    const isAuth = authService.isAuthenticated();
    
    setUser(currentUser);
    setIsAuthenticated(isAuth);

    // Listen for auth state changes
    const unsubscribe = authService.onAuthStateChange((newUser) => {
      setUser(newUser);
      setIsAuthenticated(!!newUser && authService.isAuthenticated());
    });

    return unsubscribe;
  }, []);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(credentials);
      
      if (result.succeeded) {
        // Force update the local state immediately after successful login
        const currentUser = authService.getCurrentUser();
        const isAuth = authService.isAuthenticated();
        
        console.log('[useAuth] Login successful, updating state:', { 
          currentUser: currentUser?.name || currentUser?.firstName, 
          isAuth,
          hasToken: !!localStorage.getItem('auth_token'),
          hasUser: !!localStorage.getItem('auth_user')
        });
        
        setUser(currentUser);
        setIsAuthenticated(isAuth);
        
        // Verify the state is consistent
        if (!isAuth || !currentUser) {
          console.error('[useAuth] Inconsistent authentication state after login');
          setError('Authentication state error. Please try again.');
          return {
            succeeded: false,
            message: 'Authentication state error',
            errors: ['Inconsistent authentication state']
          };
        }
      } else {
        const errorMessage = result.errors?.join(', ') || result.message || 'Login failed';
        setError(errorMessage);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.register(userData);
      
      if (result.succeeded) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        const errorMessage = result.errors?.join(', ') || result.message || 'Registration failed';
        setError(errorMessage);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      // Still clear local state even if server logout fails
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.refreshToken();
      
      if (result.succeeded) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        // Token refresh failed, clear auth state
        setUser(null);
        setIsAuthenticated(false);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Token refresh failed';
      setError(errorMessage);
      // Clear auth state on refresh failure
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Permission helpers - support both regular and admin roles
  const hasRole = (role: string): boolean => {
    if (!user?.roles) return false;
    return user.roles.includes(role as any);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user?.roles) return false;
    return roles.some(role => user.roles.includes(role as any));
  };

  const isAdmin = (): boolean => {
    return hasRole('Admin') || hasRole('SuperAdmin');
  };

  const isContentCreator = (): boolean => {
    return hasAnyRole(['ContentCreator', 'Admin', 'Moderator', 'ContentAdmin']);
  };

  const canUploadMedia = (): boolean => {
    return isContentCreator();
  };

  const canModerateContent = (): boolean => {
    return hasAnyRole(['Admin', 'Moderator', 'ContentAdmin']);
  };

  const canAccessAnalytics = (): boolean => {
    return isContentCreator();
  };

  const canManageUsers = (): boolean => {
    return isAdmin() || hasRole('AdministrationAdmin');
  };

  const canEditContent = (creatorId: string): boolean => {
    return user?.id === creatorId || canModerateContent();
  };

  return {
    // State
    user,
    loading,
    error,
    isAuthenticated,
    
    // Actions
    login,
    register,
    logout,
    refreshToken,
    clearError,
    
    // Permission helpers
    hasRole,
    hasAnyRole,
    isAdmin,
    isContentCreator,
    canUploadMedia,
    canModerateContent,
    canAccessAnalytics,
    canManageUsers,
    canEditContent
  };
};