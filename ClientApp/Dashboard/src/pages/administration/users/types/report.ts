// User Report Types
export interface UserReport {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  category: string;
  description: string;
  createdAt: string;
  isResolved: boolean;
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}