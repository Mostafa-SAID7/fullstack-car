import { useState, useEffect, useCallback } from 'react';
import { statisticsService } from '../services/statisticsService';
import type { UserStatistics, UserDashboardStats } from '../types/statistics';

export const useUserStatistics = () => {
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [dashboardStats, setDashboardStats] = useState<UserDashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async (params?: {
    dateFrom?: string;
    dateTo?: string;
    groupBy?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await statisticsService.getUserStatistics(params);
      setStatistics(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await statisticsService.getDashboardStats();
      setDashboardStats(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
      setDashboardStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const exportStatistics = useCallback(async (format: 'csv' | 'excel' | 'pdf' = 'csv') => {
    try {
      const response = await statisticsService.exportUserStatistics(format);
      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to export statistics' };
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
    fetchDashboardStats();
  }, [fetchStatistics, fetchDashboardStats]);

  return {
    statistics,
    dashboardStats,
    loading,
    error,
    fetchStatistics,
    fetchDashboardStats,
    exportStatistics,
    refetch: () => {
      fetchStatistics();
      fetchDashboardStats();
    }
  };
};