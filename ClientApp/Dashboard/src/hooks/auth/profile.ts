// Auth Hook - Profile Management Functions

import { authService } from '../../services/auth';
import type { UpdateProfileRequest, ChangePasswordRequest } from '../../types/auth/requests';

export const useProfileFunctions = (setLoading: (loading: boolean) => void, setError: (error: string | null) => void) => {
  const updateProfile = async (request: UpdateProfileRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.updateProfile(request);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (request: ChangePasswordRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.changePassword(request);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password change failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.getProfile();
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    changePassword,
    getProfile
  };
};



