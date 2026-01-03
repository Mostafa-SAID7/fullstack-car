import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { LoginRequest, LoginResponse, UserInfo } from '../types/auth';
import { authService } from '../services/authService';
import { STORAGE_KEYS } from '../constants/app';

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  updateUser: (user: Partial<UserInfo>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

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
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      
      if (response.success) {
        setToken(response.token);
        setUser(response.user);
        
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
        localStorage.setItem('user_info', JSON.stringify(response.user));
      }
      
      return response;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem('user_info');
    
    // Optional: Call logout endpoint
    authService.logout().catch(console.error);
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      
      if (!storedRefreshToken || !storedToken) {
        return false;
      }

      const response = await authService.refreshToken({
        token: storedToken,
        refreshToken: storedRefreshToken
      });

      if (response.success) {
        setToken(response.token);
        setUser(response.user);
        
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
        localStorage.setItem('user_info', JSON.stringify(response.user));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }, []);

  const updateUser = useCallback((updates: Partial<UserInfo>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user_info', JSON.stringify(updatedUser));
    }
  }, [user]);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!token) return;

    const refreshInterval = setInterval(async () => {
      const success = await refreshToken();
      if (!success) {
        logout();
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(refreshInterval);
  }, [token, refreshToken, logout]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};