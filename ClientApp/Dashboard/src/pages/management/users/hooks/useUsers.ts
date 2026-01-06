import { useState, useEffect, useCallback } from 'react';
import { usersService } from '../services/usersService';
import type { User, UserFilters, UserListResponse } from '../types';

export const useUsers = (filters: UserFilters) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response: UserListResponse = await usersService.getUsers({
        page: filters.page,
        pageSize: filters.pageSize,
        search: filters.search,
        status: filters.status,
        role: filters.role,
        joinedAfter: filters.joinedAfter,
        joinedBefore: filters.joinedBefore,
        isVerified: filters.isVerified,
        sortBy: filters.sortBy,
        sortDirection: filters.sortDirection
      });

      setUsers(response.users || []);
      setTotalCount(response.totalCount || 0);
      setTotalPages(response.totalPages || 0);
      setHasNextPage(response.hasNextPage || false);
      setHasPreviousPage(response.hasPreviousPage || false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const refetch = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  const suspendUser = useCallback(async (id: string, reason: string, suspendUntil?: string, isPermanent = false) => {
    try {
      await usersService.suspendUser(id, reason, suspendUntil, isPermanent);
      refetch();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to suspend user' };
    }
  }, [refetch]);

  const banUser = useCallback(async (id: string, reason: string, isPermanent = true) => {
    try {
      await usersService.banUser(id, reason, isPermanent);
      refetch();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to ban user' };
    }
  }, [refetch]);

  const deleteUser = useCallback(async (id: string, reason: string, deleteAllContent = false) => {
    try {
      await usersService.deleteUser(id, reason, deleteAllContent);
      refetch();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete user' };
    }
  }, [refetch]);

  const sendMessage = useCallback(async (id: string, subject: string, message: string, isUrgent = false) => {
    try {
      await usersService.sendMessageToUser(id, subject, message, isUrgent);
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to send message' };
    }
  }, []);

  const updateRoles = useCallback(async (id: string, roleNames: string[]) => {
    try {
      await usersService.updateUserRoles(id, roleNames);
      refetch();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update roles' };
    }
  }, [refetch]);

  const impersonateUser = useCallback(async (id: string, reason: string, durationMinutes = 60) => {
    try {
      const result = await usersService.impersonateUser(id, reason, durationMinutes);
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to impersonate user' };
    }
  }, []);

  return {
    users,
    loading,
    error,
    totalCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    refetch,
    suspendUser,
    banUser,
    deleteUser,
    sendMessage,
    updateRoles,
    impersonateUser
  };
};