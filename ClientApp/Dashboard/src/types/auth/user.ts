/**
 * User Types
 * Core user entity types
 */

import type { UserRole, UserStatus } from './index';

/**
 * User DTO
 * Complete user data transfer object
 * Matches backend ApplicationUser entity
 */
export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole[];
  isActive: boolean;
  isEmailConfirmed: boolean;
  status: UserStatus;
  profileImageUrl?: string;
  phoneNumber?: string;
  preferredLanguage?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * User Info (Simplified)
 * Simplified user information for display
 */
export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  profileImageUrl?: string;
  roles: string[];
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
  isActive: boolean;
  isEmailConfirmed: boolean;
  createdAt: string;
}

/**
 * User Summary
 * Minimal user information for lists and references
 */
export interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
}

/**
 * Current User
 * Extended user information for authenticated user
 */
export interface CurrentUser extends UserDto {
  permissions: string[];
  preferences: UserPreferences;
  unreadNotifications: number;
  lastActivity: string;
}

/**
 * User Preferences
 * User-specific application preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
}

/**
 * Notification Preferences
 * User notification settings
 */
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: {
    security: boolean;
    updates: boolean;
    marketing: boolean;
  };
}

/**
 * User Profile
 * Complete user profile with all details
 */
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  bio?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  location?: string;
  website?: string;
  socialLinks?: SocialLinks;
  isEmailPublic: boolean;
  isPhonePublic: boolean;
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
  roles: UserRole[];
  isActive: boolean;
  isEmailConfirmed: boolean;
  status: UserStatus;
  createdAt: string;
  lastLoginAt?: string;
  preferredLanguage?: string;
  preferences: UserPreferences;
}

/**
 * Social Links
 * User's social media links
 */
export interface SocialLinks {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
}

/**
 * User Statistics
 * User activity and engagement statistics
 */
export interface UserStatistics {
  userId: string;
  postsCount: number;
  commentsCount: number;
  likesReceived: number;
  followersCount: number;
  followingCount: number;
  reputationScore: number;
  joinedDaysAgo: number;
}

/**
 * User Activity
 * Recent user activity entry
 */
export interface UserActivity {
  id: string;
  userId: string;
  activityType: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
