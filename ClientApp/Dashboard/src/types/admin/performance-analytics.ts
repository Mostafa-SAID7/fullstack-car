// Admin Performance Analytics Types

export interface PerformanceAnalytics {
  averageResponseTime: number;
  throughput: number;
  errorRate: number;
  trends: PerformanceTrendData[];
  endpoints: EndpointData[];
}

export interface PerformanceTrendData {
  date: string;
  responseTime: number;
  throughput: number;
  errorRate: number;
}

export interface EndpointData {
  endpoint: string;
  method: string;
  responseTime: number;
  requestCount: number;
  errorCount: number;
}



