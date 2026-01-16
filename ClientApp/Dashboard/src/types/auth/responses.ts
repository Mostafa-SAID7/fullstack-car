/**
 * Authentication Response Types
 * All response DTOs for authentication and identity operations
 */

import type { UserDto, SessionDto, SecurityLogDto, UserRole, UserStatus, UserPreferences } from './index';

/**
 * Login Response
 * Response returned after successful login
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  refreshToken: string;
  user: UserDto;
  expiresAt: string;
}

/**
 * Profile Response
 * Complete user profile information
 */
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
  roles: UserRole[];
  isActive: boolean;
  isEmailConfirmed: boolean;
  status: UserStatus;
  createdAt: string;
  lastLoginAt?: string;
  preferredLanguage?: string;
  preferences?: UserPreferences;
}

/**
 * User Session Response
 * Information about a single user session
 */
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

/**
 * Session List Response
 * Response containing list of user sessions
 */
export interface SessionListResponse {
  sessions: SessionDto[];
  currentSessionId: string;
  totalCount: number;
}

/**
 * Two Factor Setup Response
 * Data returned when setting up 2FA/MFA
 */
export interface TwoFactorSetupResponse {
  sharedKey: string;
  authenticatorUri: string;
  qrCodeUri: string;
  recoveryCodes: string[];
}

/**
 * MFA Setup Response
 * Response when enabling multi-factor authentication
 */
export interface MFASetupResponse {
  qrCode: string;
  secret: string;
  backupCodes: string[];
}

/**
 * MFA Status Response
 * Current MFA configuration status
 */
export interface MFAStatusResponse {
  isEnabled: boolean;
  hasBackupCodes: boolean;
  trustedDevices: number;
}

/**
 * Security Log Response
 * Single security log entry
 */
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

/**
 * Security Log List Response
 * Paginated list of security logs
 */
export interface SecurityLogListResponse {
  logs: SecurityLogDto[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Upload Profile Image Response
 * Response after uploading profile image
 */
export interface UploadProfileImageResponse {
  imageUrl: string;
  thumbnailUrl?: string;
  uploadedAt: string;
}

/**
 * Terminate Session Response
 * Response after terminating a session
 */
export interface TerminateSessionResponse {
  success: boolean;
  message: string;
  sessionId: string;
}

/**
 * OAuth Provider Info Response
 * Information about linked OAuth providers
 */
export interface OAuthProviderInfoResponse {
  provider: 'google' | 'facebook' | 'microsoft' | 'github';
  isLinked: boolean;
  linkedAt?: string;
  email?: string;
  displayName?: string;
}

/**
 * OAuth Providers List Response
 * List of all OAuth provider statuses
 */
export interface OAuthProvidersListResponse {
  providers: OAuthProviderInfoResponse[];
}

/**
 * Email Verification Response
 * Response after email verification
 */
export interface EmailVerificationResponse {
  success: boolean;
  message: string;
  isVerified: boolean;
}

/**
 * Password Reset Response
 * Response after password reset request
 */
export interface PasswordResetResponse {
  success: boolean;
  message: string;
}

/**
 * Change Password Response
 * Response after changing password
 */
export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

/**
 * API Result
 * Generic API response wrapper
 */
export interface ApiResult<T = any> {
  succeeded: boolean;
  data?: T;
  errors?: string[];
  message?: string;
}

/**
 * Paginated Result
 * Generic paginated response wrapper
 */
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Token Response
 * JWT token information
 */
export interface TokenResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  tokenType: string;
}

/**
 * Refresh Token Response
 * Response after refreshing access token
 */
export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
}
