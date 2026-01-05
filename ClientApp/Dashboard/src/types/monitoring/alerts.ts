// Monitoring Alerts Types

export interface ErrorDistribution {
  type: string;
  count: number;
  percentage: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
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
