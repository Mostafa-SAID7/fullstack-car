// User Core Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  profileImageUrl?: string;
  isActive: boolean;
  isEmailConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
  lastLogin?: string;
  joinDate: string;
  status: string;
  roles: string[];
  postsCount?: number;
  groupsCount?: number;
  reviewsCount?: number;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: SocialLinks;
  preferences?: UserPreferences;
  statistics?: UserActivityStats;
}

export interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  profileImageUrl?: string;
  isActive: boolean;
  roles: string[];
  lastLoginAt?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
  isEmailPublic: boolean;
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
}

export interface UserActivityStats {
  postsCount: number;
  commentsCount: number;
  likesReceived: number;
  likesGiven: number;
  groupsCount: number;
  reviewsCount: number;
  averageRating: number;
  lastActiveAt: string;
  totalLoginCount: number;
  averageSessionDuration: number;
}

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  github?: string;
  website?: string;
}

export interface UserAction {
  success: boolean;
  message: string;
  data?: Record<string, any>;
}

export interface Impersonation {
  token: string;
  expiresAt: string;
  targetUserId: string;
  targetUserName: string;
}

// Enums as const objects for TypeScript compatibility
export const UserStatus = {
  Active: 'Active',
  Inactive: 'Inactive',
  Suspended: 'Suspended',
  Banned: 'Banned',
  PendingVerification: 'PendingVerification'
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];