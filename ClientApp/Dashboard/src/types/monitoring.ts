// Monitoring and Analytics Types

export interface ModelMetrics {
  accuracy: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
  memoryUsage: number;
  cpuUsage: number;
  gpuUsage?: number;
  networkIO: number;
}

export interface PerformanceMetric {
  label: string;
  value: string;
  change: string;
  icon: any;
  color: string;
  trend: 'up' | 'down' | 'stable';
  unit?: string;
}

export interface ErrorDistribution {
  type: string;
  count: number;
  percentage: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
}

export interface SystemResource {
  name: string;
  usage: number;
  limit: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  icon: any;
  color: string;
}

export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: 'greater_than' | 'less_than' | 'equals';
  threshold: number;
  enabled: boolean;
  severity: 'info' | 'warning' | 'error' | 'critical';
  notifications: string[];
}

export interface MonitoringDashboard {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  refreshInterval: number;
  timeRange: string;
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'alert';
  title: string;
  position: { x: number; y: number; width: number; height: number };
  config: Record<string, any>;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill?: boolean;
  }[];
}