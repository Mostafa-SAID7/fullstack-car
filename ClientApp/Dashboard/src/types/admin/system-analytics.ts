// Admin System Analytics Types

export interface SystemAnalytics {
  uptime: number;
  resourceUsage: ResourceUsageData[];
  errorLogs: ErrorLogData[];
}

export interface ResourceUsageData {
  resource: string;
  usage: number;
  limit: number;
  timestamp: string;
}

export interface ErrorLogData {
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  source: string;
  userId?: string;
}







