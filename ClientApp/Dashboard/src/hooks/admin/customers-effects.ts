// Admin Customers Hook - Effects

import { useEffect } from 'react';

export const useAdminCustomersEffects = (fetchUsers: () => Promise<void>) => {
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {};
};





