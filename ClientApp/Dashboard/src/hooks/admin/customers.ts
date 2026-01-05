// Admin Customers Hook - Main Export (composed from sub-modules)

import { useAdminCustomersState } from './customers-state';
import { useAdminCustomersData } from './customers-data';
import { useAdminCustomersEffects } from './customers-effects';

export const useCustomers = () => {
  const {
    users,
    loading,
    setUsers,
    setLoading
  } = useAdminCustomersState();

  const { fetchUsers } = useAdminCustomersData(setUsers, setLoading);

  // Initialize effects
  useAdminCustomersEffects(fetchUsers);

  return {
    users,
    loading
  };
};
