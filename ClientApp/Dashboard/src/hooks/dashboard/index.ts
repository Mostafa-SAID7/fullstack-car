// Dashboard Hook - Main Export (composed from sub-modules)

import { useDashboardState } from './state';
import { useDashboardData } from './data';
import { useDashboardEffects } from './effects';

export const useDashboard = () => {
  const {
    stats,
    userAnalytics,
    contentAnalytics,
    systemAnalytics,
    revenueAnalytics,
    loading,
    setStats,
    setUserAnalytics,
    setContentAnalytics,
    setSystemAnalytics,
    setRevenueAnalytics,
    setLoading
  } = useDashboardState();

  const { fetchDashboardData } = useDashboardData(
    setStats,
    setUserAnalytics,
    setContentAnalytics,
    setSystemAnalytics,
    setRevenueAnalytics
  );

  // Initialize effects
  useDashboardEffects(fetchDashboardData, setLoading);

  return {
    stats,
    userAnalytics,
    contentAnalytics,
    systemAnalytics,
    revenueAnalytics,
    loading
  };
};
