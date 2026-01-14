// Auth Hook - Authentication Functions

import { authService } from '../../services/auth';
import type { LoginRequest, RegisterRequest } from '../../types/auth/requests';

export const useAuthFunctions = (setLoading: (loading: boolean) => void, setError: (error: string | null) => void) => {
  const login = async (request: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(request);
      if (!response.succeeded) {
        throw new Error(response.message || response.errors?.[0] || 'Login failed');
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (request: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(request);
      return response;
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.refreshToken();
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Token refresh failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
    refreshToken
  };
};





