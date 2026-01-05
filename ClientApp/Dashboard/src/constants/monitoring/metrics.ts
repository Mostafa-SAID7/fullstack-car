// Monitoring Metrics Constants

export const PERFORMANCE_METRICS = [
  { key: 'accuracy', label: 'Accuracy', unit: '%', color: 'blue' },
  { key: 'responseTime', label: 'Response Time', unit: 'ms', color: 'green' },
  { key: 'throughput', label: 'Throughput', unit: 'req/s', color: 'purple' },
  { key: 'errorRate', label: 'Error Rate', unit: '%', color: 'red' },
  { key: 'memoryUsage', label: 'Memory Usage', unit: 'MB', color: 'orange' },
  { key: 'cpuUsage', label: 'CPU Usage', unit: '%', color: 'yellow' }
] as const;



