import { useState, useEffect, useCallback } from 'react';
import { activitiesService } from '../services/activitiesService';
import type { UserActivity, SecurityLog } from '../types/activity';

export const useUserActivities = (userId: string) => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async (params?: {
    page?: number;
    pageSize?: number;
    activityType?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await activitiesService.getUserActivities(userId, params);
      setActivities(response || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchSecurityLogs = useCallback(async (params?: {
    page?: number;
    pageSize?: number;
    action?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await activitiesService.getUserSecurityLogs(userId, params);
      setSecurityLogs(response || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch security logs');
      setSecurityLogs([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchActivities();
      fetchSecurityLogs();
    }
  }, [userId, fetchActivities, fetchSecurityLogs]);

  return {
    activities,
    securityLogs,
    loading,
    error,
    fetchActivities,
    fetchSecurityLogs,
    refetch: () => {
      fetchActivities();
      fetchSecurityLogs();
    }
  };
};