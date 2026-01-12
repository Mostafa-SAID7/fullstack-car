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

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: UserInfo;
  expiresAt: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserInfo;
  expiresAt: string;
}

// User roles and permissions
export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
}

export interface DashboardPreferences {
  layout: 'grid' | 'list';
  itemsPerPage: number;
  defaultView: string;
}

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

// Profile management
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  preferences?: UserPreferences;
}

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

// Security and sessions
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

export interface SecurityLogResponse {
  logs: SecurityLog[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

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

export interface UserSessionResponse {
  sessions: UserSession[];
  currentSessionId: string;
}

// Email verification
export interface VerifyEmailRequest {
  userId: string;
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

// Auth state management
export interface AuthState {
  user: UserInfo | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType {
  state: AuthState;
  login: (credentials: { email: string; password: string; rememberMe?: boolean }) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
}

export * from './requests';
export * from './oauth';