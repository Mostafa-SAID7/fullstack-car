import React, { createContext, useEffect, useState, useCallback, useRef } from 'react';
import { authService } from '../../services/auth';
import { STORAGE_KEYS } from '../../constants/app';
import type { AuthContextType, AuthProviderProps } from './types';
import type { UserDto, LoginRequest } from '../../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isAuthenticated = !!user && !!token;

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const storedRefreshToken = localStorage.getItem('refresh_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setRefreshToken(storedRefreshToken);
          setUser(JSON.parse(storedUser));

          // Verify token is still valid
          const isValid = await authService.verifyToken(storedToken);
          if (!isValid) {
            await logout();
          } else {
            // Setup automatic token refresh
            setupTokenRefresh();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup on unmount
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  // Setup automatic token refresh (refresh 2 minutes before expiration)
  const setupTokenRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // Refresh token every 13 minutes (assuming 15 min token lifetime)
    refreshTimerRef.current = setTimeout(async () => {
      const success = await handleRefreshToken();
      if (success) {
        setupTokenRefresh(); // Setup next refresh
      }
    }, 13 * 60 * 1000); // 13 minutes
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<any> => {
    try {
      const response = await authService.login(credentials);

      if (response.succeeded && response.data) {
        const { user: userData, token: authToken } = response.data;
        const refreshTokenValue = localStorage.getItem('refresh_token');

        setUser(userData);
        setToken(authToken);
        setRefreshToken(refreshTokenValue);

        // Store in localStorage
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));

        // Setup automatic token refresh
        setupTokenRefresh();

        return response;
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, [setupTokenRefresh]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear refresh timer
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

      setUser(null);
      setToken(null);
      setRefreshToken(null);

      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem('auth_user');
      localStorage.removeItem('refresh_token');
    }
  }, []);

  const handleRefreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await authService.refreshToken();

      if (response.succeeded && response.data) {
        // Token was refreshed successfully
        const newToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const newRefreshToken = localStorage.getItem('refresh_token');
        
        if (newToken) {
          setToken(newToken);
          setRefreshToken(newRefreshToken);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
      return false;
    }
  }, [logout]);

  const updateUser = useCallback((updatedUser: Partial<UserDto>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken: handleRefreshToken,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export { AuthContext };
