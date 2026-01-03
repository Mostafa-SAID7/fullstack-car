import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import type { AdminUser } from '../services/adminService';

export const useCustomers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchUsers();
  }, []);

  return {
    users,
    loading
  };
};