// System Page Component Types

export interface Metrics {
  usage?: number;
  used?: number;
  total?: number;
  percentage?: number;
  cores?: number;
  in?: number;
  out?: number;
}

export interface SystemMetricsProps {
  performanceMetrics: {
    cpu: Metrics;
    memory: Metrics;
    disk: Metrics;
    network: Metrics;
  };
  loading?: boolean;
}

export interface Service {
  name: string;
  status: string;
  port: number | null;
  description?: string;
  version?: string;
}

export interface SystemServicesProps {
  systemInfo: {
    services: Service[];
  };
  getServiceStatus: (status: string) => 'success' | 'error';
  loading?: boolean;
}

export interface SystemResourcesProps {
  resources: {
    cpu: Metrics;
    memory: Metrics;
    disk: Metrics;
    network: Metrics;
  };
  loading?: boolean;
}

export interface SystemOverviewProps {
  systemInfo: any;
  loading?: boolean;
}

export interface SystemHeaderProps {
  title?: string;
  subtitle?: string;
  lastUpdated?: string;
}
