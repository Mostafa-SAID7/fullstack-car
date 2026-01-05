// Admin Customers Hook - State Management

import { useState } from 'react';
import type { AdminUser } from '../../services/admin';

export const useAdminCustomersState = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  return {
    users,
    loading,
    setUsers,
    setLoading
  };
};



