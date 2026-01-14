// Admin Analytics Hook - State Management

import { useState } from 'react';
import type { AdvancedAnalytics } from '../../services/admin';

export const useAdminAnalyticsState = () => {
  const [data, setData] = useState<AdvancedAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');

  return {
    data,
    loading,
    period,
    setData,
    setLoading,
    setPeriod
  };
};





