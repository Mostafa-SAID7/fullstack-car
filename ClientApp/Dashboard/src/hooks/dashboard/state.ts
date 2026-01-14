// Dashboard Hook - State Management

import { useState } from 'react';
import type {
  DashboardStats,
  UserAnalytics,
  ContentAnalytics,
  SystemAnalytics,
  RevenueAnalytics
} from '../../types/dashboard';

export const useDashboardState = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [contentAnalytics, setContentAnalytics] = useState<ContentAnalytics | null>(null);
  const [systemAnalytics, setSystemAnalytics] = useState<SystemAnalytics | null>(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  return {
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
  };
};





