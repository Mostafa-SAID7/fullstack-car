/**
 * Authentication Models
 * Shared types for authentication and identity operations
 * Matches backend DTOs and Dashboard types
 */

/**
 * User Status Enum
 * Matches backend Domain.Enums.Identity.UserStatus
 */
export enum UserStatus {
  Active = 1,
  Inactive = 2,
  Suspended = 3,
  Banned = 4,
  PendingVerification = 5
}

/**
 * User Role Enum
 * Matches backend predefined roles from IdentitySeeder
 */
export enum UserRole {
  Admin = 'Admin',
  Moderator = 'Moderator',
  User = 'User',
  Premium = 'Premium',
  ServiceProvider = 'ServiceProvider',
  SuperAdmin = 'SuperAdmin'
}

/**
 * User DTO
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
 * @deprecated Use UserDto instead
 */
export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
  roles: string[];
  isActive: boolean;
  emailConfirmed: boolean;
}

/**
 * Login Request
 * Credentials for user authentication
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Login Response
 * Response returned after successful login
 */
export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: UserDto;
  expiresAt: string;
}

/**
 * Register Request
 * Data required for new user registration
 */
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  acceptTerms: boolean;
}

/**
 * Refresh Token Request
 * Request to refresh access token
 */
export interface RefreshTokenRequest {
  token: string;
  refreshToken: string;
}

/**
 * Confirm Email Request
 * Request to confirm user email address
 */
export interface ConfirmEmailRequest {
  userId: string;
  token: string;
}

/**
 * Forgot Password Request
 * Request to initiate password reset flow
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Reset Password Request
 * Request to reset password with token
 */
export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Change Password Request
 * Request to change password when authenticated
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Profile DTO
 * Complete user profile information
 */
export interface ProfileDto {
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
 * Update Profile Request
 * Fields that can be updated in user profile
 */
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  bio?: string;
  profileImageUrl?: string;
  isEmailPublic?: boolean;
  isPhonePublic?: boolean;
  allowDirectMessages?: boolean;
  showOnlineStatus?: boolean;
  preferredLanguage?: string;
}

/**
 * @deprecated Use ProfileDto instead
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
  createdAt: string;
  lastLoginAt?: string;
}

/**
 * Session DTO
 * Represents an active user session
 */
export interface SessionDto {
  id: string;
  userId: string;
  deviceName: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  lastActivity: string;
  createdAt: string;
}

/**
 * @deprecated Use SessionDto instead
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
 * Security Log DTO
 * Audit trail entry for security events
 */
export interface SecurityLogDto {
  id: string;
  userId: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
  details?: string;
}

/**
 * @deprecated Use SecurityLogDto instead
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
 * OAuth Provider Type
 * Supported third-party authentication providers
 */
export type OAuthProvider = 'google' | 'facebook' | 'microsoft' | 'github';

/**
 * Google Login Request
 * Request to authenticate with Google
 */
export interface GoogleLoginRequest {
  idToken: string;
  accessToken?: string;
}

/**
 * GitHub Login Request
 * Request to authenticate with GitHub
 */
export interface GitHubLoginRequest {
  code: string;
  state?: string;
}

/**
 * Facebook Login Request
 * Request to authenticate with Facebook
 */
export interface FacebookLoginRequest {
  accessToken: string;
  userId?: string;
}

/**
 * Microsoft Login Request
 * Request to authenticate with Microsoft
 */
export interface MicrosoftLoginRequest {
  code: string;
  state?: string;
}

/**
 * OAuth Link Request
 * Request to link an OAuth account
 */
export interface OAuthLinkRequest {
  provider: OAuthProvider;
  code: string;
  state?: string;
}

/**
 * OAuth Unlink Request
 * Request to unlink an OAuth account
 */
export interface OAuthUnlinkRequest {
  provider: OAuthProvider;
}

/**
 * External Login Info
 * Information about linked external login provider
 */
export interface ExternalLoginInfo {
  provider: OAuthProvider;
  providerKey: string;
  displayName?: string;
  email?: string;
  linkedAt: string;
  isActive: boolean;
}

/**
 * MFA Setup Response
 * Data returned when setting up multi-factor authentication
 */
export interface MFASetupResponse {
  qrCode: string;
  secret: string;
  backupCodes: string[];
}

/**
 * MFA Verify Request
 * Request to verify MFA code
 */
export interface MFAVerifyRequest {
  code: string;
  trustDevice?: boolean;
}

/**
 * @deprecated Use MFASetupResponse instead
 */
export interface TwoFactorSetupResponse {
  sharedKey: string;
  authenticatorUri: string;
  qrCodeUri: string;
  recoveryCodes: string[];
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
 * Session List Response
 * Response containing list of user sessions
 */
export interface SessionListResponse {
  sessions: SessionDto[];
  currentSessionId: string;
  totalCount: number;
}

/**
 * Security Log List Response
 * Paginated response for security logs
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
