// System Metrics Types

import type { DatabaseMetrics } from './database-metrics';

export interface SystemMetrics {
  workingSet: number;
  privateMemory: number;
  threadCount: number;
  handleCount: number;
}

export interface MemoryUsage {
  workingSet: number;
  privateMemory: number;
  gcMemory: number;
}

export interface DiskUsage {
  used: number;
  available: number;
  total: number;
}

export interface NetworkTraffic {
  incoming: number;
  outgoing: number;
}

export interface ResponseTimes {
  average: number;
  p95: number;
  p99: number;
}

export interface CacheMetrics {
  hitRate: number;
  missRate: number;
  totalKeys: number;
  memoryUsage: string;
}

export interface SystemPerformanceMetrics {
  cpuUsage: number;
  memoryUsage: MemoryUsage;
  diskUsage: DiskUsage;
  networkTraffic: NetworkTraffic;
  responseTimes: ResponseTimes;
  errorRate: number;
  databaseMetrics: DatabaseMetrics;
  cacheMetrics: CacheMetrics;
}

