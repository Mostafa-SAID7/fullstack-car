// Monitoring Dashboard Types

export interface MonitoringDashboard {
  id: string;
  name: string;
  widgets: MonitoringWidget[];
  refreshInterval: number;
  timeRange: string;
}

export interface MonitoringWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'alert';
  title: string;
  position: { x: number; y: number; width: number; height: number };
  config: Record<string, any>;
}
