// User Activity Types
export interface UserActivity {
  id: string;
  activityType: string;
  description: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  metadata: Record<string, any>;
}

export interface SecurityLog {
  id: string;
  userId: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
  details?: string;
}

export const ActivityType = {
  Login: 'Login',
  Logout: 'Logout',
  ProfileUpdate: 'ProfileUpdate',
  PasswordChange: 'PasswordChange',
  EmailChange: 'EmailChange',
  PostCreated: 'PostCreated',
  CommentAdded: 'CommentAdded',
  GroupJoined: 'GroupJoined',
  ReviewSubmitted: 'ReviewSubmitted'
} as const;

export type ActivityType = typeof ActivityType[keyof typeof ActivityType];