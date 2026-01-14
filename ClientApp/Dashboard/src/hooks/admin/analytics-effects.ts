// Admin Analytics Hook - Effects

import { useEffect } from 'react';

export const useAdminAnalyticsEffects = (
  fetchData: () => Promise<void>,
  period: string
) => {
  useEffect(() => {
    fetchData();
  }, [fetchData, period]);

  return {};
};






