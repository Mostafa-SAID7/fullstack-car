// Auth Hook - Password Recovery Functions

import { authService } from '../../services/auth';

export const usePasswordFunctions = (setLoading: (loading: boolean) => void, setError: (error: string | null) => void) => {
  const confirmEmail = async (request: { userId: string; token: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.confirmEmail(request);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Email confirmation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (request: { email: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.forgotPassword(request);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset request failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (request: { email: string; token: string; newPassword: string; confirmPassword: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.resetPassword(request);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    confirmEmail,
    forgotPassword,
    resetPassword
  };
};



