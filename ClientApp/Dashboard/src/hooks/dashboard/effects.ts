// Dashboard Hook - Effects

import { useEffect } from 'react';

export const useDashboardEffects = (
  fetchDashboardData: () => Promise<void>,
  setLoading: (loading: boolean) => void
) => {
  useEffect(() => {
    const loadData = async () => {
      await fetchDashboardData();
      setLoading(false);
    };

    loadData();
  }, [fetchDashboardData, setLoading]);

  return {};
};



