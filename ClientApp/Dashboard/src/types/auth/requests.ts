/**
 * Authentication Request Types
 * All request DTOs for authentication and identity operations
 */

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
 * Request to refresh access token using refresh token
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
 * Request to reset password with token from email
 */
export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Change Password Request
 * Request to change password when user is authenticated
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
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
 * Upload Profile Image Request
 * Request to upload user profile image
 */
export interface UploadProfileImageRequest {
  image: File;
}

/**
 * Terminate Session Request
 * Request to terminate a specific user session
 */
export interface TerminateSessionRequest {
  sessionId: string;
}

/**
 * Terminate All Sessions Request
 * Request to terminate all user sessions except current
 */
export interface TerminateAllSessionsRequest {
  exceptCurrentSession: boolean;
}

/**
 * Enable MFA Request
 * Request to enable multi-factor authentication
 */
export interface EnableMFARequest {
  verificationCode: string;
}

/**
 * Disable MFA Request
 * Request to disable multi-factor authentication
 */
export interface DisableMFARequest {
  password: string;
  verificationCode: string;
}

/**
 * Verify MFA Request
 * Request to verify MFA code during login
 */
export interface VerifyMFARequest {
  code: string;
  trustDevice?: boolean;
}

/**
 * OAuth Link Request
 * Request to link an OAuth provider account
 */
export interface OAuthLinkRequest {
  provider: 'google' | 'facebook' | 'microsoft' | 'github';
  code: string;
  state?: string;
}

/**
 * OAuth Unlink Request
 * Request to unlink an OAuth provider account
 */
export interface OAuthUnlinkRequest {
  provider: 'google' | 'facebook' | 'microsoft' | 'github';
}

/**
 * Verify Email Request
 * Request to verify email address with token
 */
export interface VerifyEmailRequest {
  userId: string;
  token: string;
}

/**
 * Resend Verification Email Request
 * Request to resend email verification
 */
export interface ResendVerificationRequest {
  email: string;
}

/**
 * Get Security Logs Request
 * Query parameters for fetching security logs
 */
export interface GetSecurityLogsRequest {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  action?: string;
  success?: boolean;
}
