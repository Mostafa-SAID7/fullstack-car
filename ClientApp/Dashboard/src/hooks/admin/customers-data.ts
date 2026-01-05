// Admin Customers Hook - Data Fetching Functions

import { adminService } from '../../services/admin';

export const useAdminCustomersData = (
  setUsers: (users: any[]) => void,
  setLoading: (loading: boolean) => void
) => {
  const fetchUsers = async () => {
    try {
      const response = await adminService.getUsers();
      if (response.succeeded && response.data) {
        setUsers(response.data.items);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchUsers
  };
};



