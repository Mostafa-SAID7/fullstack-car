// Dashboard Hook - Effects

import { useEffect } from 'react';

export const useDashboardEffects = (
  fetchDashboardData: () => Promise<void>,
  setLoading: (loading: boolean) => void
) => {
  useEffect(() => {
    console.log('Dashboard Effect Running');
    const loadData = async () => {
      console.log('Fetching dashboard data...');
      await fetchDashboardData();
      console.log('Data fetched, setting loading false');
      setLoading(false);
    };

    loadData();
  }, [fetchDashboardData, setLoading]);

  return {};
};







