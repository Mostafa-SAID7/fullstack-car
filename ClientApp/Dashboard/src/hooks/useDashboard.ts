import { useEffect, useState } from 'react';
import {
  dashboardService,
  type DashboardStats,
  type UserAnalytics,
  type ContentAnalytics,
  type SystemAnalytics,
  type RevenueAnalytics
} from '../services/dashboardService';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [contentAnalytics, setContentAnalytics] = useState<ContentAnalytics | null>(null);
  const [systemAnalytics, setSystemAnalytics] = useState<SystemAnalytics | null>(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          statsData,
          userData,
          contentData,
          systemData,
          revenueData
        ] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getUserAnalytics(),
          dashboardService.getContentAnalytics(),
          dashboardService.getSystemAnalytics(),
          dashboardService.getRevenueAnalytics()
        ]);

        setStats(statsData);
        setUserAnalytics(userData);
        setContentAnalytics(contentData);
        setSystemAnalytics(systemData);
        setRevenueAnalytics(revenueData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    stats,
    userAnalytics,
    contentAnalytics,
    systemAnalytics,
    revenueAnalytics,
    loading
  };
};