import { useState, useEffect, useCallback } from 'react';
import { reportsService } from '../services/reportsService';
import type { UserReport } from '../types/report';

export const useUserReports = (userId: string) => {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async (params?: {
    page?: number;
    pageSize?: number;
    isResolved?: boolean;
    category?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await reportsService.getUserReports(userId, params);
      setReports(response || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const resolveReport = useCallback(async (reportId: string, resolution: string) => {
    try {
      await reportsService.resolveReport(reportId, resolution);
      fetchReports(); // Refresh the list
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to resolve report' };
    }
  }, [fetchReports]);

  useEffect(() => {
    if (userId) {
      fetchReports();
    }
  }, [userId, fetchReports]);

  return {
    reports,
    loading,
    error,
    fetchReports,
    resolveReport,
    refetch: fetchReports
  };
};