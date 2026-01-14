// Auth Hook - State Management

import { useState } from 'react';
import { authService } from '../../services/auth';
import type { UserInfo } from '../../types/auth/user';

export const useAuthState = () => {
  const [user, setUser] = useState<UserInfo | null>(authService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const isAuthenticated = !!user;

  return {
    user,
    loading,
    error,
    isAuthenticated,
    setUser,
    setLoading,
    setError,
    clearError
  };
};







