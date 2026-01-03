import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import type { AdvancedAnalytics } from '../services/adminService';

export const useAnalytics = () => {
  const [data, setData] = useState<AdvancedAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await adminService.getAdvancedAnalytics();
        if (response.succeeded && response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  return {
    data,
    loading,
    period,
    setPeriod
  };
};