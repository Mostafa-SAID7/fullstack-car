// Common Types and Enums

export type TabId = 'overview' | 'training' | 'models' | 'monitoring' | 'datasets' | 'settings';

export interface TabConfig {
  id: TabId;
  label: string;
  icon: any;
}

export type Status = 'running' | 'completed' | 'failed' | 'paused' | 'success' | 'error';

export interface ActivityLog {
  user: string;
  query: string;
  time: string;
  status: 'success' | 'error';
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}