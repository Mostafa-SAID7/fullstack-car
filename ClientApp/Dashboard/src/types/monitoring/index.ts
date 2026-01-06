// Monitoring Types

export interface ModelMetrics {
  id: string;
  modelId: string;
  timestamp: string;
  performance: PerformanceMetrics;
  usage: UsageMetrics;
  quality: QualityMetrics;
  errors: ErrorMetrics;
}

export interface PerformanceMetric {
  label: string;
  value: string;
  change: string;
  icon: any;
  color: string;
  trend: 'up' | 'down';
}

export interface ErrorDistribution {
  type: string;
  count: number;
  percentage: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface PerformanceMetrics {
  latency: {
    p50: number;
    p95: number;
    p99: number;
    average: number;
  };
  throughput: {
    requestsPerSecond: number;
    tokensPerSecond: number;
  };
  resourceUsage: {
    cpuUtilization: number;
    memoryUtilization: number;
    gpuUtilization?: number;
  };
}

export interface UsageMetrics {
  totalRequests: number;
  totalTokens: number;
  uniqueUsers: number;
  averageSessionLength: number;
  peakConcurrentUsers: number;
}

export interface QualityMetrics {
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  userSatisfaction?: number;
  responseRelevance?: number;
}

export interface ErrorMetrics {
  totalErrors: number;
  errorRate: number;
  errorsByType: Record<string, number>;
  criticalErrors: number;
}

export interface SystemHealth {
  status: HealthStatus;
  uptime: number;
  lastCheck: string;
  components: ComponentHealth[];
  alerts: HealthAlert[];
}

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';

export interface ComponentHealth {
  name: string;
  status: HealthStatus;
  message?: string;
  lastCheck: string;
  metrics?: Record<string, number>;
}

export interface HealthAlert {
  id: string;
  severity: AlertSeverity;
  component: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
}

export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface MonitoringDashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  layout: DashboardLayout;
  refreshInterval: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  config: WidgetConfig;
  position: WidgetPosition;
}

export type WidgetType = 
  | 'metric' 
  | 'chart' 
  | 'table' 
  | 'alert' 
  | 'status' 
  | 'log';

export interface WidgetConfig {
  dataSource: string;
  query?: string;
  timeRange?: TimeRange;
  refreshInterval?: number;
  visualization?: VisualizationConfig;
}

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DashboardLayout {
  columns: number;
  rowHeight: number;
  margin: [number, number];
  containerPadding: [number, number];
}

export interface TimeRange {
  start: string;
  end: string;
  relative?: string; // e.g., '1h', '24h', '7d'
}

export interface VisualizationConfig {
  type: 'line' | 'bar' | 'pie' | 'gauge' | 'number' | 'table';
  options?: Record<string, any>;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source: string;
  metadata?: Record<string, any>;
  tags?: string[];
}

export type LogLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical';

export interface LogFilter {
  level?: LogLevel;
  source?: string;
  timeRange?: TimeRange;
  search?: string;
  tags?: string[];
}

export interface MetricDefinition {
  name: string;
  description: string;
  type: MetricType;
  unit: string;
  aggregation: AggregationType;
  labels?: string[];
}

export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary';
export type AggregationType = 'sum' | 'average' | 'min' | 'max' | 'count';