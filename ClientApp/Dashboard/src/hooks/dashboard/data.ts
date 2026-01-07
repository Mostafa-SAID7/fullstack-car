import { useCallback } from 'react';
import { dashboardService } from '../../services/dashboard';

export const useDashboardData = (
  setStats: (stats: any) => void,
  setUserAnalytics: (data: any) => void,
  setContentAnalytics: (data: any) => void,
  setSystemAnalytics: (data: any) => void,
  setRevenueAnalytics: (data: any) => void
) => {
  const fetchDashboardData = useCallback(async () => {
    try {
      const [
        statsResult,
        userResult,
        contentResult,
        systemResult,
        revenueResult
      ] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getUserAnalytics(),
        dashboardService.getContentAnalytics(),
        dashboardService.getSystemAnalytics(),
        dashboardService.getRevenueAnalytics()
      ]);

      setStats(statsResult.succeeded ? statsResult.data : null);
      setUserAnalytics(userResult.succeeded ? userResult.data : null);
      setContentAnalytics(contentResult.succeeded ? contentResult.data : null);
      setSystemAnalytics(systemResult.succeeded ? systemResult.data : null);
      setRevenueAnalytics(revenueResult.succeeded ? revenueResult.data : null);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  }, [setStats, setUserAnalytics, setContentAnalytics, setSystemAnalytics, setRevenueAnalytics]);

  return {
    fetchDashboardData
  };
};



