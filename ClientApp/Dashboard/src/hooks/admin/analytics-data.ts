// Admin Analytics Hook - Data Fetching Functions

import { adminService } from '../../services/admin';

export const useAdminAnalyticsData = (
  setData: (data: any) => void,
  setLoading: (loading: boolean) => void
) => {
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

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAdvancedAnalytics();
      if (response.succeeded && response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchData,
    refreshData
  };
};



