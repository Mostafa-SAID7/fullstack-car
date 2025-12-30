import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { UserInfo, LoginRequest, RegisterRequest } from '../types/auth';

export const useAuth = () => {
  const [user, setUser] = useState<UserInfo | null>(authService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = authService.subscribe(setUser);
    return unsubscribe;
  }, []);

  const login = async (request: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(request);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (request: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(request);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    user,
    isAuthenticated: authService.isAuthenticated(),
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };
};