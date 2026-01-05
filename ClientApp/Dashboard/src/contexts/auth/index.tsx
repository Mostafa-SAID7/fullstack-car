import React, { createContext, useEffect, useState, useCallback } from 'react';
import { authService } from '../../services/auth';
import { STORAGE_KEYS } from '../../constants/app';
import type { AuthContextType, AuthProviderProps } from './types';
import type { UserInfo, LoginRequest, LoginResponse } from '../../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const storedUser = localStorage.getItem('user_info');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verify token is still valid
          const isValid = await authService.verifyToken(storedToken);
          if (!isValid) {
            await logout();
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
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await authService.login(credentials);

      if (response.success && response.user && response.token) {
        setUser(response.user);
        setToken(response.token);

        // Store in localStorage
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
        localStorage.setItem('user_info', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);

      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem('user_info');
      localStorage.removeItem('auth_refresh_token');
    }
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await authService.refreshToken();

      if (response.succeeded) {
        // Token was refreshed successfully
        const newToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (newToken) {
          setToken(newToken);
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

  const updateUser = useCallback((updatedUser: Partial<UserInfo>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem('user_info', JSON.stringify(newUser));
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
