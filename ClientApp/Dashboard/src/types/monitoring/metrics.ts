// Monitoring Metrics Types

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

export interface SystemResource {
  name: string;
  usage: number;
  limit: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  icon: any;
  color: string;
}
