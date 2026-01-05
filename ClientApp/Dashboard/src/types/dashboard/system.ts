// System Information Types

import type { SystemMetrics } from './metrics';
import type { DatabaseMetrics } from './database-metrics';

export interface SystemInfo {
  version: string;
  environment: string;
  serverTime: string;
  databaseStatus: string;
  aiServiceStatus: string;
  cacheStatus: string;
  uptime: string;
  systemMetrics: SystemMetrics;
  databaseMetrics: DatabaseMetrics;
}

export interface Activity {
  type: string;
  user: string;
  title: string;
  timestamp: string;
  icon: string;
  priority: string;
}

export interface SystemAlert {
  message: string;
  timestamp: string;
  type: string;
  severity: string;
}

