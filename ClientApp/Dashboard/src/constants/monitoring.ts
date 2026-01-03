// Monitoring and Analytics Constants

export const PERFORMANCE_METRICS = [
  { key: 'accuracy', label: 'Accuracy', unit: '%', color: 'blue' },
  { key: 'responseTime', label: 'Response Time', unit: 'ms', color: 'green' },
  { key: 'throughput', label: 'Throughput', unit: 'req/s', color: 'purple' },
  { key: 'errorRate', label: 'Error Rate', unit: '%', color: 'red' },
  { key: 'memoryUsage', label: 'Memory Usage', unit: 'MB', color: 'orange' },
  { key: 'cpuUsage', label: 'CPU Usage', unit: '%', color: 'yellow' }
] as const;

export const ALERT_SEVERITIES = [
  { value: 'info', label: 'Info', color: 'blue' },
  { value: 'warning', label: 'Warning', color: 'yellow' },
  { value: 'error', label: 'Error', color: 'red' },
  { value: 'critical', label: 'Critical', color: 'red' }
] as const;

export const MONITORING_INTERVALS = [
  { value: 5, label: '5 seconds' },
  { value: 10, label: '10 seconds' },
  { value: 30, label: '30 seconds' },
  { value: 60, label: '1 minute' },
  { value: 300, label: '5 minutes' },
  { value: 900, label: '15 minutes' }
] as const;

export const TIME_RANGES = [
  { value: '1h', label: 'Last Hour' },
  { value: '6h', label: 'Last 6 Hours' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: 'custom', label: 'Custom Range' }
] as const;

export const CHART_TYPES = [
  { value: 'line', label: 'Line Chart' },
  { value: 'bar', label: 'Bar Chart' },
  { value: 'area', label: 'Area Chart' },
  { value: 'pie', label: 'Pie Chart' },
  { value: 'doughnut', label: 'Doughnut Chart' }
] as const;

export const SYSTEM_RESOURCES = [
  { name: 'CPU', unit: '%', threshold: 80, icon: 'cpu' },
  { name: 'Memory', unit: '%', threshold: 85, icon: 'memory' },
  { name: 'Disk', unit: '%', threshold: 90, icon: 'disk' },
  { name: 'Network', unit: 'Mbps', threshold: 100, icon: 'network' }
] as const;

export const ERROR_TYPES = [
  'Timeout Errors',
  'Model Errors', 
  'API Errors',
  'Network Errors',
  'Validation Errors',
  'Authentication Errors'
] as const;

export const DASHBOARD_REFRESH_INTERVALS = [
  { value: 0, label: 'Manual' },
  { value: 5000, label: '5 seconds' },
  { value: 10000, label: '10 seconds' },
  { value: 30000, label: '30 seconds' },
  { value: 60000, label: '1 minute' },
  { value: 300000, label: '5 minutes' }
] as const;