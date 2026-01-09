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

export * from './requests';
export * from './oauth';