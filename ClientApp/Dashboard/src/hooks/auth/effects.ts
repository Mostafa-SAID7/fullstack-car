// Auth Hook - Effects

import { useEffect } from 'react';
import { authService } from '../../services/auth';
import type { UserInfo } from '../../types/auth';

export const useAuthEffects = (setUser: (user: UserInfo | null) => void) => {
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(setUser);
    return unsubscribe;
  }, [setUser]);

  return {};
};





