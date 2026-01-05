// Activity Log Types

export interface ActivityLog {
  user: string;
  query: string;
  time: string;
  status: 'success' | 'error';
}

