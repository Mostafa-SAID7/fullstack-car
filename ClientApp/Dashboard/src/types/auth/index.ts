// Authentication Types

export interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string; // Changed from fullName to name to match auth service usage
  avatar?: string;
  roles: string[]; // Changed from role to roles array to match auth service usage
  permissions?: string[];
  isActive: boolean; // Added for status management
  status?: 'active' | 'inactive' | 'suspended' | 'pending'; // Added status property
  isEmailConfirmed: boolean; // Changed from isEmailVerified to match auth service
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
  preferences?: UserPreferences;
}

export type UserRole = 'admin' | 'manager' | 'user' | 'guest';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  dashboard: DashboardPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

export interface DashboardPreferences {
  layout: 'grid' | 'list';
  density: 'compact' | 'comfortable' | 'spacious';
  sidebarCollapsed: boolean;
  widgets: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  user: UserInfo;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse extends AuthResponse {
  // Alias for backward compatibility
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
}

export interface ProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isEmailConfirmed: boolean;
  createdAt: string;
  updatedAt?: string;
  preferences?: UserPreferences;
}

export interface SecurityLogResponse {
  logs: SecurityLog[];
  totalCount: number;
}

export interface SecurityLog {
  id: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  success: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface UserSessionResponse {
  sessions: UserSession[];
  currentSessionId: string;
}

export interface UserSession {
  id: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  isCurrentSession: boolean;
  lastActivity: string;
  createdAt: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

// Auth State
export interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

// Auth Context
export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  verifyEmail: (data: VerifyEmailRequest) => Promise<void>;
  resendVerification: (data: ResendVerificationRequest) => Promise<void>;
  clearError: () => void;
}