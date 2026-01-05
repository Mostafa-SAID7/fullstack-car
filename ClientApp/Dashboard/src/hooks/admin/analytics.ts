// Admin Analytics Hook - Main Export (composed from sub-modules)

import { useAdminAnalyticsState } from './analytics-state';
import { useAdminAnalyticsData } from './analytics-data';
import { useAdminAnalyticsEffects } from './analytics-effects';

export const useAnalytics = () => {
  const {
    data,
    loading,
    period,
    setData,
    setLoading,
    setPeriod
  } = useAdminAnalyticsState();

  const { fetchData, refreshData } = useAdminAnalyticsData(setData, setLoading);

  // Initialize effects
  useAdminAnalyticsEffects(fetchData, period);

  return {
    data,
    loading,
    period,
    setPeriod,
    refreshData
  };
};
