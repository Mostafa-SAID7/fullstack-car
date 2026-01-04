// Common Types and Enums

export interface TabConfig {
  id: string;
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