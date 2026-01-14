// Dashboard Main Component Props Types

export interface DashboardChartsProps {
  userAnalytics: import('../../dashboard/analytics').UserAnalytics | null;
  contentAnalytics: import('../../dashboard/analytics').ContentAnalytics | null;
  systemAnalytics: import('../../dashboard/analytics').SystemAnalytics | null;
  revenueAnalytics: import('../../dashboard/analytics').RevenueAnalytics | null;
  loading: boolean;
  chartType?: 'line' | 'bar' | 'area' | 'pie';
}

export interface DashboardStatsProps {
  stats: import('../../dashboard/stats').DashboardStats | null;
  loading: boolean;
}

export interface DashboardAnalyticsProps {
  userAnalytics: import('../../dashboard/analytics').UserAnalytics | null;
  contentAnalytics: import('../../dashboard/analytics').ContentAnalytics | null;
  revenueAnalytics: import('../../dashboard/analytics').RevenueAnalytics | null;
  loading: boolean;
}

export interface DashboardHeaderProps {
  user: import('../../auth/user').UserInfo | null;
  title?: string;
  subtitle?: string;
  showActions?: boolean;
  className?: string;
}

export interface DashboardActionsProps {
  onRefresh?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  loading?: boolean;
}






