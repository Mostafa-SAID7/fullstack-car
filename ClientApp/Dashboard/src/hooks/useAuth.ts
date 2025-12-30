import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import type { UserInfo, LoginRequest, RegisterRequest, UpdateProfileRequest, ChangePasswordRequest } from '../types/auth';

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

  const updateProfile = async (request: UpdateProfileRequest) => {
    setLoading(true);
    setError(null);
    try {
      await authService.updateProfile(request);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (request: ChangePasswordRequest) => {
    setLoading(true);
    setError(null);
    try {
      await authService.changePassword(request);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password change failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getActiveSessions = async () => {
    setLoading(true);
    try {
      return await authService.getActiveSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    setLoading(true);
    try {
      await authService.revokeSession(sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke session');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTwoFactorStatus = async () => {
    try {
      return await authService.getTwoFactorStatus();
    } catch (err) {
      console.error('Failed to get 2FA status:', err);
      throw err;
    }
  };

  const toggleTwoFactor = async (enable: boolean) => {
    setLoading(true);
    try {
      await authService.toggleTwoFactor(enable);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle 2FA');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    setLoading(true);
    try {
      return await authService.uploadAvatar(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAvatar = async () => {
    setLoading(true);
    try {
      await authService.deleteAvatar();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete avatar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPrivacySettings = async () => {
    try {
      return await authService.getPrivacySettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get privacy settings');
      throw err;
    }
  };

  const updatePrivacySettings = async (request: any) => {
    setLoading(true);
    try {
      await authService.updatePrivacySettings(request);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update privacy settings');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deactivateAccount = async (reason: string) => {
    setLoading(true);
    try {
      await authService.deactivateAccount({ reason });
      await authService.logout();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (password: string) => {
    setLoading(true);
    try {
      await authService.deleteAccount({ password });
      await authService.logout();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      throw err;
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
    updateProfile,
    changePassword,
    getActiveSessions,
    revokeSession,
    getTwoFactorStatus,
    toggleTwoFactor,
    uploadAvatar,
    deleteAvatar,
    getPrivacySettings,
    updatePrivacySettings,
    deactivateAccount,
    deleteAccount,
    clearError,
  };
};
