import { useState, useEffect, useCallback } from 'react';
import { permissionsService } from '../services/permissionsService';
import type { Permission } from '../types/permission';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = useCallback(async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
    isSystemPermission?: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await permissionsService.getPermissions(params);
      setPermissions((response as any)?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch permissions');
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPermission = useCallback(async (permission: Omit<Permission, 'createdAt' | 'updatedAt'>) => {
    try {
      await permissionsService.createPermission(permission);
      fetchPermissions(); // Refresh the list
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create permission' };
    }
  }, [fetchPermissions]);

  const updatePermission = useCallback(async (name: string, permission: Partial<Permission>) => {
    try {
      await permissionsService.updatePermission(name, permission);
      fetchPermissions(); // Refresh the list
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update permission' };
    }
  }, [fetchPermissions]);

  const deletePermission = useCallback(async (name: string) => {
    try {
      await permissionsService.deletePermission(name);
      fetchPermissions(); // Refresh the list
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete permission' };
    }
  }, [fetchPermissions]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return {
    permissions,
    loading,
    error,
    fetchPermissions,
    createPermission,
    updatePermission,
    deletePermission,
    refetch: fetchPermissions
  };
};