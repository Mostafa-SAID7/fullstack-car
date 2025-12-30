export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  refreshToken: string;
  user: UserInfo;
  expiresAt: string;
}

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
  roles: string[];
  isActive: boolean;
  isEmailConfirmed: boolean;
  createdAt: string;
}

export interface RefreshTokenRequest {
  token: string;
  refreshToken: string;
}

export interface ConfirmEmailRequest {
  userId: string;
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// OAuth Models
export interface GoogleLoginRequest {
  idToken: string;
}

export interface GitHubLoginRequest {
  code: string;
  state?: string;
}

export interface FacebookLoginRequest {
  accessToken: string;
}

export interface ExternalLoginInfo {
  provider: string;
  providerKey: string;
  displayName?: string;
  email?: string;
  linkedAt: string;
  isActive: boolean;
}

// Profile Models
export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  bio?: string;
  phoneNumber?: string;
  isEmailPublic: boolean;
  isPhonePublic: boolean;
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
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

// Security Models
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