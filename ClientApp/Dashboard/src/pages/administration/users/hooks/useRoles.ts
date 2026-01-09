import { useState, useEffect, useCallback } from 'react';
import { rolesService } from '../services/rolesService';
import type { Role } from '../types/role';

export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    isSystemRole?: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await rolesService.getRoles(params);
      setRoles((response as any)?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch roles');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRole = useCallback(async (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await rolesService.createRole(role);
      fetchRoles(); // Refresh the list
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create role' };
    }
  }, [fetchRoles]);

  const updateRole = useCallback(async (id: string, role: Partial<Role>) => {
    try {
      await rolesService.updateRole(id, role);
      fetchRoles(); // Refresh the list
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update role' };
    }
  }, [fetchRoles]);

  const deleteRole = useCallback(async (id: string) => {
    try {
      await rolesService.deleteRole(id);
      fetchRoles(); // Refresh the list
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete role' };
    }
  }, [fetchRoles]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    loading,
    error,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    refetch: fetchRoles
  };
};