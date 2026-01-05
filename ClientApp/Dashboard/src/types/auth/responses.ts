// Authentication Response Types

import type { UserInfo } from './user';

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  refreshToken: string;
  user: UserInfo;
  expiresAt: string;
}

export interface ProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  bio?: string;
  profileImageUrl?: string;
  isEmailPublic: boolean;
  isPhonePublic: boolean;
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserSessionResponse {
  sessionId: string;
  deviceInfo?: string;
  ipAddress?: string;
  location?: string;
  lastActivity: string;
  createdAt: string;
  expiresAt?: string;
  isCurrentSession: boolean;
  isActive: boolean;
}

export interface TwoFactorSetupResponse {
  sharedKey: string;
  authenticatorUri: string;
  qrCodeUri: string;
  recoveryCodes: string[];
}

export interface SecurityLogResponse {
  id: string;
  eventType: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  isSuccessful: boolean;
  additionalData?: string;
}

export interface ApiResult<T = any> {
  succeeded: boolean;
  data?: T;
  errors?: string[];
  message?: string;
}
