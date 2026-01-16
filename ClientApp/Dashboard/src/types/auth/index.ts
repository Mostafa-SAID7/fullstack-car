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
 * Matches backend LoginResponse DTO
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
  preferences?: UserPreferences;
}

/**
 * Session DTO
 * Represents an active user session
 * Matches backend UserSession entity
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
 * Security Log DTO
 * Audit trail entry for security events
 * Matches backend SecurityLog entity
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
 * OAuth Provider Type
 * Supported third-party authentication providers
 */
export type OAuthProvider = 'google' | 'facebook' | 'microsoft' | 'github';

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
}

/**
 * MFA Enable Request
 * Request to enable MFA for user account
 */
export interface MFAEnableRequest {
  verificationCode: string;
}

/**
 * Password Change Request
 * Request to change user password when authenticated
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
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
 * Refresh Token Request
 * Request to refresh access token
 */
export interface RefreshTokenRequest {
  token: string;
  refreshToken: string;
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
 * Dashboard Preferences
 * Dashboard-specific display preferences
 */
export interface DashboardPreferences {
  layout: 'grid' | 'list';
  itemsPerPage: number;
  defaultView: string;
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
 * Role Details
 * Detailed information about a user role
 */
export interface RoleDetails {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  priority: number;
  isSystemRole: boolean;
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
 * Email Verification Request
 * Request to verify email address
 */
export interface VerifyEmailRequest {
  userId: string;
  token: string;
}

/**
 * Resend Verification Request
 * Request to resend email verification
 */
export interface ResendVerificationRequest {
  email: string;
}

/**
 * Auth State
 * Application authentication state
 */
export interface AuthState {
  user: UserDto | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Auth Context Type
 * Type definition for authentication context
 */
export interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
}

// ============================================
// DEPRECATED TYPES (for backward compatibility)
// ============================================

/**
 * @deprecated Use UserDto instead
 */
export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
  isEmailConfirmed: boolean;
  createdAt: string;
  profileImageUrl?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
}

/**
 * @deprecated Use LoginResponse instead
 */
export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserInfo;
  expiresAt: string;
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
  profileImageUrl?: string;
  roles: string[];
  isActive: boolean;
  isEmailConfirmed: boolean;
  createdAt: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  preferences: UserPreferences;
}

/**
 * @deprecated Use SessionDto instead
 */
export interface UserSession {
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
 * @deprecated Use SessionListResponse instead
 */
export interface UserSessionResponse {
  sessions: UserSession[];
  currentSessionId: string;
}

/**
 * @deprecated Use SecurityLogDto instead
 */
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

/**
 * @deprecated Use SecurityLogListResponse instead
 */
export interface SecurityLogResponse {
  logs: SecurityLog[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

// Re-export from other files for convenience
export * from './requests';
export * from './oauth';
